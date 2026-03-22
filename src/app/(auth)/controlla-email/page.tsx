import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controlla la tua email — GoItalIA",
};

export default function ControllaEmailPage() {
  return (
    <div className="text-center space-y-4">
      <div className="text-5xl">📧</div>
      <h1 className="text-xl font-bold text-gray-900">Controlla la tua email</h1>
      <p className="text-gray-600 text-sm leading-relaxed">
        Ti abbiamo inviato un link di verifica. Clicca il link nell&apos;email
        per attivare il tuo account.
      </p>
      <p className="text-xs text-gray-400">
        Non trovi l&apos;email? Controlla la cartella spam o posta indesiderata.
      </p>
      <a href="/login" className="block text-sm text-green-600 hover:underline mt-4">
        Torna al login
      </a>
    </div>
  );
}
