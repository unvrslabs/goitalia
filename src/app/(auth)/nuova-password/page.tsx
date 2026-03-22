import { Metadata } from "next";
import { NuovaPasswordForm } from "@/components/auth/nuova-password-form";
import { validateToken } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Nuova password — GoItalIA",
};

export default async function NuovaPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const userId = token ? await validateToken(token, "PASSWORD_RESET") : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Nuova password</h1>
        <p className="text-gray-500 text-sm mt-1">Scegli una nuova password sicura</p>
      </div>
      <NuovaPasswordForm tokenValido={!!userId} />
    </div>
  );
}
