'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  Eye,
  EyeOff,
  Lock,
  User,
} from 'lucide-react';
import { loginAction } from './actions';

export default function LoginForm({
  showInactivityNotice,
}: {
  showInactivityNotice: boolean;
}) {
  const router = useRouter();
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const usuario = formData.get('usuario');
    const contraseña = formData.get('contraseña');

    if (
      typeof usuario !== 'string' ||
      typeof contraseña !== 'string' ||
      !usuario.trim() ||
      !contraseña
    ) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      const result = await loginAction(usuario, contraseña);
      if (!result.success) {
        setError(result.message);
        return;
      }

      router.replace('/admin/inventario');
      router.refresh();
    } catch (submitError) {
      console.error('No se pudo iniciar sesión.', submitError);
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:flex lg:bg-white">
      <aside className="relative hidden h-screen w-[30%] flex-none lg:block">
  <Image
    src="/local-logo.jpeg"
    alt="Local de Future Visions"
    fill
    priority
    sizes="30vw"
    className="object-cover object-[center_35%]"
  />
</aside>

      <section className="flex min-h-screen flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[380px]">
          <header className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/logo-future-visions-trim.png"
            alt="Logo de Future Visions"
            width={801}
            height={396}
            priority
            className="mb-3 h-auto w-[200px] object-contain sm:w-[230px] lg:w-[260px]"
          />
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Almacén
            </p>
          </header>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Iniciar sesión
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          {showInactivityNotice && (
            <p
              role="status"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900"
            >
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Tu sesión se cerró por inactividad.</span>
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="usuario"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Usuario
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-900/10"
                  placeholder="Tu usuario"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contraseña"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="contraseña"
                  name="contraseña"
                  type={mostrarContraseña ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-900/10"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContraseña((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
                  aria-label={mostrarContraseña ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={mostrarContraseña}
                >
                  {mostrarContraseña ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? 'Iniciando sesión…' : 'Iniciar sesión'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-9 text-center text-xs text-slate-400">
            Sistema de gestión de almacén · Future Visions
          </p>
        </div>
      </section>
    </main>
  );
}
