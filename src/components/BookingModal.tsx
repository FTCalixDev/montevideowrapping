import React, { useState, useEffect } from 'react';
import { X, Check, MessageCircle, Copy, Calendar, ArrowUpRight } from 'lucide-react';
import {
  SERVICES_CATALOG,
  VEHICLE_TYPE_LABELS,
  STUDIO_INFO,
  ServiceItem,
  StudioInfoData,
  VehicleMultiplierMap,
  VehicleType,
  BookingFormInput,
  calculateEstimatedQuote,
  validateBookingRequest,
  buildWhatsAppBookingUrl,
} from '../utils/studioData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialVehicleType?: VehicleType;
  services?: ServiceItem[];
  studioInfo?: StudioInfoData;
  vehicleMultipliers?: VehicleMultiplierMap;
  onBookingConfirmed: (booking: BookingFormInput & { estimatedUsd: number; whatsappUrl: string }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId = 'ppf-front',
  initialVehicleType = 'auto',
  services = SERVICES_CATALOG,
  studioInfo = STUDIO_INFO,
  vehicleMultipliers = VEHICLE_TYPE_LABELS,
  onBookingConfirmed,
}) => {
  const [clientName, setClientName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialVehicleType);
  const [serviceId, setServiceId] = useState<string>(initialServiceId);
  const [preferredShift, setPreferredShift] = useState<'manana' | 'tarde' | 'sabado'>('manana');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ clientName?: string; vehicleModel?: string; serviceId?: string }>({});
  const [submittedBooking, setSubmittedBooking] = useState<{
    whatsappUrl: string;
    estimatedUsd: number;
    serviceTitle: string;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (initialServiceId && services.some((s) => s.id === initialServiceId)) {
      setServiceId(initialServiceId);
    } else if (services.length > 0) {
      setServiceId(services[0].id);
    }
  }, [initialServiceId, services]);

  useEffect(() => {
    if (initialVehicleType) setVehicleType(initialVehicleType);
  }, [initialVehicleType]);

  if (!isOpen) return null;

  const quote = calculateEstimatedQuote(serviceId, vehicleType, services, vehicleMultipliers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formInput: BookingFormInput = {
      clientName,
      vehicleModel,
      vehicleType,
      serviceId,
      preferredShift,
      notes,
    };

    const validation = validateBookingRequest(formInput, services);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const whatsappUrl = buildWhatsAppBookingUrl(
      formInput,
      services,
      vehicleMultipliers,
      studioInfo.whatsappNumber
    );
    const estimatedUsd = quote ? quote.estimatedUsd : 0;

    setSubmittedBooking({
      whatsappUrl,
      estimatedUsd,
      serviceTitle: quote ? quote.service.title : 'Servicio Montevideo Wrapping',
    });

    onBookingConfirmed({
      ...formInput,
      estimatedUsd,
      whatsappUrl,
    });
  };

  const handleCopyDetails = () => {
    if (!submittedBooking) return;
    const rawText = decodeURIComponent(submittedBooking.whatsappUrl.split('?text=')[1] || '');
    navigator.clipboard?.writeText(rawText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="booking-modal-title" className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Agendar Turno
            </h2>
            <p className="text-xs text-neutral-400">
              Atención directa · WhatsApp {studioInfo.phoneDisplay}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de turno"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submittedBooking ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-black border border-white/20 space-y-3">
                <div className="flex items-center gap-2.5 text-white">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Solicitud Lista para Enviar</h3>
                    <p className="text-xs text-neutral-400">Turno pre-configurado para nuestro equipo técnico</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs space-y-1.5 text-neutral-300">
                  <p>
                    <span className="text-neutral-500">Cliente:</span> {clientName}
                  </p>
                  <p>
                    <span className="text-neutral-500">Vehículo:</span> {vehicleModel} ({vehicleMultipliers[vehicleType].label})
                  </p>
                  <p>
                    <span className="text-neutral-500">Tratamiento:</span> {submittedBooking.serviceTitle}
                  </p>
                  <p className="tabular-nums">
                    <span className="text-neutral-500">Inversión estimada desde:</span>{' '}
                    <span className="text-white font-semibold">USD {submittedBooking.estimatedUsd}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={submittedBooking.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Solicitud por WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyDetails}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Mensaje copiado' : 'Copiar resumen'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
                  >
                    Editar datos
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Vehicle Type Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  1. Categoría de Vehículo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(vehicleMultipliers) as VehicleType[]).map((typeKey) => {
                    const active = vehicleType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setVehicleType(typeKey)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-black/60 text-neutral-300 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <span className="block truncate">{vehicleMultipliers[typeKey].label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Selector */}
              <div>
                <label htmlFor="booking-service" className="block text-xs font-medium text-neutral-300 mb-1.5">
                  2. Servicio o Tratamiento
                </label>
                <select
                  id="booking-service"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:outline-none focus:border-white"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id} className="bg-[#111111] text-white">
                      {service.title} — desde USD {service.basePriceUsd}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="mt-1 text-xs text-red-400">{errors.serviceId}</p>}
              </div>

              {/* Live Reference Quote Banner */}
              {quote && (
                <div className="p-3.5 rounded-xl bg-black border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-xs text-neutral-400 truncate">{quote.service.title}</span>
                    <span className="block text-xs text-neutral-500 mt-0.5">
                      {quote.service.duration} · {quote.service.warranty}
                    </span>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <span className="block text-[11px] text-neutral-400">Estimado desde</span>
                    <span className="text-base font-bold text-white">USD {quote.estimatedUsd}</span>
                  </div>
                </div>
              )}

              {/* Client Name & Vehicle Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-name" className="block text-xs font-medium text-neutral-300 mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (errors.clientName) setErrors({ ...errors, clientName: undefined });
                    }}
                    placeholder="Ej: Martín Silva"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                  />
                  {errors.clientName && <p className="mt-1 text-xs text-red-400">{errors.clientName}</p>}
                </div>

                <div>
                  <label htmlFor="booking-vehicle" className="block text-xs font-medium text-neutral-300 mb-1">
                    Marca y Modelo *
                  </label>
                  <input
                    id="booking-vehicle"
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => {
                      setVehicleModel(e.target.value);
                      if (errors.vehicleModel) setErrors({ ...errors, vehicleModel: undefined });
                    }}
                    placeholder="Ej: BMW M4 / Porsche Macan"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                  />
                  {errors.vehicleModel && <p className="mt-1 text-xs text-red-400">{errors.vehicleModel}</p>}
                </div>
              </div>

              {/* Preferred Shift */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Preferencia Horaria para Inspección / Ingreso
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'manana', label: 'Mañana', sub: '09 a 13 hs' },
                    { id: 'tarde', label: 'Tarde', sub: '14 a 18:30' },
                    { id: 'sabado', label: 'Sábado', sub: '09 a 14 hs' },
                  ].map((item) => {
                    const active = preferredShift === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPreferredShift(item.id as 'manana' | 'tarde' | 'sabado')}
                        className={`min-h-[44px] p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                          active
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-black/60 text-neutral-300 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <span className="block text-xs">{item.label}</span>
                        <span className={`block text-[10px] ${active ? 'text-neutral-700' : 'text-neutral-500'}`}>
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="booking-notes" className="block text-xs font-medium text-neutral-300 mb-1">
                  Color deseado o consulta (opcional)
                </label>
                <input
                  id="booking-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Quiero ver muestras de vinilo satinado o PPF ópticas"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Generar Reserva para WhatsApp</span>
                </button>

                <a
                  href={`https://wa.me/${studioInfo.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>O chatear directo por WhatsApp ({studioInfo.phoneDisplay})</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
