'use client';

import { useState } from 'react';
import {
  PackageCheck, ChevronRight, AlertCircle, Minus, Check,
  ClipboardList, CheckCircle2
} from 'lucide-react';
import { mockPurchaseOrders } from '@/data/mockInventoryData';
import type { PurchaseOrder, PurchaseOrderItem } from '@/types/inventory';
import { ToastContainer, useToast } from '@/components/admin/Toast';

interface ItemState {
  quantity_received: number;
  status: 'CONFORME' | 'DANADO' | 'FALTANTE' | 'PENDIENTE';
  notes: string;
}

export default function RecepcionPage() {
  const [selectedOC, setSelectedOC] = useState<PurchaseOrder | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [remissionGuide, setRemissionGuide] = useState('');
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  const [confirmedOCs, setConfirmedOCs] = useState<string[]>([]);
  const { toasts, addToast, removeToast } = useToast();

  const pendingOrders = mockPurchaseOrders.filter(
    (oc) => oc.status === 'PENDIENTE' && !confirmedOCs.includes(oc.id)
  );
  const attendedOrders = mockPurchaseOrders.filter(
    (oc) => oc.status === 'ATENDIDO' || confirmedOCs.includes(oc.id)
  );

  const initItemStates = (oc: PurchaseOrder) => {
    const states: Record<string, ItemState> = {};
    oc.items.forEach((item, i) => {
      states[`${i}`] = {
        quantity_received: item.quantity_ordered,
        status: 'PENDIENTE',
        notes: '',
      };
    });
    setItemStates(states);
  };

  const handleSelectOC = (oc: PurchaseOrder) => {
    setSelectedOC(oc);
    setInvoiceNumber('');
    setRemissionGuide('');
    initItemStates(oc);
  };

  const updateItemState = (idx: string, partial: Partial<ItemState>) => {
    setItemStates((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], ...partial },
    }));
  };

  const handleConfirm = () => {
    if (!selectedOC) return;
    if (!invoiceNumber.trim()) {
      addToast('error', 'Campo requerido', 'Ingresa el número de factura antes de confirmar.');
      return;
    }
    if (!remissionGuide.trim()) {
      addToast('error', 'Campo requerido', 'Ingresa la guía de remisión antes de confirmar.');
      return;
    }
    setConfirmedOCs((prev) => [...prev, selectedOC.id]);
    addToast('success', '¡Recepción Confirmada!', `OC ${selectedOC.order_number} registrada. Stock actualizado correctamente.`);
    setSelectedOC(null);
    setInvoiceNumber('');
    setRemissionGuide('');
    setItemStates({});
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recepción de Mercadería</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* OC List */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Órdenes Pendientes</p>
            <p className="text-xs text-slate-400 mt-0.5">{pendingOrders.length} orden(es) por recibir</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {pendingOrders.length === 0 && (
              <div className="py-8 text-center px-4">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Todo al día</p>
                <p className="text-xs text-slate-400">No hay órdenes pendientes</p>
              </div>
            )}
            {pendingOrders.map((oc) => (
              <button
                key={oc.id}
                onClick={() => handleSelectOC(oc)}
                className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${
                  selectedOC?.id === oc.id ? 'bg-slate-50 border-l-2 border-slate-900' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{oc.order_number}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">{oc.supplier}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {oc.items.length} artículo(s) · Esperado: {new Date(oc.expected_date).toLocaleDateString('es-PE')}
                </p>
                <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                  Pendiente
                </span>
              </button>
            ))}
          </div>

          {/* History */}
          {attendedOrders.length > 0 && (
            <div className="border-t border-slate-200">
              <div className="px-5 py-3 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historial Atendido</p>
              </div>
              <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {attendedOrders.map((oc) => (
                  <div key={oc.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500">{oc.order_number}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Atendido</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{oc.supplier}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reception Form */}
        <div className="flex-1 overflow-y-auto p-8">
          {!selectedOC ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ClipboardList className="w-14 h-14 text-slate-200 mb-4" />
              <p className="text-slate-500 font-semibold text-lg">Selecciona una orden de compra</p>
              <p className="text-slate-400 text-sm mt-1">Haz clic en una OC pendiente para iniciar la recepción</p>
            </div>
          ) : (
            <div className="max-w-3xl">
              {/* OC Header */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{selectedOC.order_number}</p>
                    <h2 className="text-lg font-black text-slate-900">{selectedOC.supplier}</h2>
                    <p className="text-sm text-slate-500">RUC: {selectedOC.supplier_ruc}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">Pendiente</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">N° Factura *</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Ej: FACT-1025"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Guía de Remisión *</label>
                    <input
                      type="text"
                      value={remissionGuide}
                      onChange={(e) => setRemissionGuide(e.target.value)}
                      placeholder="Ej: GR-0988"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Fecha Recepción</label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Productos a Recibir</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Verifica cada artículo e indica su conformidad</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOC.items.map((item, idx) => {
                    const key = `${idx}`;
                    const state = itemStates[key] || { quantity_received: item.quantity_ordered, status: 'PENDIENTE', notes: '' };
                    const isDamaged = state.status === 'DANADO';
                    const isMissing = state.status === 'FALTANTE';
                    const isConforme = state.status === 'CONFORME';
                    return (
                      <div key={idx} className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-900">{item.product_name}</p>
                            <p className="text-xs font-mono text-slate-400">{item.sku} · US {item.size_us} / EU {item.size_eu}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Qty received */}
                            <div className="text-center">
                              <p className="text-[10px] text-slate-400 mb-1">Pedido</p>
                              <span className="font-bold text-slate-600">{item.quantity_ordered}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 mt-3" />
                            <div className="text-center">
                              <p className="text-[10px] text-slate-400 mb-1">Recibido</p>
                              <input
                                type="number"
                                min={0}
                                max={item.quantity_ordered}
                                value={state.quantity_received}
                                onChange={(e) => updateItemState(key, { quantity_received: Number(e.target.value) })}
                                className="w-16 text-center px-2 py-1 text-sm font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                              />
                            </div>
                          </div>
                          {/* Action buttons */}
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => updateItemState(key, { status: isConforme ? 'PENDIENTE' : 'CONFORME' })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                isConforme
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              Conforme
                            </button>
                            <button
                              onClick={() => updateItemState(key, { status: isDamaged ? 'PENDIENTE' : 'DANADO' })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                isDamaged
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Dañado
                            </button>
                            <button
                              onClick={() => updateItemState(key, { status: isMissing ? 'PENDIENTE' : 'FALTANTE' })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                isMissing
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                              Faltante
                            </button>
                          </div>
                        </div>
                        {/* Notes for damaged / missing */}
                        {(isDamaged || isMissing) && (
                          <div className="mt-3">
                            <textarea
                              value={state.notes}
                              onChange={(e) => updateItemState(key, { notes: e.target.value })}
                              placeholder={isDamaged ? 'Describe el daño observado...' : 'Describe el faltante...'}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Confirm Button */}
                <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedOC(null)}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <PackageCheck className="w-4 h-4" />
                    Confirmar Recepción e Incrementar Stock
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
