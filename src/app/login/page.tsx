import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión — Future Visions',
  description: 'Acceso al sistema de gestión de almacén Future Visions.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const session = await getSession();
  if (session) redirect('/admin/inventario');

  const { motivo } = await searchParams;

  return <LoginForm showInactivityNotice={motivo === 'inactividad'} />;
}
