'use client';

import { useState } from 'react';
import {
  PackageMinus, ChevronRight, CheckCircle, XCircle,
  ClipboardList, ShieldCheck, AlertTriangle, X
} from 'lucide-react';
import { mockSaleRequests, mockProductsInventory, getProductTotalStock } from '@/data/mockInventoryData';
import type { SaleRequest, SaleRequestStatus } from '@/types/inventory';
import { ToastContainer, useToast } from '@/components/admin/Toast';

const STATUS_MAP: Record<SaleRequestStatus, { label: string; cls: string }> = {
  PENDIENTE: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-700' },
  EN_PREPARACION: { label: 'En Preparación', cls: 'bg-blue-100 text-blue-700' },
  ATENDIDO: { label: 'Atendido', cls: 'bg-green-100 text-green-700' },
  RECHAZADO: { label: 'Rechazado', cls: 'bg-red-100 text-red-700' },
};

export default function DespachoPage() {
  const [requests, setRequests] = useState<SaleRequest[]>(mockSaleRequests);
  const [selected, setSelected] = useState<SaleRequest | null>(null);
  const [stockVerified, setStockVerified] = useState(false);
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const handleSelect = (req: SaleRequest) => {
    setSelected(req);
    setStockVerified(false);
    setStockStatus({});
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const handleVerifyStock = () => {
    if (!selected) return;
    const statuses: Record<string, boolean> = {};
    selected.items.forEach((item, i) => {
      const product = mockProductsInventory.find(p => p.id === item.product_id);
      const variant = product?.variants.find(v => v.size_us === item.size_us);
      statuses[`${i}`] = (variant?.stock ?? 0) >= item.quantity;
    });
    setStockStatus(statuses);
    setStockVerified(true);
    const allOk = Object.values(statuses).every(Boolean);
    if (allOk) {
      addToast('success', 'Stock Verificado', 'Todos los artículos tienen stock suficiente para el despacho.');
    } else {
      addToast('warning', 'Stock Insuficiente', 'Algunos artículos no tienen stock suficiente. Revisa el detalle.');
    }
  };

  const updateRequestStatus = (id: string, status: SaleRequestStatus, extra?: Partial<SaleRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, ...extra } : r));
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status, ...extra } : null);
    }
  };

  const handleConfirmDispatch = () => {
    if (!selected) return;
    updateRequestStatus(selected.id, 'ATENDIDO', {
      dispatched_by: 'Luis Paredes',
      dispatch_date: new Date().toISOString(),
    });
    addToast('success', '¡Despacho Confirmado!', `Solicitud ${selected.request_number} despachada. Stock descontado correctamente.`);
    setStockVerified(false);
  };

  const handleReject = () => {
    if (!selected || !rejectionReason.trim()) {
      addToast('error', 'Campo requerido', 'Debes ingresar el motivo de rechazo.');
      return;
    }
    updateRequestStatus(selected.id, 'RECHAZADO', { rejection_reason: rejectionReason });
    addToast('info', 'Solicitud Rechazada', `La solicitud ${selected.request_number} fue rechazada y notificada a Ventas.`);
    setShowRejectModal(false);
    setRejectionReason('');
    setStockVerified(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Despachos y Salidas</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Requests List */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bandeja de Solicitudes</p>
            <p className="text-xs text-slate-400 mt-0.5">{requests.length} solicitude(s)</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {requests.map((req) => {
              const { label, cls } = STATUS_MAP[req.status];
              return (
                <button
                  key={req.id}
                  onClick={() => handleSelect(req)}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${
                    selected?.id === req.id ? 'bg-slate-50 border-l-2 border-slate-900' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{req.request_number}</span>
                    {req.priority === 'URGENTE' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENTE</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{req.client_name}</p>
                  <p className="text-xs text-slate-400">{req.created_by}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
                      {label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ClipboardList className="w-14 h-14 text-slate-200 mb-4" />
              <p className="text-slate-500 font-semibold text-lg">Selecciona una solicitud</p>
              <p className="text-slate-400 text-sm mt-1">Haz clic en una solicitud para ver el detalle</p>
            </div>
          ) : (
            <div className="max-w-2xl">
              {/* Request Header */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{selected.request_number}</p>
                    <h2 className="text-lg font-black text-slate-900">Cliente: {selected.client_name}</h2>
                    <p className="text-sm text-slate-500">Solicitado por {selected.created_by}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(selected.created_date).toLocaleDateString('es-PE', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_MAP[selected.status].cls}`}>
                      {STATUS_MAP[selected.status].label}
                    </span>
                    {selected.priority === 'URGENTE' && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">URGENTE</span>
                    )}
                  </div>
                </div>
                {selected.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs font-semibold text-red-700">Motivo de rechazo:</p>
                    <p className="text-sm text-red-600 mt-0.5">{selected.rejection_reason}</p>
                  </div>
                )}
                {selected.dispatch_date && (
                  <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-700">Despachado por {selected.dispatched_by}</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      {new Date(selected.dispatch_date).toLocaleString('es-PE')}
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Artículos Solicitados</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {selected.items.map((item, idx) => {
                    const verified = stockVerified;
                    const hasStock = stockStatus[`${idx}`];
                    const product = mockProductsInventory.find(p => p.id === item.product_id);
                    const variant = product?.variants.find(v => v.size_us === item.size_us);
                    return (
                      <div key={idx} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{item.product_name}</p>
                            <p className="text-xs font-mono text-slate-400">{item.sku} · US {item.size_us} / EU {item.size_eu}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Cantidad solicitada: <span className="font-bold">{item.quantity}</span></p>
                            {verified && (
                              <p className="text-xs text-slate-400 mt-0.5">Stock disponible: <span className="font-bold">{variant?.stock ?? 0}</span></p>
                            )}
                          </div>
                          {verified && (
                            <div>
                              {hasStock ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                  <CheckCircle className="w-3.5 h-3.5" /> Stock OK
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                  <XCircle className="w-3.5 h-3.5" /> Sin stock
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                {(selected.status === 'PENDIENTE' || selected.status === 'EN_PREPARACION') && (
                  <div className="px-6 py-5 border-t border-slate-100 flex flex-wrap gap-3">
                    {!stockVerified && (
                      <button
                        onClick={handleVerifyStock}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Verificar Stock
                      </button>
                    )}
                    {stockVerified && (
                      <>
                        <button
                          onClick={handleConfirmDispatch}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                        >
                          <PackageMinus className="w-4 h-4" />
                          Confirmar Despacho
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-black text-slate-900">Rechazar Solicitud</h3>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Ingresa el motivo del rechazo. Esta información será enviada al área de Ventas.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Stock insuficiente para la talla US 8 de Jordan 1..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
