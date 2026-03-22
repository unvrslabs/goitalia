"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerificaEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [stato, setStato] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStato("error");
      return;
    }

    fetch("/api/auth/verifica-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then((res) => {
      if (res.ok) {
        setStato("ok");
        setTimeout(() => router.push("/login?verificato=1"), 2000);
      } else {
        setStato("error");
      }
    });
  }, [token, router]);

  if (stato === "loading") {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl animate-pulse">⏳</div>
        <p className="text-gray-600">Verifica in corso...</p>
      </div>
    );
  }

  if (stato === "ok") {
    return (
      <div className="text-center space-y-3">
        <div className="text-5xl">✅</div>
        <h1 className="text-xl font-bold text-gray-900">Email verificata!</h1>
        <p className="text-gray-500 text-sm">Reindirizzamento al login...</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="text-5xl">❌</div>
      <h1 className="text-xl font-bold text-gray-900">Link non valido o scaduto</h1>
      <p className="text-gray-500 text-sm">
        Il link di verifica non è più valido oppure è scaduto.
      </p>
      <a
        href="/login"
        className="inline-block text-sm text-green-600 hover:underline"
      >
        Torna al login per richiedere un nuovo link
      </a>
    </div>
  );
}

export default function VerificaEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="text-gray-500">Verifica in corso...</p>
        </div>
      }
    >
      <VerificaEmailContent />
    </Suspense>
  );
}
