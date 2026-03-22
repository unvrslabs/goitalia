import { Metadata } from "next";
import { RegistratiForm } from "@/components/auth/registrati-form";

export const metadata: Metadata = {
  title: "Registrati — GoItalIA",
};

export default function RegistratiPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Crea la tua azienda AI</h1>
        <p className="text-gray-500 text-sm mt-1">
          Inizia gratis, nessuna carta di credito
        </p>
      </div>
      <RegistratiForm />
    </div>
  );
}
