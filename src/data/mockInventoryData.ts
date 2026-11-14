import type {
  InventoryProduct,
  InventoryVariant,
  KardexMovement,
  PurchaseOrder,
  SaleRequest,
  DiscrepancyRecord,
} from '@/types/inventory';

// ─────────────────────────────────────────────
// PRODUCTS INVENTORY
// ─────────────────────────────────────────────
export const mockProductsInventory: InventoryProduct[] = [
  {
    id: 'prod-001',
    sku: 'ADS-SAMBA-BLK',
    name: 'Adidas Samba OG',
    brand: 'Adidas',
    category: 'Urbanas',
    price: 420,
    image_url: '/zapatillas/samba.jpg',
    variants: [
      { id: 'v001-1', size_us: 7.5, size_eu: 40.5, stock: 4, min_stock: 3, location: 'A-01-A' },
      { id: 'v001-2', size_us: 8,   size_eu: 41,   stock: 2, min_stock: 3, location: 'A-01-B' },
      { id: 'v001-3', size_us: 8.5, size_eu: 42,   stock: 7, min_stock: 3, location: 'A-01-C' },
      { id: 'v001-4', size_us: 9,   size_eu: 42.5, stock: 0, min_stock: 3, location: 'A-01-D' },
      { id: 'v001-5', size_us: 9.5, size_eu: 43,   stock: 5, min_stock: 3, location: 'A-01-E' },
      { id: 'v001-6', size_us: 10,  size_eu: 44,   stock: 1, min_stock: 3, location: 'A-01-F' },
      { id: 'v001-7', size_us: 10.5,size_eu: 44.5, stock: 3, min_stock: 3, location: 'A-01-G' },
      { id: 'v001-8', size_us: 11,  size_eu: 45,   stock: 6, min_stock: 3, location: 'A-01-H' },
    ],
  },
  {
    id: 'prod-002',
    sku: 'ADS-FORUM-WHT',
    name: 'Adidas Forum Low',
    brand: 'Adidas',
    category: 'Urbanas',
    price: 380,
    image_url: '/zapatillas/forum.jpg',
    variants: [
      { id: 'v002-1', size_us: 7.5, size_eu: 40.5, stock: 0, min_stock: 3, location: 'A-02-A' },
      { id: 'v002-2', size_us: 8,   size_eu: 41,   stock: 2, min_stock: 3, location: 'A-02-B' },
      { id: 'v002-3', size_us: 8.5, size_eu: 42,   stock: 1, min_stock: 3, location: 'A-02-C' },
      { id: 'v002-4', size_us: 9,   size_eu: 42.5, stock: 8, min_stock: 3, location: 'A-02-D' },
      { id: 'v002-5', size_us: 9.5, size_eu: 43,   stock: 4, min_stock: 3, location: 'A-02-E' },
      { id: 'v002-6', size_us: 10,  size_eu: 44,   stock: 2, min_stock: 3, location: 'A-02-F' },
      { id: 'v002-7', size_us: 10.5,size_eu: 44.5, stock: 6, min_stock: 3, location: 'A-02-G' },
      { id: 'v002-8', size_us: 11,  size_eu: 45,   stock: 3, min_stock: 3, location: 'A-02-H' },
    ],
  },
  {
    id: 'prod-003',
    sku: 'ADS-SPZL-NVY',
    name: 'Adidas Spezial',
    brand: 'Adidas',
    category: 'Retro',
    price: 450,
    image_url: '/zapatillas/spezial.jpg',
    variants: [
      { id: 'v003-1', size_us: 7.5, size_eu: 40.5, stock: 5, min_stock: 3, location: 'B-01-A' },
      { id: 'v003-2', size_us: 8,   size_eu: 41,   stock: 3, min_stock: 3, location: 'B-01-B' },
      { id: 'v003-3', size_us: 8.5, size_eu: 42,   stock: 0, min_stock: 3, location: 'B-01-C' },
      { id: 'v003-4', size_us: 9,   size_eu: 42.5, stock: 9, min_stock: 3, location: 'B-01-D' },
      { id: 'v003-5', size_us: 9.5, size_eu: 43,   stock: 2, min_stock: 3, location: 'B-01-E' },
      { id: 'v003-6', size_us: 10,  size_eu: 44,   stock: 4, min_stock: 3, location: 'B-01-F' },
      { id: 'v003-7', size_us: 10.5,size_eu: 44.5, stock: 1, min_stock: 3, location: 'B-01-G' },
      { id: 'v003-8', size_us: 11,  size_eu: 45,   stock: 7, min_stock: 3, location: 'B-01-H' },
    ],
  },
  {
    id: 'prod-004',
    sku: 'NK-DUNK-GRY',
    name: 'Nike Dunk Low',
    brand: 'Nike',
    category: 'Urbanas',
    price: 520,
    image_url: '/zapatillas/dunk.jpg',
    variants: [
      { id: 'v004-1', size_us: 7.5, size_eu: 40.5, stock: 6, min_stock: 3, location: 'B-02-A' },
      { id: 'v004-2', size_us: 8,   size_eu: 41,   stock: 0, min_stock: 3, location: 'B-02-B' },
      { id: 'v004-3', size_us: 8.5, size_eu: 42,   stock: 10, min_stock: 3, location: 'B-02-C' },
      { id: 'v004-4', size_us: 9,   size_eu: 42.5, stock: 2, min_stock: 3, location: 'B-02-D' },
      { id: 'v004-5', size_us: 9.5, size_eu: 43,   stock: 8, min_stock: 3, location: 'B-02-E' },
      { id: 'v004-6', size_us: 10,  size_eu: 44,   stock: 1, min_stock: 3, location: 'B-02-F' },
      { id: 'v004-7', size_us: 10.5,size_eu: 44.5, stock: 5, min_stock: 3, location: 'B-02-G' },
      { id: 'v004-8', size_us: 11,  size_eu: 45,   stock: 3, min_stock: 3, location: 'B-02-H' },
    ],
  },
  {
    id: 'prod-005',
    sku: 'JDN-J1-CHI',
    name: 'Jordan 1 Retro High OG',
    brand: 'Jordan',
    category: 'Retro',
    price: 850,
    image_url: '/zapatillas/jordan1.jpg',
    variants: [
      { id: 'v005-1', size_us: 7.5, size_eu: 40.5, stock: 2, min_stock: 3, location: 'C-01-A' },
      { id: 'v005-2', size_us: 8,   size_eu: 41,   stock: 0, min_stock: 3, location: 'C-01-B' },
      { id: 'v005-3', size_us: 8.5, size_eu: 42,   stock: 4, min_stock: 3, location: 'C-01-C' },
      { id: 'v005-4', size_us: 9,   size_eu: 42.5, stock: 1, min_stock: 3, location: 'C-01-D' },
      { id: 'v005-5', size_us: 9.5, size_eu: 43,   stock: 7, min_stock: 3, location: 'C-01-E' },
      { id: 'v005-6', size_us: 10,  size_eu: 44,   stock: 0, min_stock: 3, location: 'C-01-F' },
      { id: 'v005-7', size_us: 10.5,size_eu: 44.5, stock: 3, min_stock: 3, location: 'C-01-G' },
      { id: 'v005-8', size_us: 11,  size_eu: 45,   stock: 5, min_stock: 3, location: 'C-01-H' },
    ],
  },
  {
    id: 'prod-006',
    sku: 'NK-AF1-WHT',
    name: 'Nike Air Force 1 Low',
    brand: 'Nike',
    category: 'Urbanas',
    price: 390,
    image_url: '/zapatillas/af1.jpg',
    variants: [
      { id: 'v006-1', size_us: 7.5, size_eu: 40.5, stock: 8, min_stock: 3, location: 'C-02-A' },
      { id: 'v006-2', size_us: 8,   size_eu: 41,   stock: 6, min_stock: 3, location: 'C-02-B' },
      { id: 'v006-3', size_us: 8.5, size_eu: 42,   stock: 12, min_stock: 3, location: 'C-02-C' },
      { id: 'v006-4', size_us: 9,   size_eu: 42.5, stock: 9, min_stock: 3, location: 'C-02-D' },
      { id: 'v006-5', size_us: 9.5, size_eu: 43,   stock: 2, min_stock: 3, location: 'C-02-E' },
      { id: 'v006-6', size_us: 10,  size_eu: 44,   stock: 7, min_stock: 3, location: 'C-02-F' },
      { id: 'v006-7', size_us: 10.5,size_eu: 44.5, stock: 4, min_stock: 3, location: 'C-02-G' },
      { id: 'v006-8', size_us: 11,  size_eu: 45,   stock: 11, min_stock: 3, location: 'C-02-H' },
    ],
  },
];

// ─────────────────────────────────────────────
// KARDEX MOVEMENTS
// ─────────────────────────────────────────────
export const mockKardexMovements: KardexMovement[] = [
  {
    id: 'k-001', date: '2026-11-07T09:15:00',
    product_id: 'prod-001', sku: 'ADS-SAMBA-BLK',
    product_name: 'Adidas Samba OG', brand: 'Adidas',
    size_us: 9, size_eu: 42.5,
    movement_type: 'INGRESO', quantity: 10,
    stock_before: 0, stock_after: 10,
    document_ref: 'FACT-1024', responsible: 'Carlos Ríos',
    notes: 'Recepción OC-2026-001',
  },
  {
    id: 'k-002', date: '2026-11-07T10:30:00',
    product_id: 'prod-004', sku: 'NK-DUNK-GRY',
    product_name: 'Nike Dunk Low', brand: 'Nike',
    size_us: 9, size_eu: 42.5,
    movement_type: 'SALIDA', quantity: 2,
    stock_before: 4, stock_after: 2,
    document_ref: 'REG-SAL-042', responsible: 'Ana Velásquez',
    notes: 'Despacho solicitud SOL-VEN-087',
  },
  {
    id: 'k-003', date: '2026-11-06T14:00:00',
    product_id: 'prod-005', sku: 'JDN-J1-CHI',
    product_name: 'Jordan 1 Retro High OG', brand: 'Jordan',
    size_us: 10, size_eu: 44,
    movement_type: 'AJUSTE_NEGATIVO', quantity: 1,
    stock_before: 1, stock_after: 0,
    document_ref: 'INF-REC-005', responsible: 'Luis Paredes',
    notes: 'Ajuste por daño en almacén',
  },
  {
    id: 'k-004', date: '2026-11-06T16:45:00',
    product_id: 'prod-002', sku: 'ADS-FORUM-WHT',
    product_name: 'Adidas Forum Low', brand: 'Adidas',
    size_us: 8, size_eu: 41,
    movement_type: 'INGRESO', quantity: 6,
    stock_before: 0, stock_after: 6,
    document_ref: 'FACT-1019', responsible: 'Carlos Ríos',
    notes: 'Recepción OC-2026-002',
  },
  {
    id: 'k-005', date: '2026-11-05T11:20:00',
    product_id: 'prod-006', sku: 'NK-AF1-WHT',
    product_name: 'Nike Air Force 1 Low', brand: 'Nike',
    size_us: 9.5, size_eu: 43,
    movement_type: 'SALIDA', quantity: 3,
    stock_before: 5, stock_after: 2,
    document_ref: 'REG-SAL-038', responsible: 'Ana Velásquez',
    notes: 'Despacho solicitud SOL-VEN-082',
  },
  {
    id: 'k-006', date: '2026-11-05T15:00:00',
    product_id: 'prod-003', sku: 'ADS-SPZL-NVY',
    product_name: 'Adidas Spezial', brand: 'Adidas',
    size_us: 10.5, size_eu: 44.5,
    movement_type: 'AJUSTE_POSITIVO', quantity: 2,
    stock_before: 0, stock_after: 2,
    document_ref: 'INF-REC-003', responsible: 'Luis Paredes',
    notes: 'Corrección de conteo físico',
  },
  {
    id: 'k-007', date: '2026-11-04T09:00:00',
    product_id: 'prod-001', sku: 'ADS-SAMBA-BLK',
    product_name: 'Adidas Samba OG', brand: 'Adidas',
    size_us: 8, size_eu: 41,
    movement_type: 'SALIDA', quantity: 4,
    stock_before: 6, stock_after: 2,
    document_ref: 'REG-SAL-035', responsible: 'Ana Velásquez',
    notes: 'Despacho solicitud SOL-VEN-079',
  },
  {
    id: 'k-008', date: '2026-11-04T13:30:00',
    product_id: 'prod-004', sku: 'NK-DUNK-GRY',
    product_name: 'Nike Dunk Low', brand: 'Nike',
    size_us: 7.5, size_eu: 40.5,
    movement_type: 'INGRESO', quantity: 8,
    stock_before: 0, stock_after: 8,
    document_ref: 'FACT-1015', responsible: 'Carlos Ríos',
    notes: 'Recepción OC-2026-003',
  },
];

// ─────────────────────────────────────────────
// PURCHASE ORDERS
// ─────────────────────────────────────────────
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'oc-001',
    order_number: 'OC-2026-001',
    supplier: 'Adidas Perú SAC',
    supplier_ruc: '20512763215',
    order_date: '2026-11-01',
    expected_date: '2026-11-08',
    status: 'PENDIENTE',
    total_amount: 12600,
    items: [
      { product_id: 'prod-001', sku: 'ADS-SAMBA-BLK', product_name: 'Adidas Samba OG', size_us: 9, size_eu: 42.5, quantity_ordered: 10, unit_price: 420, status: 'PENDIENTE' },
      { product_id: 'prod-001', sku: 'ADS-SAMBA-BLK', product_name: 'Adidas Samba OG', size_us: 10, size_eu: 44, quantity_ordered: 8, unit_price: 420, status: 'PENDIENTE' },
      { product_id: 'prod-002', sku: 'ADS-FORUM-WHT', product_name: 'Adidas Forum Low', size_us: 8.5, size_eu: 42, quantity_ordered: 6, unit_price: 380, status: 'PENDIENTE' },
      { product_id: 'prod-003', sku: 'ADS-SPZL-NVY', product_name: 'Adidas Spezial', size_us: 9, size_eu: 42.5, quantity_ordered: 5, unit_price: 450, status: 'PENDIENTE' },
    ],
  },
  {
    id: 'oc-002',
    order_number: 'OC-2026-002',
    supplier: 'Nike Perú SAC',
    supplier_ruc: '20498765432',
    order_date: '2026-10-25',
    expected_date: '2026-11-02',
    status: 'ATENDIDO',
    total_amount: 18200,
    invoice_number: 'FACT-1024',
    remission_guide: 'GR-0987',
    received_by: 'Carlos Ríos',
    received_date: '2026-11-01',
    items: [
      { product_id: 'prod-004', sku: 'NK-DUNK-GRY', product_name: 'Nike Dunk Low', size_us: 8, size_eu: 41, quantity_ordered: 10, quantity_received: 10, unit_price: 520, status: 'CONFORME' },
      { product_id: 'prod-004', sku: 'NK-DUNK-GRY', product_name: 'Nike Dunk Low', size_us: 9.5, size_eu: 43, quantity_ordered: 8, quantity_received: 7, unit_price: 520, status: 'FALTANTE', notes: 'Faltó 1 par' },
      { product_id: 'prod-006', sku: 'NK-AF1-WHT', product_name: 'Nike Air Force 1 Low', size_us: 10, size_eu: 44, quantity_ordered: 12, quantity_received: 11, unit_price: 390, status: 'DANADO', notes: '1 par con caja rota' },
    ],
  },
  {
    id: 'oc-003',
    order_number: 'OC-2026-003',
    supplier: 'Nike Perú SAC',
    supplier_ruc: '20498765432',
    order_date: '2026-11-05',
    expected_date: '2026-11-12',
    status: 'PENDIENTE',
    total_amount: 9360,
    items: [
      { product_id: 'prod-005', sku: 'JDN-J1-CHI', product_name: 'Jordan 1 Retro High OG', size_us: 8, size_eu: 41, quantity_ordered: 4, unit_price: 850, status: 'PENDIENTE' },
      { product_id: 'prod-005', sku: 'JDN-J1-CHI', product_name: 'Jordan 1 Retro High OG', size_us: 9, size_eu: 42.5, quantity_ordered: 4, unit_price: 850, status: 'PENDIENTE' },
      { product_id: 'prod-006', sku: 'NK-AF1-WHT', product_name: 'Nike Air Force 1 Low', size_us: 8.5, size_eu: 42, quantity_ordered: 8, unit_price: 390, status: 'PENDIENTE' },
    ],
  },
];

// ─────────────────────────────────────────────
// SALE REQUESTS
// ─────────────────────────────────────────────
export const mockSaleRequests: SaleRequest[] = [
  {
    id: 'sr-001',
    request_number: 'SOL-VEN-091',
    created_by: 'María Torres (Ventas)',
    created_date: '2026-11-07T08:00:00',
    status: 'PENDIENTE',
    priority: 'URGENTE',
    client_name: 'Rodrigo Aliaga',
    items: [
      { product_id: 'prod-001', sku: 'ADS-SAMBA-BLK', product_name: 'Adidas Samba OG', brand: 'Adidas', size_us: 9.5, size_eu: 43, quantity: 1 },
      { product_id: 'prod-004', sku: 'NK-DUNK-GRY', product_name: 'Nike Dunk Low', brand: 'Nike', size_us: 8.5, size_eu: 42, quantity: 2 },
    ],
  },
  {
    id: 'sr-002',
    request_number: 'SOL-VEN-090',
    created_by: 'Pedro Salas (Ventas)',
    created_date: '2026-11-07T07:30:00',
    status: 'EN_PREPARACION',
    priority: 'NORMAL',
    client_name: 'Carla Méndez',
    items: [
      { product_id: 'prod-005', sku: 'JDN-J1-CHI', product_name: 'Jordan 1 Retro High OG', brand: 'Jordan', size_us: 9.5, size_eu: 43, quantity: 1 },
    ],
  },
  {
    id: 'sr-003',
    request_number: 'SOL-VEN-089',
    created_by: 'María Torres (Ventas)',
    created_date: '2026-11-06T15:00:00',
    status: 'ATENDIDO',
    priority: 'NORMAL',
    client_name: 'Gustavo Lara',
    dispatched_by: 'Luis Paredes',
    dispatch_date: '2026-11-06T17:00:00',
    items: [
      { product_id: 'prod-006', sku: 'NK-AF1-WHT', product_name: 'Nike Air Force 1 Low', brand: 'Nike', size_us: 10, size_eu: 44, quantity: 1 },
    ],
  },
  {
    id: 'sr-004',
    request_number: 'SOL-VEN-088',
    created_by: 'Pedro Salas (Ventas)',
    created_date: '2026-11-06T10:00:00',
    status: 'RECHAZADO',
    priority: 'URGENTE',
    client_name: 'Sandra Olivares',
    rejection_reason: 'Stock insuficiente. Talla US 8 de Jordan 1 agotada.',
    items: [
      { product_id: 'prod-005', sku: 'JDN-J1-CHI', product_name: 'Jordan 1 Retro High OG', brand: 'Jordan', size_us: 8, size_eu: 41, quantity: 2 },
    ],
  },
];

// ─────────────────────────────────────────────
// DISCREPANCIES (Physical count vs logical)
// ─────────────────────────────────────────────
export const mockDiscrepancies: DiscrepancyRecord[] = [
  {
    id: 'disc-001',
    count_date: '2026-11-05',
    product_id: 'prod-002',
    sku: 'ADS-FORUM-WHT',
    product_name: 'Adidas Forum Low',
    brand: 'Adidas',
    size_us: 8.5,
    logical_stock: 3,
    physical_stock: 2,
    difference: -1,
    discrepancy_type: 'FALTANTE',
    status: 'PENDIENTE_AJUSTE',
    counted_by: 'Luis Paredes',
    notes: 'Posible extravío en reubicación',
  },
  {
    id: 'disc-002',
    count_date: '2026-11-05',
    product_id: 'prod-003',
    sku: 'ADS-SPZL-NVY',
    product_name: 'Adidas Spezial',
    brand: 'Adidas',
    size_us: 9.5,
    logical_stock: 1,
    physical_stock: 3,
    difference: 2,
    discrepancy_type: 'SOBRANTE',
    status: 'PENDIENTE_AJUSTE',
    counted_by: 'Carlos Ríos',
    notes: 'Pares encontrados sin registrar',
  },
  {
    id: 'disc-003',
    count_date: '2026-11-04',
    product_id: 'prod-005',
    sku: 'JDN-J1-CHI',
    product_name: 'Jordan 1 Retro High OG',
    brand: 'Jordan',
    size_us: 10,
    logical_stock: 1,
    physical_stock: 0,
    difference: -1,
    discrepancy_type: 'FALTANTE',
    adjustment_reason: 'DANO',
    status: 'AJUSTADO',
    counted_by: 'Luis Paredes',
    notes: 'Par dañado descartado',
  },
];

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

export function getProductTotalStock(product: InventoryProduct): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function getProductStatus(product: InventoryProduct): 'EN_STOCK' | 'STOCK_BAJO' | 'AGOTADO' {
  const totalStock = getProductTotalStock(product);
  if (totalStock === 0) return 'AGOTADO';
  const hasLowStock = product.variants.some(v => v.stock > 0 && v.stock < v.min_stock);
  const hasStock = product.variants.some(v => v.stock >= v.min_stock);
  if (!hasStock && hasLowStock) return 'STOCK_BAJO';
  if (hasLowStock) return 'STOCK_BAJO';
  return 'EN_STOCK';
}

export function getVariantStatus(variant: InventoryVariant): 'EN_STOCK' | 'STOCK_BAJO' | 'AGOTADO' {
  if (variant.stock === 0) return 'AGOTADO';
  if (variant.stock < variant.min_stock) return 'STOCK_BAJO';
  return 'EN_STOCK';
}

export function getTotalInventoryValue(products: InventoryProduct[]): number {
  return products.reduce((sum, p) => sum + getProductTotalStock(p) * p.price, 0);
}

export function getLowStockCount(products: InventoryProduct[]): number {
  return products.filter(p => getProductStatus(p) === 'STOCK_BAJO' || getProductStatus(p) === 'AGOTADO').length;
}

export function getTodayMovements(movements: KardexMovement[]): number {
  const today = new Date().toISOString().split('T')[0];
  return movements.filter(m => m.date.startsWith(today)).length;
}

export function formatCurrency(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
