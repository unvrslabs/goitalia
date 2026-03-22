import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          Benvenuto, {session.user.name}! 👋
        </h1>
        <p className="text-gray-500 mt-2">La tua azienda AI è pronta.</p>
      </div>
    </div>
  );
}
