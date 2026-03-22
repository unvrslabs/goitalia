import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Accedi — GoItalIA",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Bentornato</h1>
        <p className="text-gray-500 text-sm mt-1">Accedi alla tua azienda AI</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
