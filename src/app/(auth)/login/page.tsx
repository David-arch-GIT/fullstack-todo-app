import { Suspense } from "react";
import LoginClient from "./login.client";

// Evita que Next intente pre-render estático
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<main className="container max-w-md py-10">Cargando…</main>}>
      <LoginClient />
    </Suspense>
  );
}
