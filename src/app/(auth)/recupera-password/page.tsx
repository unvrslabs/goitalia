import { Metadata } from "next";
import { RecuperaPasswordForm } from "@/components/auth/recupera-password-form";

export const metadata: Metadata = {
  title: "Recupera password — GoItalIA",
};

export default function RecuperaPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Password dimenticata?</h1>
        <p className="text-gray-500 text-sm mt-1">
          Inserisci la tua email per ricevere un link di recupero
        </p>
      </div>
      <RecuperaPasswordForm />
    </div>
  );
}
