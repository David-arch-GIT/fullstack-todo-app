import { Suspense } from "react";
import LoginClient from "./login.client";

// Evita la prerenderización estática y el error en build
export const dynamic = "force-dynamic";
// (opcional): export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<main className="container max-w-md py-10">Cargando…</main>}>
      <LoginClient />
    </Suspense>
  );
}
