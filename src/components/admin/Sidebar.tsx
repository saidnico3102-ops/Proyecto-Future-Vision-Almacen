'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AuthSession } from '@/types/auth';
import { ETIQUETAS_ROL } from '@/types/auth';
import { logoutAction } from '@/app/login/actions';
import {
  Package,
  BookOpen,
  PackageCheck,
  PackageMinus,
  Scale,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Bell,
} from 'lucide-react';

const navItems = [
  {
    href: '/admin/inventario',
    label: 'Stock Central',
    icon: Package,
    description: 'RF-INV-03',
  },
  {
    href: '/admin/inventario/kardex',
    label: 'Kardex',
    icon: BookOpen,
    description: 'RF-INV-06',
  },
  {
    href: '/admin/recepcion',
    label: 'Recepción',
    icon: PackageCheck,
    description: 'RF-REC-06',
  },
  {
    href: '/admin/despacho',
    label: 'Despachos',
    icon: PackageMinus,
    description: 'RF-DES-03',
  },
  {
    href: '/admin/ajustes',
    label: 'Conteos y Ajustes',
    icon: Scale,
    description: 'RF-INV-08',
  },
];

export default function AdminSidebar({ session }: { session: AuthSession }) {
  const pathname = usePathname();
  const initials = session.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 flex flex-col shadow-xl">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-slate-900" />
        </div>
        <div>
          <p className="text-white font-black text-sm tracking-tight">MBW STORE</p>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest">Almacén</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold px-3 mb-3">
          Módulos
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin/inventario'
              ? pathname === '/admin/inventario'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-white text-slate-900'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-slate-900' : ''}`}>
                  {item.label}
                </p>
                <p className={`text-[10px] ${isActive ? 'text-slate-500' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{session.nombre}</p>
            <p className="text-slate-500 text-[10px] truncate">{ETIQUETAS_ROL[session.rol]}</p>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors p-1" aria-label="Notificaciones">
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-500 transition-all hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
