// src/app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error('Email inválido')
    }
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres')
    }
    if (password !== confirm) {
      return toast.error('Las contraseñas no coinciden')
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) return toast.error('Error al registrarte', { description: error.message })

    toast.success('Cuenta creada')
    router.replace('/login')
  }

  return (
    <main className="mx-auto grid max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regístrate</CardTitle>
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="repite la contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Creando…' : 'Registrarme'}
            </Button>
          </form>

          {/* Enlaces separados con gap */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>¿Ya tienes cuenta?</span>
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
