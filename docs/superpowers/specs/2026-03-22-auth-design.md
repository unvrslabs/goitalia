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

### Layer 2 — Middleware (`src/middleware.ts`)
- Protegge tutte le route `/dashboard/*` e `/onboarding/*`
- Redirect a `/login` se non autenticato
- Redirect a `/dashboard` se già autenticato e visita `/login` o `/registrati`

### Layer 3 — Email Service (`src/lib/email.ts`)
- Nodemailer con SMTP Aruba
- Due template: verifica account + reset password
- Testi in italiano

---

## Database

Tabelle utilizzate (già nello schema Prisma):
- `User` — utente con `passwordHash`, `emailVerified`
- `Session` — sessioni NextAuth
- `VerificationToken` — token per verifica email e reset password (con `expires`)

Aggiunta necessaria allo schema: campo `emailVerified DateTime?` su `User` + tabella `VerificationToken` standard NextAuth.

---

## Flussi

### Registrazione
1. Form: nome, email, password
2. Validazione: email unica, password min 8 caratteri
3. Hash password con bcrypt (10 rounds)
4. Crea `User` con `emailVerified: null`
5. Genera token casuale → salva in `VerificationToken` (scade 24h)
6. Invia email con link `/verifica-email?token=...`
7. Redirect a `/controlla-email`

### Verifica Email
1. Click su link nell'email
2. Trova token in `VerificationToken`
3. Se scaduto → mostra errore con link per reinviare
4. Se valido → `User.emailVerified = now()` → elimina token
5. Redirect a `/login` con messaggio di successo

### Login Email/Password
1. Form: email, password
2. NextAuth Credentials → cerca User → verifica `emailVerified` → confronta hash
3. Se account non verificato → errore "Verifica prima la tua email"
4. Se credenziali errate → errore "Email o password non corretti"
5. Sessione JWT → redirect a `/dashboard`

### Login Google
1. Click "Continua con Google"
2. OAuth flow → callback NextAuth
3. Se email già registrata con password → collega account
4. Crea o aggiorna `User` (Google imposta `emailVerified` automaticamente)
5. Sessione JWT → redirect a `/dashboard`

### Recupero Password
1. Form: inserisce email
2. Se email non trovata → risposta generica (sicurezza)
3. Genera token → salva in `VerificationToken` (scade 1h)
4. Invia email con link `/nuova-password?token=...`
5. Form nuova password → valida token → hash → aggiorna `User.passwordHash`
6. Elimina token → redirect `/login`

---

## Pagine

| Route | Descrizione |
|-------|-------------|
| `/login` | Form login + pulsante Google |
| `/registrati` | Form registrazione |
| `/controlla-email` | Conferma invio email verifica |
| `/verifica-email` | Gestisce token verifica |
| `/recupera-password` | Form inserimento email |
| `/nuova-password` | Form nuova password |

---

## Gestione Errori (in italiano)

- "Email già registrata"
- "Password non corretta" / "Email o password non corretti"
- "Verifica prima la tua email"
- "Link scaduto — richiedi un nuovo link"
- "Password troppo corta (minimo 8 caratteri)"

---

## File da creare/modificare

```
prisma/schema.prisma          ← aggiungi emailVerified + VerificationToken
src/app/api/auth/[...nextauth]/route.ts
src/lib/auth.ts               ← config NextAuth
src/lib/email.ts              ← Nodemailer SMTP Aruba
src/middleware.ts             ← protezione route
src/app/(auth)/login/page.tsx
src/app/(auth)/registrati/page.tsx
src/app/(auth)/controlla-email/page.tsx
src/app/(auth)/verifica-email/page.tsx
src/app/(auth)/recupera-password/page.tsx
src/app/(auth)/nuova-password/page.tsx
src/app/(auth)/layout.tsx     ← layout pagine auth
```
