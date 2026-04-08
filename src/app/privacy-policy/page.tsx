import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GoItalIA",
  description: "Informativa sulla privacy di GoItalIA ai sensi del GDPR",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-16 bg-white dark:bg-black sm:px-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Ultimo aggiornamento: 8 aprile 2026
        </p>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              1. Titolare del trattamento
            </h2>
            <p>
              Il titolare del trattamento dei dati personali raccolti tramite il sito{" "}
              <strong>www.goitalia.eu</strong> è GoItalIA (&quot;noi&quot;, &quot;nostro&quot;).
              Per qualsiasi richiesta relativa alla privacy è possibile contattarci
              all&apos;indirizzo e-mail:{" "}
              <a href="mailto:emanuele@unvrslabs.dev" className="text-blue-600 dark:text-blue-400 underline">
                emanuele@unvrslabs.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              2. Dati raccolti
            </h2>
            <p>Raccogliamo le seguenti categorie di dati personali:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Dati di identificazione:</strong> nome, cognome, indirizzo e-mail,
                forniti volontariamente dall&apos;utente tramite moduli di registrazione o
                contatto.
              </li>
              <li>
                <strong>Dati di autenticazione:</strong> informazioni fornite tramite servizi
                di autenticazione di terze parti (ad esempio Google), inclusi nome, indirizzo
                e-mail e immagine del profilo.
              </li>
              <li>
                <strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine
                visitate, orario di accesso e altri dati raccolti automaticamente tramite
                cookie o tecnologie similari.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              3. Finalità del trattamento
            </h2>
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Fornitura e gestione del servizio richiesto dall&apos;utente.</li>
              <li>Autenticazione e accesso sicuro alla piattaforma.</li>
              <li>Comunicazioni relative al servizio (aggiornamenti, assistenza).</li>
              <li>Adempimento di obblighi di legge.</li>
              <li>Miglioramento del servizio e analisi statistiche in forma aggregata.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              4. Base giuridica del trattamento
            </h2>
            <p>
              Il trattamento dei dati si basa su: consenso dell&apos;utente (art. 6, par. 1,
              lett. a GDPR), esecuzione di un contratto (art. 6, par. 1, lett. b GDPR),
              obblighi legali (art. 6, par. 1, lett. c GDPR) e legittimo interesse del
              titolare (art. 6, par. 1, lett. f GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              5. Servizi di terze parti
            </h2>
            <p>
              Il sito utilizza servizi di terze parti che possono raccogliere dati
              personali, tra cui:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Google OAuth:</strong> per l&apos;autenticazione degli utenti. Google
                può raccogliere e trattare dati secondo la propria{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Vercel:</strong> per l&apos;hosting dell&apos;applicazione. I dati di
                navigazione possono essere trattati secondo la{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Privacy Policy di Vercel
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              6. Conservazione dei dati
            </h2>
            <p>
              I dati personali sono conservati per il tempo strettamente necessario al
              raggiungimento delle finalità per cui sono stati raccolti, e comunque non
              oltre i termini previsti dalla normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              7. Diritti dell&apos;utente
            </h2>
            <p>
              Ai sensi degli artt. 15-22 del GDPR, l&apos;utente ha diritto di:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Accedere ai propri dati personali.</li>
              <li>Richiedere la rettifica o la cancellazione dei dati.</li>
              <li>Limitare od opporsi al trattamento.</li>
              <li>Richiedere la portabilità dei dati.</li>
              <li>Revocare il consenso in qualsiasi momento.</li>
              <li>
                Proporre reclamo all&apos;Autorità Garante per la protezione dei dati
                personali (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  www.garanteprivacy.it
                </a>
                ).
              </li>
            </ul>
            <p className="mt-4">
              Per esercitare i propri diritti, scrivere a:{" "}
              <a href="mailto:emanuele@unvrslabs.dev" className="text-blue-600 dark:text-blue-400 underline">
                emanuele@unvrslabs.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              8. Cookie
            </h2>
            <p>
              Il sito utilizza cookie tecnici necessari al funzionamento del servizio e
              cookie di terze parti per l&apos;autenticazione. L&apos;utente può gestire le
              preferenze sui cookie tramite le impostazioni del proprio browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mt-8 mb-4">
              9. Modifiche alla presente informativa
            </h2>
            <p>
              Ci riserviamo il diritto di aggiornare la presente informativa. Eventuali
              modifiche saranno pubblicate su questa pagina con indicazione della data di
              ultimo aggiornamento.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
