'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SESSION_DURATION_MS } from '@/lib/auth-config';
import { expireSessionAction, refreshSessionAction } from '@/app/login/actions';

const SESSION_REFRESH_INTERVAL_MS = 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

export default function SessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    let timeout: number;
    let lastRefreshAt = Date.now();
    let endingSession = false;

    const expire = async () => {
      if (endingSession) return;
      endingSession = true;

      try {
        await expireSessionAction();
      } catch (error) {
        console.error('No se pudo cerrar la sesión por inactividad.', error);
        router.replace('/login?motivo=inactividad');
      }
    };

    const handleActivity = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        void expire();
      }, SESSION_DURATION_MS);

      if (Date.now() - lastRefreshAt < SESSION_REFRESH_INTERVAL_MS) return;

      lastRefreshAt = Date.now();
      void refreshSessionAction()
        .then((valid) => {
          if (!valid && !endingSession) {
            endingSession = true;
            router.replace('/login');
          }
        })
        .catch((error: unknown) => {
          console.error('No se pudo renovar la sesión.', error);
        });
    };

    timeout = window.setTimeout(() => {
      void expire();
    }, SESSION_DURATION_MS);
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    return () => {
      window.clearTimeout(timeout);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [router]);

  return null;
}
