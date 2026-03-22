# Auth Design — GoItalIA

**Data:** 2026-03-22
**Stato:** Approvato
**Stack:** NextAuth v4 + Prisma + Nodemailer (SMTP Aruba)

---

## Obiettivo

Sistema di autenticazione completo per GoItalIA con:
- Registrazione email/password
- Login email/password
- Login Google OAuth
- Verifica email obbligatoria
- Recupero password via email

---

## Architettura

### Layer 1 — NextAuth (`src/app/api/auth/[...nextauth]/route.ts`)
- Provider `Credentials` per email/password (bcrypt per hash)
- Provider `Google` per OAuth
- Adapter Prisma per persistenza sessioni
- Strategia JWT per le sessioni
- Callback `signIn` per bloccare account non verificati
- Tutte le form usano `signIn()` di NextAuth (CSRF token incluso)

### Layer 2 — Middleware (`src/middleware.ts`)
- Protegge tutte le route `/dashboard/*` e `/onboarding/*`
- Redirect a `/login` se non autenticato
- Redirect a `/dashboard` se già autenticato e visita `/login` o `/registrati`
- Valida `passwordChangedAt` nel JWT per invalidare sessioni dopo reset password

### Layer 3 — Email Service (`src/lib/email.ts`)
- Nodemailer con SMTP Aruba
- Due template: verifica account + reset password
- Testi in italiano

### Layer 4 — Rate Limiting (middleware)
- Max 5 tentativi/minuto per POST `/api/auth/signin`
- Max 3 richieste/ora per endpoint reset password e reinvio verifica
- Implementato con contatore in-memory (fase MVP) — Redis in produzione

---

## Database

Modifiche allo schema Prisma:

```prisma
model User {
  // campi esistenti +
  passwordHash      String?   // nullable: account Google-only non hanno password
  emailVerified     DateTime?
  passwordChangedAt DateTime? // per invalidare sessioni dopo reset
}

// Tabella separata per i token (NON usa VerificationToken di NextAuth)
model AuthToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique // SHA-256 hash del token raw
  type      String   // "EMAIL_VERIFICATION" | "PASSWORD_RESET"
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])       // lookup veloce per hash
  @@index([userId, type]) // pulizia token per utente/tipo
}
```

Il token raw viene inviato nell'email. In DB si salva solo lo SHA-256 hash.

---

## Flussi

### Registrazione
1. Form: nome, email, password
2. Validazione: email unica, password min 8 caratteri
3. Hash password con bcrypt (10 rounds)
4. Crea `User` con `emailVerified: null`, `passwordHash`
5. Genera token raw casuale (32 bytes) → salva SHA-256 hash in `AuthToken` (type: EMAIL_VERIFICATION, scade 24h)
6. Invia email con link `/verifica-email?token=<raw>`
7. Redirect a `/controlla-email`

### Verifica Email
1. Click su link → GET `/verifica-email?token=<raw>`
2. Hash SHA-256 del token → cerca in `AuthToken` (type: EMAIL_VERIFICATION)
3. Se non trovato o scaduto → mostra errore con link per reinviare
4. Se valido → `User.emailVerified = now()` → elimina token
5. Redirect `/login?verificato=1`

### Reinvio Email di Verifica
- Route: POST `/api/auth/reinvia-verifica`
- Rate limit: max 3 richieste/ora per email
- Elimina token EMAIL_VERIFICATION esistenti per l'utente → genera nuovo token → invia email

### Login Email/Password
1. Form → `signIn("credentials", { email, password })` (CSRF gestito da NextAuth)
2. Credentials provider:
   a. Cerca User per email — se non trovato: bcrypt dummy compare (anti-timing) → errore generico
   b. Confronta hash password
   c. Se password errata → errore "Email o password non corretti"
   d. Verifica `emailVerified` → se null → errore "Verifica prima la tua email"
3. JWT include `{ id, email, name, passwordChangedAt }`
4. Redirect `/dashboard`

### Login Google
1. `signIn("google")` → OAuth flow
2. Callback NextAuth: se email già registrata con password → **non collega** → errore "Questa email è già registrata. Accedi con email e password."
3. Solo account Google-only: crea `User` con `emailVerified = now()` **solo se** Google restituisce `profile.email_verified === true`, altrimenti blocca con errore. `passwordHash: null`
4. JWT → redirect `/dashboard`

### Recupero Password
1. Form email → POST `/api/auth/recupera-password` (rate limit: 3/ora per IP **e** per email — entrambi)
2. Risposta sempre identica: "Se l'email esiste, riceverai un link" (anti-enumerazione)
3. Se User trovato: genera token raw → SHA-256 hash in `AuthToken` (type: PASSWORD_RESET, scade 1h)
4. Invia email con link `/nuova-password?token=<raw>`

### Nuova Password
1. GET `/nuova-password?token=<raw>` → valida subito il token (hash → cerca → controlla scadenza)
2. Se non valido → mostra errore prima di renderizzare il form
3. Se valido → mostra form nuova password
4. POST: ri-valida token (prevenzione race condition) → hash nuova password → aggiorna `User.passwordHash` e `User.passwordChangedAt = now()`
5. Elimina tutti i token PASSWORD_RESET dell'utente
6. Tutte le sessioni JWT esistenti vengono invalidate al prossimo accesso (middleware controlla `passwordChangedAt` vs JWT claim)
7. Redirect `/login?resetEffettuato=1`

---

## Invalidazione Sessioni

JWT include il campo `passwordChangedAt` (timestamp). Il controllo avviene nel callback `jwt` di NextAuth (non nel middleware su ogni request, per evitare un hit DB su ogni chiamata):
- Il callback `jwt` gira ogni volta che la sessione viene letta (default: ogni richiesta protetta NextAuth)
- Si usa un check con cache in-memory (LRU, TTL 5 minuti) su `{ userId → passwordChangedAt }`
- Se il valore in cache diverge dal JWT → sessione invalidata → redirect login
- Cache di 5 minuti: finestra di staleness accettabile per MVP; Redis in produzione per coerenza distribuita

---

## Gestione Errori (in italiano)

- "Email già registrata"
- "Email o password non corretti" (unico messaggio per credenziali errate)
- "Verifica prima la tua email — [Reinvia email]"
- "Link scaduto — [Richiedi un nuovo link]"
- "Password troppo corta (minimo 8 caratteri)"
- "Questa email è già registrata. Accedi con email e password."
- "Se l'email esiste, riceverai un link entro pochi minuti"

---

## Pagine

| Route | Descrizione |
|-------|-------------|
| `/login` | Form login + pulsante Google |
| `/registrati` | Form registrazione |
| `/controlla-email` | Conferma invio email verifica |
| `/verifica-email` | Gestisce token verifica (GET) |
| `/recupera-password` | Form inserimento email |
| `/nuova-password` | Form nuova password (valida token su GET) |

---

## File da creare/modificare

```
prisma/schema.prisma                          ← aggiungi emailVerified, passwordHash, passwordChangedAt, AuthToken
src/lib/auth.ts                               ← config NextAuth
src/lib/email.ts                              ← Nodemailer SMTP Aruba
src/lib/tokens.ts                             ← genera/valida token SHA-256
src/middleware.ts                             ← protezione route + invalidazione sessioni
src/app/api/auth/[...nextauth]/route.ts
src/app/api/auth/reinvia-verifica/route.ts
src/app/api/auth/recupera-password/route.ts
src/app/(auth)/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(auth)/registrati/page.tsx
src/app/(auth)/controlla-email/page.tsx
src/app/(auth)/verifica-email/page.tsx
src/app/(auth)/recupera-password/page.tsx
src/app/(auth)/nuova-password/page.tsx
```
