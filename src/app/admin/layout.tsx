import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import SessionTimeout from '@/components/admin/SessionTimeout';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Almacén — MBW Store Admin',
  description: 'Sistema de gestión de inventario y almacén MBW Store / Future Visions',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SessionTimeout />
      {/* Sidebar */}
      <AdminSidebar session={session} />

      {/* Main Content */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}