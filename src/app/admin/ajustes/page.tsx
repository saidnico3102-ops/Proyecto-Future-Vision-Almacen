'use client';

import { useState, useMemo } from 'react';
import { Scale, Plus, ArrowUp, ArrowDown, Minus, Send } from 'lucide-react';
import {
  mockProductsInventory,
  mockDiscrepancies,
  formatDate,
} from '@/data/mockInventoryData';
import type { DiscrepancyRecord, AdjustmentReason } from '@/types/inventory';
import { ToastContainer, useToast } from '@/components/admin/Toast';

const ADJUSTMENT_REASONS: { value: AdjustmentReason; label: string }[] = [
  { value: 'MERMA', label: 'Merma (deterioro natural)' },
  { value: 'PERDIDA', label: 'Pérdida o extravío' },
  { value: 'DANO', label: 'Daño físico' },
  { value: 'SOBRANTE', label: 'Sobrante no registrado' },
  { value: 'ERROR_CONTEO', label: 'Error de conteo anterior' },
];

function DiscrepancyBadge({ type }: { type: string }) {
  if (type === 'FALTANTE') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><ArrowDown className="w-3 h-3" />Faltante</span>;
  if (type === 'SOBRANTE') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><ArrowUp className="w-3 h-3" />Sobrante</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"><Minus className="w-3 h-3" />Cuadre Exacto</span>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PENDIENTE_AJUSTE') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">Pendiente</span>;
  if (status === 'AJUSTADO') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Ajustado</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Rechazado</span>;
}

export default function AjustesPage() {
  const [records, setRecords] = useState<DiscrepancyRecord[]>(mockDiscrepancies);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [physicalCount, setPhysicalCount] = useState<string>('');
  const [reason, setReason] = useState<AdjustmentReason | ''>('');
  const [notes, setNotes] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const selectedProduct = useMemo(
    () => mockProductsInventory.find(p => p.id === selectedProductId) ?? null,
    [selectedProductId]
  );

  const selectedVariant = useMemo(
    () => selectedProduct?.variants.find(v => v.id === selectedVariantId) ?? null,
    [selectedProduct, selectedVariantId]
  );

  const logicalStock = selectedVariant?.stock ?? null;
  const physicalNum = physicalCount === '' ? null : Number(physicalCount);
  const difference = physicalNum !== null && logicalStock !== null ? physicalNum - logicalStock : null;

  const getDiffLabel = () => {
    if (difference === null) return null;
    if (difference === 0) return { label: 'Cuadre Exacto', cls: 'bg-green-50 text-green-700 border-green-200', icon: <Minus className="w-4 h-4" /> };
    if (difference > 0) return { label: `Sobrante de ${difference} par(es)`, cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <ArrowUp className="w-4 h-4" /> };
    return { label: `Faltante de ${Math.abs(difference)} par(es)`, cls: 'bg-red-50 text-red-700 border-red-200', icon: <ArrowDown className="w-4 h-4" /> };
  };

  const diffInfo = getDiffLabel();

  const handleSubmit = () => {
    if (!selectedProduct || !selectedVariant || physicalNum === null) {
      addToast('error', 'Formulario incompleto', 'Selecciona un producto, talla e ingresa el conteo físico.');
      return;
    }
    if (difference !== 0 && !reason) {
      addToast('error', 'Motivo requerido', 'Debes seleccionar el motivo del ajuste cuando hay diferencia.');
      return;
    }

    const newRecord: DiscrepancyRecord = {
      id: `disc-${Date.now()}`,
      count_date: new Date().toISOString().split('T')[0],
      product_id: selectedProduct.id,
      sku: selectedProduct.sku,
      product_name: selectedProduct.name,
      brand: selectedProduct.brand,
      size_us: selectedVariant.size_us,
      logical_stock: logicalStock!,
      physical_stock: physicalNum,
      difference: difference!,
      discrepancy_type: difference === 0 ? 'CUADRE_EXACTO' : difference! > 0 ? 'SOBRANTE' : 'FALTANTE',
      adjustment_reason: reason || undefined,
      status: 'PENDIENTE_AJUSTE',
      counted_by: 'Luis Paredes',
      notes,
    };

    setRecords(prev => [newRecord, ...prev]);
    addToast('success', '¡Propuesta Enviada!', 'El ajuste fue enviado al Administrador para su aprobación.');

    // Reset
    setSelectedProductId('');
    setSelectedVariantId('');
    setPhysicalCount('');
    setReason('');
    setNotes('');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conteos Físicos y Ajustes</h1>
        <p className="text-slate-500 text-sm mt-1">RF-INV-08 · Auditoría de almacén y propuestas de ajuste</p>
      </div>

      <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-auto">
        {/* Left: Records */}
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-4">Registros de Discrepancias</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1">
              {records.length === 0 ? (
                <div className="py-16 text-center">
                  <Scale className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">Sin registros</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {records.map((rec) => (
                    <div key={rec.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 truncate">{rec.product_name}</p>
                          <p className="text-xs font-mono text-slate-400">{rec.sku} · US {rec.size_us}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{rec.count_date} · {rec.counted_by}</p>
                        </div>
                        <StatusBadge status={rec.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="text-center">
                          <p className="text-[10px] text-slate-400">Lógico</p>
                          <p className="font-bold text-sm text-slate-700">{rec.logical_stock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-400">Físico</p>
                          <p className="font-bold text-sm text-slate-700">{rec.physical_stock}</p>
                        </div>
                        <DiscrepancyBadge type={rec.discrepancy_type} />
                        {rec.adjustment_reason && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {ADJUSTMENT_REASONS.find(r => r.value === rec.adjustment_reason)?.label ?? rec.adjustment_reason}
                          </span>
                        )}
                      </div>
                      {rec.notes && <p className="text-xs text-slate-400 mt-2 italic">{rec.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: New Count Form */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Nuevo Conteo Físico</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Product */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Producto *</label>
              <select
                value={selectedProductId}
                onChange={(e) => { setSelectedProductId(e.target.value); setSelectedVariantId(''); setPhysicalCount(''); }}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white cursor-pointer"
              >
                <option value="">Selecciona un producto...</option>
                {mockProductsInventory.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            {/* Size */}
            {selectedProduct && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Talla *</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => { setSelectedVariantId(e.target.value); setPhysicalCount(''); }}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white cursor-pointer"
                >
                  <option value="">Selecciona una talla...</option>
                  {selectedProduct.variants.map((v) => (
                    <option key={v.id} value={v.id}>US {v.size_us} / EU {v.size_eu} — Stock lógico: {v.stock}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Stock Lógico (Sistema)</p>
                  <p className="text-2xl font-black text-slate-900">{logicalStock}</p>
                  <p className="text-xs text-slate-400">pares</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Conteo Físico Real *</label>
                  <input
                    type="number"
                    min={0}
                    value={physicalCount}
                    onChange={(e) => setPhysicalCount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-center font-bold text-lg"
                  />
                  <p className="text-xs text-slate-400 mt-1 text-center">pares contados</p>
                </div>
              </div>
            )}

            {/* Difference */}
            {diffInfo && (
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${diffInfo.cls}`}>
                {diffInfo.icon}
                <p className="font-semibold text-sm">{diffInfo.label}</p>
              </div>
            )}

            {/* Reason */}
            {difference !== null && difference !== 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Motivo del Ajuste *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as AdjustmentReason)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white cursor-pointer"
                >
                  <option value="">Selecciona un motivo...</option>
                  {ADJUSTMENT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes */}
            {selectedVariant && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Observaciones</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles adicionales del conteo..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                />
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selectedVariant || physicalCount === ''}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Enviar Propuesta de Ajuste al Administrador
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
