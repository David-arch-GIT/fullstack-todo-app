'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) return toast.error('Error al iniciar sesión', { description: error.message })

    toast.success('Sesión iniciada')
    const redirect = params.get('redirect') || '/dashboard'
    router.replace(redirect)
  }

  return (
    <main className="mx-auto grid max-w-md gap-6 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Inicia sesión</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accede</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Accediendo…' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>¿No tienes cuenta?</span>
            <Link href="/signup" className="text-primary hover:underline">
              Crea una
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
