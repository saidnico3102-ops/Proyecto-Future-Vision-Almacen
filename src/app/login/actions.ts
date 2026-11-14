'use server';

import { login, logout, refreshSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export type LoginActionResult =
  | { success: true }
  | { success: false; message: string };

export async function loginAction(
  usuario: string,
  contraseña: string,
): Promise<LoginActionResult> {
  if (
    typeof usuario !== 'string' ||
    typeof contraseña !== 'string' ||
    !usuario.trim() ||
    !contraseña
  ) {
    return { success: false, message: 'Completa todos los campos' };
  }

  const session = await login(usuario, contraseña);
  if (!session) {
    return { success: false, message: 'Usuario o contraseña incorrectos' };
  }

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/login');
}

export async function refreshSessionAction(): Promise<boolean> {
  return refreshSession();
}

export async function expireSessionAction(): Promise<void> {
  await logout();
  redirect('/login?motivo=inactividad');
}
