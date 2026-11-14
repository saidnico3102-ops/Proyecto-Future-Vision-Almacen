import type { Rol } from '@/types/auth';

export interface MockUser {
  nombre: string;
  usuario: string;
  contraseña: string;
  rol: Rol;
}

export const mockUsers: MockUser[] = [
  {
    nombre: 'Ana Torres',
    usuario: 'recepcion',
    contraseña: 'recepcion123',
    rol: 'encargado_recepcion',
  },
  {
    nombre: 'Carlos Mendoza',
    usuario: 'despacho',
    contraseña: 'despacho123',
    rol: 'responsable_despacho',
  },
  {
    nombre: 'María Fernanda Rojas',
    usuario: 'inventario',
    contraseña: 'inventario123',
    rol: 'encargado_inventario',
  },
  {
    nombre: 'Diego Herrera',
    usuario: 'admin',
    contraseña: 'admin123',
    rol: 'administrador',
  },
];
