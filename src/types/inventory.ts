// ─── Inventory Management Types ───
// Aligned to MBW Store / Future Visions — UPAO Software Engineering Document

export type MovementType =
  | 'INGRESO'
  | 'SALIDA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO';

export type StockStatus = 'EN_STOCK' | 'STOCK_BAJO' | 'AGOTADO';
export type PurchaseOrderStatus = 'PENDIENTE' | 'ATENDIDO' | 'PARCIAL';
export type SaleRequestStatus = 'PENDIENTE' | 'EN_PREPARACION' | 'ATENDIDO' | 'RECHAZADO';
export type AdjustmentReason = 'MERMA' | 'PERDIDA' | 'DANO' | 'SOBRANTE' | 'ERROR_CONTEO';
export type DiscrepancyType = 'FALTANTE' | 'SOBRANTE' | 'CUADRE_EXACTO';

export interface InventoryVariant {
  id: string;
  size_us: number;
  size_eu: number;
  stock: number;
  min_stock: number;
  location: string;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
  variants: InventoryVariant[];
}

export interface KardexMovement {
  id: string;
  date: string;
  product_id: string;
  sku: string;
  product_name: string;
  brand: string;
  size_us: number;
  size_eu: number;
  movement_type: MovementType;
  quantity: number;
  stock_before: number;
  stock_after: number;
  document_ref: string;
  responsible: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  product_id: string;
  sku: string;
  product_name: string;
  size_us: number;
  size_eu: number;
  quantity_ordered: number;
  quantity_received?: number;
  unit_price: number;
  status?: 'CONFORME' | 'DANADO' | 'FALTANTE' | 'PENDIENTE';
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier: string;
  supplier_ruc: string;
  order_date: string;
  expected_date: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  total_amount: number;
  invoice_number?: string;
  remission_guide?: string;
  received_by?: string;
  received_date?: string;
}

export interface SaleRequestItem {
  product_id: string;
  sku: string;
  product_name: string;
  brand: string;
  size_us: number;
  size_eu: number;
  quantity: number;
  current_stock?: number;
}

export interface SaleRequest {
  id: string;
  request_number: string;
  created_by: string;
  created_date: string;
  status: SaleRequestStatus;
  items: SaleRequestItem[];
  client_name?: string;
  priority: 'NORMAL' | 'URGENTE';
  rejection_reason?: string;
  dispatched_by?: string;
  dispatch_date?: string;
}

export interface DiscrepancyRecord {
  id: string;
  count_date: string;
  product_id: string;
  sku: string;
  product_name: string;
  brand: string;
  size_us: number;
  logical_stock: number;
  physical_stock: number;
  difference: number;
  discrepancy_type: DiscrepancyType;
  adjustment_reason?: AdjustmentReason;
  status: 'PENDIENTE_AJUSTE' | 'AJUSTADO' | 'RECHAZADO';
  counted_by: string;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}
