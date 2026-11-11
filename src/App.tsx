/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  Clock,
  Phone,
  Calendar,
} from 'lucide-react';
import {
  StudioCmsState,
  VehicleType,
  PortfolioCategory,
  BookingFormInput,
  loadCmsState,
  saveCmsState,
  calculateEstimatedQuote,
  filterPortfolioByCategory,
  validateBookingRequest,
  buildWhatsAppBookingUrl,
} from './utils/studioData';
import { BookingModal } from './components/BookingModal';
import { PortfolioModal } from './components/PortfolioModal';
import { LocationModal } from './components/LocationModal';
import { SecretAdminModal } from './components/SecretAdminModal';

type ActiveModal = 'booking' | 'portfolio' | 'location' | 'secret-admin' | null;

export default function App() {
  const [cmsState, setCmsState] = useState<StudioCmsState>(() => loadCmsState());
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>('auto');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    () => loadCmsState().services[0]?.id ?? 'ppf-front'
  );
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioCategory>('todos');

  // Inline Quote Configurator State
  const [clientName, setClientName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [preferredShift] = useState<'manana' | 'tarde' | 'sabado'>('manana');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<{
    clientName?: string;
    vehicleModel?: string;
    serviceId?: string;
  }>({});
  const [confirmedQuote, setConfirmedQuote] = useState<
    (BookingFormInput & { estimatedUsd: number; whatsappUrl: string }) | null
  >(null);

  // Secret Keyboard Combination Listener (Ctrl+Shift+M, Cmd+Shift+M, or Alt+W)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlShiftM = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm';
      const isAltW = e.altKey && e.key.toLowerCase() === 'w';

      if (isCtrlShiftM || isAltW) {
        e.preventDefault();
        setActiveModal('secret-admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateCmsState = (nextState: StudioCmsState) => {
    setCmsState(nextState);
    saveCmsState(nextState);
    if (
      nextState.services.length > 0 &&
      !nextState.services.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId(nextState.services[0].id);
    }
  };

  const handleSelectBentoService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveModal('booking');
  };

  const handleInlineQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: BookingFormInput = {
      clientName,
      vehicleModel,
      vehicleType,
      serviceId: selectedServiceId,
      preferredShift,
      notes,
    };

    const validation = validateBookingRequest(input, cmsState.services);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const quote = calculateEstimatedQuote(
      selectedServiceId,
      vehicleType,
      cmsState.services,
      cmsState.vehicleMultipliers
    );
    const whatsappUrl = buildWhatsAppBookingUrl(
      input,
      cmsState.services,
      cmsState.vehicleMultipliers,
      cmsState.studioInfo.whatsappNumber
    );

    setConfirmedQuote({
      ...input,
      estimatedUsd: quote ? quote.estimatedUsd : 950,
      whatsappUrl,
    });
  };

  const { studioInfo, services, portfolio, vehicleMultipliers } = cmsState;
  const activeInlineQuote = calculateEstimatedQuote(
    selectedServiceId,
    vehicleType,
    services,
    vehicleMultipliers
  );
  const filteredPortfolio = filterPortfolioByCategory(portfolio, portfolioFilter);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-white selection:text-black pb-24">
      {/* 1. FLOATING GLASS NAVBAR (Sticky Top Bar Contract: 3 Zones) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-14 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto h-full px-5 md:px-10 flex items-center justify-between gap-8">
          {/* Zone 1: Minimalist Brand Wordmark */}
          <a
            href="#"
            className="font-display text-lg font-bold tracking-[0.14em] uppercase text-white whitespace-nowrap shrink-0"
          >
            {studioInfo.brandLogoText}
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav
            aria-label="Navegación Principal"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300"
          >
            <a
              href="#servicios"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Servicios
            </a>
            <a
              href="#marcas"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Certificaciones
            </a>
            <a
              href="#casos"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Portafolio
            </a>
            <a
              href="#cotizador"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Cotizador
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveModal('booking')}
              className="min-h-[38px] px-5 py-1.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Agendar
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 2. CINEMATIC HERO SECTION (min-h-screen, Bottom-Left Magazine Layout) */}
        <section
          aria-label="Presentación Principal"
          className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#050505]"
        >
          {/* Full-Bleed Single-Frame Studio Backdrop */}
          <div className="absolute inset-0">
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `url(${studioInfo.portfolioGridAsset})`,
                backgroundSize: '515% 270%',
                backgroundPosition: '50% 6%',
              }}
              className="absolute inset-0 bg-no-repeat opacity-60 scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/70 to-black/35"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-black/55 to-transparent"
            />
          </div>

          {/* Bottom-Heavy Editorial Typography */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-5 md:px-10 pb-28 md:pb-28 pt-32">
            <div className="max-w-4xl space-y-5 animate-fade-up">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium tracking-widest uppercase text-neutral-300">
                <span>Montevideo, Uruguay</span>
                <span aria-hidden="true">·</span>
                <span>Detail &amp; Protection Studio</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">WhatsApp {studioInfo.phoneDisplay}</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6.2vw, 5.5rem)',
                  lineHeight: 0.94,
                  textWrap: 'balance',
                }}
                className="font-display font-bold uppercase tracking-tighter text-white"
              >
                {studioInfo.heroHeadline}
              </h1>

              <p className="text-base md:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
                {studioInfo.heroSubtitle}
              </p>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <a
                  href="#servicios"
                  className="min-h-[46px] px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white font-semibold text-sm inline-flex items-center justify-center gap-2.5 transition-colors w-fit whitespace-nowrap shrink-0"
                >
                  <span>Explorar Tratamientos</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 tabular-nums">
                  <span>TPU 200 Micras Self-Healing</span>
                  <span aria-hidden="true">·</span>
                  <span>Cerámico Gyeon 9H</span>
                  <span aria-hidden="true">·</span>
                  <span>Garantía hasta 10 Años</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ASYMMETRICAL BENTO GRID SERVICES SECTION */}
        <section id="servicios" className="max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-28">
          <div className="px-2 mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                01. Arquitectura de Servicios
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 4vw, 3.25rem)',
                  lineHeight: 1.0,
                  textWrap: 'balance',
                }}
                className="font-display font-bold uppercase tracking-tight text-white mt-2"
              >
                BLINDAJE TRANSPARENTE, CORRECCIÓN Y COLOR
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <span className="text-xs text-neutral-400 whitespace-nowrap">
                Porte para valores de referencia:
              </span>
              <div
                role="group"
                aria-label="Seleccionar porte del vehículo"
                className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10"
              >
                {(Object.keys(vehicleMultipliers) as VehicleType[]).map((key) => {
                  const active = vehicleType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVehicleType(key)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        active
                          ? 'bg-white text-black font-semibold'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {vehicleMultipliers[key].shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {services.map((service, idx) => {
              const quote = calculateEstimatedQuote(
                service.id,
                vehicleType,
                services,
                vehicleMultipliers
              );
              const displayPrice = quote ? quote.estimatedUsd : service.basePriceUsd;
              const isLarge = idx === 0 || service.bentoSpan === 'large';

              if (isLarge) {
                return (
                  <article
                    key={service.id}
                    className="md:col-span-2 lg:col-span-2 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 hover:scale-[1.015] transition-all duration-200 p-6 md:p-8 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="space-y-2.5 max-w-xl">
                        <div className="text-xs text-neutral-400 tabular-nums">
                          <span>
                            {String(idx + 1).padStart(2, '0')}. {service.categoryLabel}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span>{service.warranty}</span>
                        </div>
                        <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                          {service.title}
                        </h3>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {service.shortDesc}
                        </p>
                      </div>

                      <div className="shrink-0 lg:text-right tabular-nums">
                        <span className="block text-xs text-neutral-400">
                          {vehicleMultipliers[vehicleType].shortLabel} desde
                        </span>
                        <span className="font-display text-3xl font-bold text-white">
                          USD {displayPrice}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                      <div
                        role="img"
                        aria-label={`Instalación de ${service.title}`}
                        className="lg:col-span-7 relative h-56 md:h-64 rounded-2xl overflow-hidden bg-black border border-white/10"
                      >
                        <div
                          aria-hidden="true"
                          style={{
                            backgroundImage: `url(${
                              service.customImageUrl || studioInfo.portfolioGridAsset
                            })`,
                            backgroundSize: service.customImageUrl ? 'cover' : '515% 270%',
                            backgroundPosition: service.imagePosition || '50% 6%',
                          }}
                          className="absolute inset-0 bg-no-repeat"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-neutral-200">
                          <span>{service.duration} en cabina</span>
                          <span className="font-mono text-white tabular-nums">
                            {service.warranty}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                        <ul className="space-y-2.5 text-xs text-neutral-300">
                          {service.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          type="button"
                          onClick={() => handleSelectBentoService(service.id)}
                          aria-label={`Cotizar ${service.title}`}
                          className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          <span>Cotizar {service.title.split('(')[0].trim()}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={service.id}
                  className="rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-200 p-6 md:p-8 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-400 tabular-nums">
                      <span>
                        {String(idx + 1).padStart(2, '0')}. {service.categoryLabel}
                      </span>
                      <span className="text-white font-semibold">Desde USD {displayPrice}</span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                        {service.title}
                      </h3>
                      <p className="text-sm font-medium text-neutral-300 mt-1">
                        {service.bentoSubtext}
                      </p>
                    </div>

                    <div
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${
                          service.customImageUrl || studioInfo.portfolioGridAsset
                        })`,
                        backgroundSize: service.customImageUrl ? 'cover' : '515% 270%',
                        backgroundPosition: service.imagePosition || '1% 6%',
                      }}
                      className="h-36 rounded-2xl bg-black border border-white/10 bg-no-repeat relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-2.5 left-3 text-[11px] text-neutral-300">
                        {service.duration} · {service.warranty}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">{service.shortDesc}</p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSelectBentoService(service.id)}
                      aria-label={`Cotizar ${service.title}`}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Cotizar {service.title.split(':')[0].trim()}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. BRANDS & TRUST BANNER */}
        <section
          id="marcas"
          aria-label="Marcas y Certificaciones Oficiales"
          className="border-y border-white/10 bg-white/[0.03] backdrop-blur-md py-10 px-5 md:px-10"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
                Respaldo Internacional en Montevideo
              </p>
              <h2 className="font-display text-xl md:text-2xl uppercase tracking-wider text-white font-bold">
                {studioInfo.trustBannerText}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs text-neutral-300 tabular-nums">
              <div>
                <span className="block font-display text-2xl font-bold text-white">+190</span>
                <span className="text-neutral-400">Proyectos Documentados</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
              <div>
                <span className="block font-display text-2xl font-bold text-white">23K+</span>
                <span className="text-neutral-400">Comunidad en Instagram</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
              <div>
                <span className="block font-display text-2xl font-bold text-white">10 AÑOS</span>
                <span className="text-neutral-400">Garantía en Línea PPF</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. REAL STUDIO PORTFOLIO & CASE STUDIES */}
        <section id="casos" className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                02. Trabajos Realizados en Cabina
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 4vw, 3.25rem)',
                  lineHeight: 1.0,
                  textWrap: 'balance',
                }}
                className="font-display font-bold uppercase tracking-tight text-white mt-2"
              >
                PORTAFOLIO DE UNIDADES TRATADAS
              </h2>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(
                [
                  { id: 'todos', label: 'Todos' },
                  { id: 'ppf', label: 'PPF' },
                  { id: 'ploteos', label: 'Car Wrapping' },
                  { id: 'detailing', label: 'Detailing Gyeon' },
                  { id: 'motos_nautica', label: 'Motos & Náutica' },
                ] as { id: PortfolioCategory; label: string }[]
              ).map((tab) => {
                const active = portfolioFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPortfolioFilter(tab.id)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPortfolio.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div
                    role="img"
                    aria-label={item.vehicle}
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: '515% 270%',
                      backgroundPosition: item.objectPosition,
                    }}
                    className="h-56 bg-neutral-900 bg-no-repeat relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-300 tabular-nums">
                      <span>{item.categoryLabel}</span>
                      <span>{item.durationHours} hs en cabina</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="text-xs text-neutral-400">
                      <span>{item.brandMaterial}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wide">
                      {item.vehicle}
                    </h3>
                    <p className="text-xs font-medium text-neutral-200">{item.treatment}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed pt-1">{item.summary}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal('portfolio')}
                    aria-label={`Ver ficha técnica de ${item.vehicle}`}
                    className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white hover:text-black text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Inspeccionar Ficha del Proyecto</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 6. INTERACTIVE ON-PAGE BESPOKE QUOTE & BOOKING CONFIGURATOR */}
        <section
          id="cotizador"
          className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24 border-t border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                  03. Presupuesto Directo &amp; Agenda
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.85rem, 3.8vw, 3rem)',
                    lineHeight: 1.0,
                    textWrap: 'balance',
                  }}
                  className="font-display font-bold uppercase tracking-tight text-white mt-2"
                >
                  CONFIGURÁ EL TRATAMIENTO DE TU VEHÍCULO
                </h2>
                <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                  Seleccioná el porte de tu unidad y el tratamiento deseado para calcular una referencia inicial y enviar los datos técnicos directamente al WhatsApp de nuestro estudio.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 space-y-4">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{studioInfo.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{studioInfo.addressLine}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{studioInfo.neighborhood}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/10">
                  <Clock className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1 text-neutral-300 tabular-nums">
                    {studioInfo.schedule.map((row) => (
                      <p key={row.days}>
                        {row.days}: {row.hours}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-neutral-300 tabular-nums">
                    <Phone className="w-4 h-4 text-white" />
                    <span>WhatsApp: {studioInfo.phoneDisplay}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal('location')}
                    className="text-xs font-semibold text-white hover:underline cursor-pointer"
                  >
                    Ver Mapa y Ubicación →
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8">
              {confirmedQuote ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase text-white">
                        Cotización Lista para Enviar a Cabina
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Resumen técnico preparado para {confirmedQuote.clientName}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/70 border border-white/15 space-y-2 text-xs text-neutral-300 tabular-nums">
                    <p>
                      <span className="text-neutral-500">Vehículo:</span>{' '}
                      {confirmedQuote.vehicleModel} (
                      {vehicleMultipliers[confirmedQuote.vehicleType].label})
                    </p>
                    <p>
                      <span className="text-neutral-500">Servicio:</span>{' '}
                      {services.find((s) => s.id === confirmedQuote.serviceId)?.title}
                    </p>
                    <p>
                      <span className="text-neutral-500">Valor estimado desde:</span>{' '}
                      <span className="text-white font-bold">
                        USD {confirmedQuote.estimatedUsd}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={confirmedQuote.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[48px] px-6 py-3 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmar por WhatsApp ({studioInfo.phoneDisplay})</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmedQuote(null)}
                      className="min-h-[48px] px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Modificar Datos
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInlineQuoteSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inline-service"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Tratamiento Principal
                      </label>
                      <select
                        id="inline-service"
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:outline-none focus:border-white"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#111111] text-white">
                            {s.title} — desde USD {s.basePriceUsd}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inline-vehicle-type"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Porte del Vehículo
                      </label>
                      <select
                        id="inline-vehicle-type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:outline-none focus:border-white"
                      >
                        {(Object.keys(vehicleMultipliers) as VehicleType[]).map((k) => (
                          <option key={k} value={k} className="bg-[#111111] text-white">
                            {vehicleMultipliers[k].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inline-client-name"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Tu Nombre *
                      </label>
                      <input
                        id="inline-client-name"
                        type="text"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value);
                          if (formErrors.clientName)
                            setFormErrors({ ...formErrors, clientName: undefined });
                        }}
                        placeholder="Ej: Martín Silva"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                      />
                      {formErrors.clientName && (
                        <p className="mt-1 text-xs text-red-400">{formErrors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inline-vehicle-model"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Marca, Modelo y Año *
                      </label>
                      <input
                        id="inline-vehicle-model"
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => {
                          setVehicleModel(e.target.value);
                          if (formErrors.vehicleModel)
                            setFormErrors({ ...formErrors, vehicleModel: undefined });
                        }}
                        placeholder="Ej: Porsche Macan GTS 2025"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                      />
                      {formErrors.vehicleModel && (
                        <p className="mt-1 text-xs text-red-400">{formErrors.vehicleModel}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <label
                        htmlFor="inline-notes"
                        className="block text-xs font-medium text-neutral-300 mb-1.5"
                      >
                        Color o detalle adicional (opcional)
                      </label>
                      <input
                        id="inline-notes"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Busco acabado Satin Stealth"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                      />
                    </div>

                    {activeInlineQuote && (
                      <div className="p-3.5 rounded-2xl bg-black border border-white/10 flex items-center justify-between tabular-nums">
                        <div>
                          <span className="block text-[11px] text-neutral-400">
                            Inversión estimada desde
                          </span>
                          <span className="text-xs text-neutral-300">
                            {activeInlineQuote.service.warranty}
                          </span>
                        </div>
                        <span className="font-display text-2xl font-bold text-white">
                          USD {activeInlineQuote.estimatedUsd}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Calcular y Preparar Solicitud por WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER (Zero code/admin buttons) */}
      <footer className="border-t border-white/10 py-12 px-5 md:px-10 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
              {studioInfo.brandLogoText}
            </span>
            <span aria-hidden="true">·</span>
            <span>© 2026 {studioInfo.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={studioInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram ({studioInfo.instagramHandle})
            </a>
            <a
              href={studioInfo.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </a>
            <a
              href={studioInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Google Maps
            </a>
          </div>
        </div>
      </footer>

      {/* 5. STICKY MOBILE & CONVERSION ACTION BAR */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-40">
        <button
          type="button"
          onClick={() => setActiveModal('booking')}
          className="w-full h-12 px-6 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(255,255,255,0.28)] hover:bg-neutral-200 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>Cotizar Vehículo por WhatsApp</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Modals */}
      <BookingModal
        isOpen={activeModal === 'booking'}
        onClose={() => setActiveModal(null)}
        initialServiceId={selectedServiceId}
        initialVehicleType={vehicleType}
        services={services}
        studioInfo={studioInfo}
        vehicleMultipliers={vehicleMultipliers}
        onBookingConfirmed={(booking) => setConfirmedQuote(booking)}
      />

      <PortfolioModal
        isOpen={activeModal === 'portfolio'}
        onClose={() => setActiveModal(null)}
        portfolioItems={portfolio}
        studioInfo={studioInfo}
        onQuoteSimilar={() => setActiveModal('booking')}
      />

      <LocationModal
        isOpen={activeModal === 'location'}
        onClose={() => setActiveModal(null)}
        studioInfo={studioInfo}
        onBookVisit={() => setActiveModal('booking')}
      />

      {/* Secret Keyboard-Only Admin CMS Modal */}
      <SecretAdminModal
        isOpen={activeModal === 'secret-admin'}
        onClose={() => setActiveModal(null)}
        cmsState={cmsState}
        onUpdateCmsState={handleUpdateCmsState}
      />
    </div>
  );
}
