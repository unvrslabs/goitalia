"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function NuovaPasswordContent({ tokenValido }: { tokenValido: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!tokenValido) {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl">❌</div>
        <p className="text-gray-700 text-sm">Link non valido o scaduto.</p>
        <a
          href="/recupera-password"
          className="block text-sm text-green-600 hover:underline"
        >
          Richiedi un nuovo link
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/nuova-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/login?resetEffettuato=1");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="password">Nuova password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimo 8 caratteri"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Salvataggio..." : "Salva nuova password"}
      </Button>
    </form>
  );
}

export function NuovaPasswordForm({ tokenValido }: { tokenValido: boolean }) {
  return (
    <Suspense>
      <NuovaPasswordContent tokenValido={tokenValido} />
    </Suspense>
  );
}
