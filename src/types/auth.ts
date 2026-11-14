export type Rol =
  | 'encargado_recepcion'
  | 'responsable_despacho'
  | 'encargado_inventario'
  | 'administrador';

export const ETIQUETAS_ROL: Readonly<Record<Rol, string>> = {
  encargado_recepcion: 'Encargado de Recepción',
  responsable_despacho: 'Responsable de Despacho',
  encargado_inventario: 'Encargado de Inventario',
  administrador: 'Administrador',
};

export interface AuthSession {
  nombre: string;
  usuario: string;
  rol: Rol;
}
