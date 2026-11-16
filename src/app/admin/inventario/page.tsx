'use client';

import { useState, useMemo } from 'react';
import {
  Search, Package, AlertTriangle, DollarSign, Activity,
  X, Eye, TrendingDown, Filter
} from 'lucide-react';
import {
  mockProductsInventory, mockKardexMovements,
  getProductTotalStock, getProductStatus, getVariantStatus,
  getTotalInventoryValue, getLowStockCount, getTodayMovements,
  formatCurrency
} from '@/data/mockInventoryData';
import type { InventoryProduct, InventoryVariant } from '@/types/inventory';
import { ToastContainer, useToast } from '@/components/admin/Toast';

function StatusBadge({ status }: { status: 'EN_STOCK' | 'STOCK_BAJO' | 'AGOTADO' }) {
  const map = {
    EN_STOCK: { label: 'En Stock', cls: 'bg-green-100 text-green-700' },
    STOCK_BAJO: { label: 'Stock Bajo', cls: 'bg-amber-100 text-amber-700' },
    AGOTADO: { label: 'Agotado', cls: 'bg-red-100 text-red-700' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

interface VariantModalProps {
  product: InventoryProduct;
  onClose: () => void;
}

function VariantModal({ product, onClose }: VariantModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-mono">{product.sku}</p>
            <h2 className="text-lg font-black text-slate-900">{product.name}</h2>
            <p className="text-sm text-slate-500">{product.brand} · {product.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-6">
          <div>
            <p className="text-xs text-slate-400">Stock Total</p>
            <p className="font-bold text-slate-900">{getProductTotalStock(product)} pares</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Precio</p>
            <p className="font-bold text-slate-900">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Valorizado</p>
            <p className="font-bold text-slate-900">{formatCurrency(getProductTotalStock(product) * product.price)}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={getProductStatus(product)} />
          </div>
        </div>

        {/* Variants Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Talla US</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Talla EU</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Stock</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Mín.</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.variants.map((v) => {
                const vs = getVariantStatus(v);
                return (
                  <tr key={v.id} className={`hover:bg-slate-50/50 ${v.stock === 0 ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-3 font-bold text-slate-900 text-sm">US {v.size_us}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">EU {v.size_eu}</td>
                    <td className={`px-4 py-3 font-black text-sm ${v.stock === 0 ? 'text-red-500' : v.stock < v.min_stock ? 'text-amber-600' : 'text-green-600'}`}>
                      {v.stock}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{v.min_stock}</td>
                    <td className="px-4 py-3"><StatusBadge status={vs} /></td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{v.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventarioDashboard() {
  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const totalStock = mockProductsInventory.reduce((s, p) => s + getProductTotalStock(p), 0);
  const lowStockCount = getLowStockCount(mockProductsInventory);
  const totalValue = getTotalInventoryValue(mockProductsInventory);
  const todayMovs = getTodayMovements(mockKardexMovements);

const filtered = mockProductsInventory.filter((p) => {
  const matchSearch =
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase());
  const status = getProductStatus(p);
  const matchLow =
    !showLowStockOnly || status === 'STOCK_BAJO' || status === 'AGOTADO';
  return matchSearch && matchLow;
});

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Central</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <KpiCard
          icon={Package}
          label="Stock Total"
          value={totalStock}
          color="bg-blue-50 text-blue-500"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Stock Bajo / Agotado"
          value={lowStockCount}
          color="bg-amber-50 text-amber-500"
        />
        <KpiCard
          icon={DollarSign}
          label="Valorizado Total"
          value={formatCurrency(totalValue)}
          color="bg-green-50 text-green-500"
        />
        <KpiCard
          icon={Activity}
          label="Movimientos Hoy"
          value={todayMovs}
          color="bg-purple-50 text-purple-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por SKU, producto o marca..."
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
              showLowStockOnly
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Solo Stock Bajo
          </button>

          <div className="ml-auto text-xs text-slate-400">
            {filtered.length} modelo{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">SKU</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Producto</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Marca</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Categoría</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Stock Total</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Precio</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => {
                const stock = getProductTotalStock(product);
                const status = getProductStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-sm text-slate-900">{product.name}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{product.brand}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{product.category}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-black text-sm ${
                        stock === 0 ? 'text-red-500' : stock < 5 ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-600">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4"><StatusBadge status={status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">No se encontraron productos</p>
            <p className="text-slate-400 text-sm mt-1">Ajusta los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <VariantModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
