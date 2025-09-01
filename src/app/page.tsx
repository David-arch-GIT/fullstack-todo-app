import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, ListChecks, PanelsTopLeft, Filter, CalendarClock, SquareCheckBig } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-muted/40 to-background">
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Kicker */}
        <p className="mb-3 text-center text-xs font-medium tracking-wide text-muted-foreground">
          NEXT.JS 15+ • SUPABASE • SHADCN/UI
        </p>

        {/* HERO */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Hola para tu portafolio
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
          Autenticación segura, CRUD de tareas, filtros avanzados, prioridades y fechas con una UI moderna.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Crear cuenta</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Al crear una cuenta aceptas las políticas de demo. No se guardan datos personales sensibles.
        </p>

        {/* FEATURES */}
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
          <Feature
            icon={<Lock className="size-5" />}
            title="Auth + RLS"
            desc="Supabase Auth y RLS. Cada usuario ve solo sus datos."
          />
          <Feature
            icon={<ListChecks className="size-5" />}
            title="CRUD completo"
            desc="Crear, editar, completar, eliminar. Categorías y prioridades."
          />
          <Feature
            icon={<PanelsTopLeft className="size-5" />}
            title="UI productiva"
            desc="shadcn/ui + Tailwind. Accesible, responsive y lista para presentar."
          />
          <Feature
            icon={<Filter className="size-5" />}
            title="Filtros & búsqueda"
            desc="Estado, categoría y prioridad. Búsqueda por texto."
          />
          <Feature
            icon={<CalendarClock className="size-5" />}
            title="Fechas & contadores"
            desc="Vencimiento y contador de tareas activas."
          />
          <Feature
            icon={<SquareCheckBig className="size-5" />}
            title="Bulk actions"
            desc="Selecciona varias y aplica acciones en un clic."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-start gap-3 p-5">
        <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <h3 className="text-base font-semibold leading-none">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
