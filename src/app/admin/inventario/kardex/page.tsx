'use client';

import { useState, useMemo } from 'react';
import { Search, Download, FileText, X, ArrowRight } from 'lucide-react';
import { mockKardexMovements, formatDate } from '@/data/mockInventoryData';
import type { MovementType } from '@/types/inventory';
import { ToastContainer, useToast } from '@/components/admin/Toast';

const MOVEMENT_LABELS: Record<MovementType, { label: string; cls: string; sign: string }> = {
  INGRESO: { label: 'Ingreso', cls: 'bg-blue-100 text-blue-700', sign: '+' },
  SALIDA: { label: 'Salida', cls: 'bg-red-100 text-red-700', sign: '-' },
  AJUSTE_POSITIVO: { label: 'Ajuste +', cls: 'bg-green-100 text-green-700', sign: '+' },
  AJUSTE_NEGATIVO: { label: 'Ajuste -', cls: 'bg-orange-100 text-orange-700', sign: '-' },
};

const MOVEMENT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los movimientos' },
  { value: 'INGRESO', label: 'Ingresos' },
  { value: 'SALIDA', label: 'Salidas' },
  { value: 'AJUSTE_POSITIVO', label: 'Ajustes Positivos' },
  { value: 'AJUSTE_NEGATIVO', label: 'Ajustes Negativos' },
];

export default function KardexPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const { toasts, addToast, removeToast } = useToast();

  const filtered = useMemo(() => {
    return mockKardexMovements
      .filter((m) => {
        const matchSearch =
          !search ||
          m.sku.toLowerCase().includes(search.toLowerCase()) ||
          m.product_name.toLowerCase().includes(search.toLowerCase()) ||
          m.document_ref.toLowerCase().includes(search.toLowerCase());
        const matchType = !typeFilter || m.movement_type === typeFilter;
        return matchSearch && matchType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, typeFilter]);

  const handleExport = () => {
    addToast('success', 'Exportación iniciada', 'El reporte CSV se está generando. Estará listo en breve.');
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kardex de Inventario</h1>
          <p className="text-slate-500 text-sm mt-1">RF-INV-06 · Trazabilidad cronológica de movimientos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            onClick={() => addToast('info', 'Generando PDF', 'El reporte PDF se está preparando...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-3 mb-6">
        {(['INGRESO', 'SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'] as MovementType[]).map((type) => {
          const count = mockKardexMovements.filter(m => m.movement_type === type).length;
          const { label, cls } = MOVEMENT_LABELS[type];
          return (
            <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>
              <span>{label}</span>
              <span className="font-black">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Filters */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar SKU, producto o documento..."
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white text-slate-700 cursor-pointer"
          >
            {MOVEMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="ml-auto text-xs text-slate-400">{filtered.length} registros</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 whitespace-nowrap">Fecha</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">SKU / Producto</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Talla</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Tipo</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Cantidad</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Stock</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Documento</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => {
                const { label, cls, sign } = MOVEMENT_LABELS[m.movement_type];
                const isPositive = sign === '+';
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{formatDate(m.date)}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-sm text-slate-900">{m.product_name}</p>
                      <p className="text-xs font-mono text-slate-400">{m.sku}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">US {m.size_us} / EU {m.size_eu}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
                    </td>
                    <td className={`px-4 py-4 text-right font-black text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                      {sign}{m.quantity}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <span className="text-slate-400">{m.stock_before}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>{m.stock_after}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{m.document_ref}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{m.responsible}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">Sin registros</p>
            <p className="text-slate-400 text-sm mt-1">Ajusta los filtros de búsqueda</p>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
