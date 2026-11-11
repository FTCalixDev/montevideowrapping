import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import {
  SERVICES_CATALOG,
  VEHICLE_TYPE_LABELS,
  ServiceCategory,
  VehicleType,
  filterServicesByCategory,
  calculateEstimatedQuote,
} from '../utils/studioData';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceForBooking: (serviceId: string, vehicleType: VehicleType) => void;
}

const CATEGORY_TABS: { id: ServiceCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ppf', label: 'PPF' },
  { id: 'ploteos', label: 'Ploteos' },
  { id: 'detailing', label: 'Gyeon & Detail' },
  { id: 'polarizados', label: 'Polarizados & Llantas' },
  { id: 'academia', label: 'Academia' },
];

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceForBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('todos');
  const [vehicleType, setVehicleType] = useState<VehicleType>('auto');

  if (!isOpen) return null;

  const filteredServices = filterServicesByCategory(SERVICES_CATALOG, selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="services-modal-title"
    >
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="services-modal-title" className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Servicios y Precios
            </h2>
            <p className="text-xs text-neutral-400">
              Tratamientos certificados · Gyeon · Alltak · AlloyGator
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar servicios y precios"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-5 pt-3.5 pb-3 border-b border-white/5 space-y-3 bg-black/40">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Vehicle Size Price Adjuster */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-neutral-400 shrink-0">Porte del vehículo:</span>
            <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-white/10">
              {(
                [
                  { id: 'auto', short: 'Auto' },
                  { id: 'suv', short: 'SUV / Pick-up' },
                  { id: 'moto', short: 'Moto' },
                  { id: 'nautica', short: 'Náutica' },
                ] as { id: VehicleType; short: string }[]
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicleType(v.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                    vehicleType === v.id ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {v.short}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Cards List */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {filteredServices.map((service) => {
            const quote = calculateEstimatedQuote(service.id, vehicleType);
            const displayPrice = quote ? quote.estimatedUsd : service.basePriceUsd;

            return (
              <div
                key={service.id}
                className="p-4 rounded-2xl bg-black border border-white/10 hover:border-white/25 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-neutral-400">
                      <span>{service.categoryLabel}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{service.duration}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{service.warranty}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1">{service.title}</h3>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <span className="block text-[10px] text-neutral-500">Desde</span>
                    <span className="text-base font-bold text-white">USD {displayPrice}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">{service.shortDesc}</p>

                <ul className="space-y-1 pt-1 border-t border-white/5">
                  {service.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-1">
                  <button
                    type="button"
                    aria-label={`Cotizar ${service.title}`}
                    onClick={() => onSelectServiceForBooking(service.id, vehicleType)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Cotizar {service.title.split('(')[0].trim()}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}

          <p className="text-[11px] text-center text-neutral-500 pt-1">
            * Valores expresados en dólares estadounidenses como referencia inicial para{' '}
            {VEHICLE_TYPE_LABELS[vehicleType].label}. Sujeto a inspección presencial en el estudio.
          </p>
        </div>
      </div>
    </div>
  );
};
