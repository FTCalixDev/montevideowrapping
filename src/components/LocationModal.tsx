import React, { useState } from 'react';
import { X, MapPin, Clock, Phone, Copy, Check, ArrowUpRight, Shield } from 'lucide-react';
import { STUDIO_INFO, StudioInfoData } from '../utils/studioData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookVisit: () => void;
  studioInfo?: StudioInfoData;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onBookVisit,
  studioInfo = STUDIO_INFO,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(studioInfo.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="location-modal-title" className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Ubicación del Estudio
            </h2>
            <p className="text-xs text-neutral-400">
              Montevideo, Uruguay · Atención con agenda previa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ubicación del estudio"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Studio Card */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{studioInfo.name}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{studioInfo.addressLine}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{studioInfo.neighborhood}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Shield className="w-4 h-4 text-white shrink-0" />
                <span>Cabina cerrada libre de polvo con iluminación túnel LED de inspección</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Clock className="w-4 h-4" />
              <span>Horarios de Recepción y Entrega</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {studioInfo.schedule.map((row) => (
                <div key={row.days} className="flex items-center justify-between text-neutral-300 tabular-nums">
                  <span className="text-neutral-400">{row.days}</span>
                  <span className="font-medium text-white">{row.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Contact & Phone Copy */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-neutral-400">WhatsApp / Teléfono Directo</span>
                <span className="text-sm font-semibold text-white tabular-nums">{studioInfo.phoneDisplay}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPhone ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <a
              href={studioInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Abrir Ubicación en Google Maps</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onBookVisit}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            >
              Coordinar visita de inspección técnica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
