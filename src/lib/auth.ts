import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { mockUsers } from '@/data/mockUsers';
import type { AuthSession, Rol } from '@/types/auth';
import { SESSION_DURATION_MS } from './auth-config';

export const SESSION_COOKIE_NAME = 'future_visions_session';

interface SessionClaims extends AuthSession {
  exp: number;
}

function getSigningSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET debe configurarse en producción.');
  }

  return secret ?? 'future-visions-local-mock-auth-only';
}

function sign(payload: string): string {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('base64url');
}

function isRol(value: unknown): value is Rol {
  return (
    value === 'encargado_recepcion' ||
    value === 'responsable_despacho' ||
    value === 'encargado_inventario' ||
    value === 'administrador'
  );
}

export function getSessionFromToken(token: string | undefined): AuthSession | null {
  if (!token) return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expectedSignature = sign(payload);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expectedSignature);

  if (
    actualBytes.length !== expectedBytes.length ||
    !timingSafeEqual(actualBytes, expectedBytes)
  ) {
    return null;
  }

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (
    typeof claims !== 'object' ||
    claims === null ||
    !('nombre' in claims) ||
    !('usuario' in claims) ||
    !('rol' in claims) ||
    !('exp' in claims) ||
    typeof claims.nombre !== 'string' ||
    typeof claims.usuario !== 'string' ||
    !isRol(claims.rol) ||
    typeof claims.exp !== 'number' ||
    claims.exp <= Date.now()
  ) {
    return null;
  }

  return {
    nombre: claims.nombre,
    usuario: claims.usuario,
    rol: claims.rol,
  };
}

async function setSessionCookie(session: AuthSession): Promise<void> {
  const claims: SessionClaims = {
    ...session,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const token = `${payload}.${sign(payload)}`;

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function login(usuario: string, contraseña: string): Promise<AuthSession | null> {
  const normalizedUser = usuario.trim().toLowerCase();
  const user = mockUsers.find(
    (candidate) =>
      candidate.usuario.toLowerCase() === normalizedUser &&
      candidate.contraseña === contraseña,
  );

  if (!user) return null;

  const session: AuthSession = {
    nombre: user.nombre,
    usuario: user.usuario,
    rol: user.rol,
  };

  await setSessionCookie(session);
  return session;
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<AuthSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}

export async function refreshSession(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  await setSessionCookie(session);
  return true;
}
