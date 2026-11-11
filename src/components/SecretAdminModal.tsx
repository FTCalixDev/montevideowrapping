import React, { useState } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  Car,
  Sparkles,
  MapPin,
  Sliders,
} from 'lucide-react';
import {
  StudioCmsState,
  ServiceItem,
  PortfolioItem,
  ServiceCategory,
  PortfolioCategory,
  VehicleType,
  verifyAdminPassword,
  upsertServiceItem,
  removeServiceItem,
  upsertPortfolioItem,
  removePortfolioItem,
  getDefaultCmsState,
} from '../utils/studioData';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsState: StudioCmsState;
  onUpdateCmsState: (nextState: StudioCmsState) => void;
}

type AdminTab = 'services' | 'portfolio' | 'studio' | 'multipliers';

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  cmsState,
  onUpdateCmsState,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Service Editor State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [specsText, setSpecsText] = useState('');

  // Portfolio Vehicle Editor State
  const [editingVehicle, setEditingVehicle] = useState<PortfolioItem | null>(null);

  if (!isOpen) return null;

  const notifySaved = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Contraseña incorrecta. Acceso exclusivo con clave autorizada.');
    }
  };

  const handleStartNewService = () => {
    const nextCode = String(cmsState.services.length + 1).padStart(2, '0');
    const draft: ServiceItem = {
      id: `service-${Date.now()}`,
      code: nextCode,
      title: '',
      bentoTitle: '',
      bentoSubtext: '',
      category: 'ppf',
      categoryLabel: 'PPF Protección',
      shortDesc: '',
      duration: '2 a 3 días',
      warranty: '5 años de garantía',
      basePriceUsd: 500,
      specs: ['Inspección luminosa en cabina LED', 'Material certificado internacionalmente'],
      bentoSpan: 'square',
      imagePosition: '50% 6%',
    };
    setEditingService(draft);
    setSpecsText(draft.specs.join('\n'));
  };

  const handleStartEditService = (service: ServiceItem) => {
    setEditingService({ ...service, specs: [...service.specs] });
    setSpecsText(service.specs.join('\n'));
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;

    const cleanSpecs = specsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalService: ServiceItem = {
      ...editingService,
      title: editingService.title.trim(),
      bentoTitle: editingService.bentoTitle.trim() || editingService.title.trim(),
      bentoSubtext: editingService.bentoSubtext.trim() || editingService.categoryLabel,
      specs: cleanSpecs.length > 0 ? cleanSpecs : ['Tratamiento certificado Montevideo Wrapping'],
    };

    const nextServices = upsertServiceItem(cmsState.services, finalService);
    onUpdateCmsState({
      ...cmsState,
      services: nextServices,
    });
    setEditingService(null);
    notifySaved(`Servicio "${finalService.title}" guardado correctamente.`);
  };

  const handleDeleteService = (id: string, title: string) => {
    const nextServices = removeServiceItem(cmsState.services, id);
    onUpdateCmsState({
      ...cmsState,
      services: nextServices,
    });
    if (editingService?.id === id) setEditingService(null);
    notifySaved(`Servicio "${title}" eliminado.`);
  };

  const handleStartNewVehicle = () => {
    const draft: PortfolioItem = {
      id: `vehicle-${Date.now()}`,
      vehicle: '',
      treatment: '',
      category: 'ppf',
      categoryLabel: 'PPF & Detailing',
      brandMaterial: 'Gyeon Quartz + PPF Gloss',
      durationHours: 36,
      imageUrl: cmsState.studioInfo.portfolioGridAsset,
      objectPosition: '50% 6%',
      summary: '',
    };
    setEditingVehicle(draft);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !editingVehicle.vehicle.trim() || !editingVehicle.treatment.trim()) return;

    const finalVehicle: PortfolioItem = {
      ...editingVehicle,
      vehicle: editingVehicle.vehicle.trim(),
      treatment: editingVehicle.treatment.trim(),
      summary:
        editingVehicle.summary.trim() ||
        'Trabajo realizado en cabina climatizada de Montevideo Wrapping.',
    };

    const nextPortfolio = upsertPortfolioItem(cmsState.portfolio, finalVehicle);
    onUpdateCmsState({
      ...cmsState,
      portfolio: nextPortfolio,
    });
    setEditingVehicle(null);
    notifySaved(`Vehículo "${finalVehicle.vehicle}" guardado en el portafolio.`);
  };

  const handleDeleteVehicle = (id: string, vehicleName: string) => {
    const nextPortfolio = removePortfolioItem(cmsState.portfolio, id);
    onUpdateCmsState({
      ...cmsState,
      portfolio: nextPortfolio,
    });
    if (editingVehicle?.id === id) setEditingVehicle(null);
    notifySaved(`Vehículo "${vehicleName}" eliminado del portafolio.`);
  };

  const handleResetDefaults = () => {
    const defaults = getDefaultCmsState();
    onUpdateCmsState(defaults);
    setEditingService(null);
    setEditingVehicle(null);
    notifySaved('Datos originales de fábrica restaurados.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-admin-title"
    >
      {!isAuthenticated ? (
        /* PASSWORD GATE MODAL */
        <div className="w-full max-w-md rounded-3xl bg-[#0B0B0B] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="secret-admin-title"
                  className="font-display text-xl font-bold uppercase tracking-wider text-white"
                >
                  Acceso Restringido MW Studio
                </h2>
                <p className="text-xs text-neutral-400">Panel oculto de administración y precios</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar acceso de administrador"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-medium text-neutral-300 mb-1.5"
              >
                Contraseña de Administrador
              </label>
              <input
                id="admin-password-input"
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Ingresá la contraseña..."
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
              />
              {passwordError && <p className="mt-1.5 text-xs text-red-400">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Desbloquear Panel
            </button>
          </form>
        </div>
      ) : (
        /* UNLOCKED FULL ADMIN CMS PANEL */
        <div className="w-full max-w-5xl bg-[#0B0B0B] border border-white/15 rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Top Header */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/60">
            <div>
              <h2
                id="secret-admin-title"
                className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
              >
                Panel de Control · Montevideo Wrapping
              </h2>
              <p className="text-xs text-neutral-400">
                Todos los cambios se aplican en tiempo real sobre la página y el cotizador
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Originales</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar panel de control"
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Listo / Cerrar</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Servicios y Precios ({cmsState.services.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Vehículos / Portafolio ({cmsState.portfolio.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('studio')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Ubicación, Contacto y Textos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('multipliers')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'multipliers'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Multiplicadores por Porte</span>
              </button>
            </div>

            {statusBanner && (
              <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white font-medium whitespace-nowrap">
                {statusBanner}
              </div>
            )}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: SERVICIOS Y PRECIOS */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Catálogo de Servicios y Precios Base
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Añadí nuevos tratamientos, modificá precios en USD o eliminá servicios
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartNewService}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Servicio</span>
                  </button>
                </div>

                {/* Service Editor Form */}
                {editingService && (
                  <form
                    onSubmit={handleSaveService}
                    className="p-5 rounded-2xl bg-black border border-white/25 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="font-display text-lg font-bold uppercase text-white">
                        {cmsState.services.some((s) => s.id === editingService.id)
                          ? `Editar Servicio: ${editingService.title}`
                          : 'Nuevo Servicio'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="admin-service-title"
                          className="block text-xs text-neutral-300 mb-1"
                        >
                          Nombre del Servicio *
                        </label>
                        <input
                          id="admin-service-title"
                          type="text"
                          required
                          value={editingService.title}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              title: e.target.value,
                              bentoTitle: e.target.value,
                            })
                          }
                          placeholder="Ej: PPF Full Body Satin Stealth"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="admin-service-price"
                          className="block text-xs text-neutral-300 mb-1"
                        >
                          Precio Base (USD) *
                        </label>
                        <input
                          id="admin-service-price"
                          type="number"
                          min={0}
                          required
                          value={editingService.basePriceUsd}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              basePriceUsd: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label
                          htmlFor="admin-service-cat"
                          className="block text-xs text-neutral-300 mb-1"
                        >
                          Categoría
                        </label>
                        <select
                          id="admin-service-cat"
                          value={editingService.category}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              category: e.target.value as Exclude<ServiceCategory, 'todos'>,
                            })
                          }
                          className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        >
                          <option value="ppf">PPF</option>
                          <option value="ploteos">Ploteos / Wrapping</option>
                          <option value="detailing">Detailing & Cerámicos</option>
                          <option value="polarizados">Polarizados & Llantas</option>
                          <option value="academia">Academia MW</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          Subtítulo / Etiqueta
                        </label>
                        <input
                          type="text"
                          value={editingService.bentoSubtext}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              bentoSubtext: e.target.value,
                              categoryLabel: e.target.value,
                            })
                          }
                          placeholder="Ej: Brillo extremo"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Duración</label>
                        <input
                          type="text"
                          value={editingService.duration}
                          onChange={(e) =>
                            setEditingService({ ...editingService, duration: e.target.value })
                          }
                          placeholder="Ej: 2 a 3 días"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Garantía</label>
                        <input
                          type="text"
                          value={editingService.warranty}
                          onChange={(e) =>
                            setEditingService({ ...editingService, warranty: e.target.value })
                          }
                          placeholder="Ej: 10 años de garantía"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Descripción del Servicio
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.shortDesc}
                        onChange={(e) =>
                          setEditingService({ ...editingService, shortDesc: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Puntos Técnicos / Incluye (1 por línea)
                      </label>
                      <textarea
                        rows={3}
                        value={specsText}
                        onChange={(e) => setSpecsText(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="min-h-[42px] px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                      >
                        Guardar Servicio
                      </button>
                    </div>
                  </form>
                )}

                {/* Services Table / List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {cmsState.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-2xl bg-black border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] text-neutral-400">
                              {srv.categoryLabel} · {srv.duration} · {srv.warranty}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-0.5">
                              {srv.title}
                            </h4>
                          </div>
                          <span className="font-display text-lg font-bold text-white tabular-nums shrink-0">
                            USD {srv.basePriceUsd}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2">
                          {srv.shortDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleStartEditService(srv)}
                          aria-label={`Editar servicio ${srv.title}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white hover:text-black text-xs font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id, srv.title)}
                          aria-label={`Eliminar servicio ${srv.title}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-xs font-medium text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: VEHÍCULOS DEL PORTAFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Unidades y Vehículos del Portafolio
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Añadí nuevos proyectos realizados en cabina, editá fichas o eliminá vehículos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartNewVehicle}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Vehículo</span>
                  </button>
                </div>

                {editingVehicle && (
                  <form
                    onSubmit={handleSaveVehicle}
                    className="p-5 rounded-2xl bg-black border border-white/25 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="font-display text-lg font-bold uppercase text-white">
                        {cmsState.portfolio.some((p) => p.id === editingVehicle.id)
                          ? `Editar Vehículo: ${editingVehicle.vehicle}`
                          : 'Añadir Nuevo Vehículo al Portafolio'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingVehicle(null)}
                        className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="admin-vehicle-name"
                          className="block text-xs text-neutral-300 mb-1"
                        >
                          Vehículo (Marca y Modelo) *
                        </label>
                        <input
                          id="admin-vehicle-name"
                          type="text"
                          required
                          value={editingVehicle.vehicle}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, vehicle: e.target.value })
                          }
                          placeholder="Ej: Porsche 911 GT3 RS"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="admin-vehicle-treatment"
                          className="block text-xs text-neutral-300 mb-1"
                        >
                          Tratamiento Realizado *
                        </label>
                        <input
                          id="admin-vehicle-treatment"
                          type="text"
                          required
                          value={editingVehicle.treatment}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, treatment: e.target.value })
                          }
                          placeholder="Ej: PPF Full Body + Cerámico Gyeon"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Categoría</label>
                        <select
                          value={editingVehicle.category}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              category: e.target.value as Exclude<PortfolioCategory, 'todos'>,
                            })
                          }
                          className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        >
                          <option value="ppf">PPF</option>
                          <option value="ploteos">Car Wrapping</option>
                          <option value="detailing">Detailing Gyeon</option>
                          <option value="motos_nautica">Motos & Náutica</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          Material / Marca Aplicada
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.brandMaterial}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, brandMaterial: e.target.value })
                          }
                          placeholder="Ej: TPU 200μm + Gyeon Mohs"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          Horas de Cabina
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={editingVehicle.durationHours}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              durationHours: Number(e.target.value) || 24,
                            })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white tabular-nums"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Resumen del Proyecto
                      </label>
                      <textarea
                        rows={2}
                        value={editingVehicle.summary}
                        onChange={(e) =>
                          setEditingVehicle({ ...editingVehicle, summary: e.target.value })
                        }
                        placeholder="Descripción técnica del trabajo realizado..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingVehicle(null)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="min-h-[42px] px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                      >
                        Guardar Vehículo
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {cmsState.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-black border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>
                            {item.categoryLabel} · {item.brandMaterial}
                          </span>
                          <span className="tabular-nums">{item.durationHours} hs</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">{item.vehicle}</h4>
                        <p className="text-xs text-neutral-300 mt-0.5">{item.treatment}</p>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.summary}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditingVehicle({ ...item })}
                          aria-label={`Editar vehículo ${item.vehicle}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white hover:text-black text-xs font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(item.id, item.vehicle)}
                          aria-label={`Eliminar vehículo ${item.vehicle}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-xs font-medium text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: UBICACIÓN, CONTACTO Y TEXTOS DEL ESTUDIO */}
            {activeTab === 'studio' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Datos del Estudio, Ubicación, WhatsApp y Textos Principales
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Modificá dirección, teléfono de WhatsApp, horarios, titular Hero y banner de marcas
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="admin-studio-brand"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Texto Logo Navbar
                    </label>
                    <input
                      id="admin-studio-brand"
                      type="text"
                      value={cmsState.studioInfo.brandLogoText}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, brandLogoText: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-studio-phone"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Teléfono Visible (Display)
                    </label>
                    <input
                      id="admin-studio-phone"
                      type="text"
                      value={cmsState.studioInfo.phoneDisplay}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, phoneDisplay: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-studio-wa"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Número Internacional WhatsApp (sin +)
                    </label>
                    <input
                      id="admin-studio-wa"
                      type="text"
                      value={cmsState.studioInfo.whatsappNumber}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-studio-trust"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Banner de Marcas Oficiales
                    </label>
                    <input
                      id="admin-studio-trust"
                      type="text"
                      value={cmsState.studioInfo.trustBannerText}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, trustBannerText: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="admin-studio-headline"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Titular Principal (Hero Headline)
                    </label>
                    <input
                      id="admin-studio-headline"
                      type="text"
                      value={cmsState.studioInfo.heroHeadline}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, heroHeadline: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-studio-subtitle"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Subtítulo Hero
                    </label>
                    <input
                      id="admin-studio-subtitle"
                      type="text"
                      value={cmsState.studioInfo.heroSubtitle}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, heroSubtitle: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="admin-studio-address"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Dirección / Línea Principal de Ubicación
                    </label>
                    <input
                      id="admin-studio-address"
                      type="text"
                      value={cmsState.studioInfo.addressLine}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, addressLine: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-studio-zone"
                      className="block text-xs text-neutral-300 mb-1"
                    >
                      Zona / Detalle de Seguridad
                    </label>
                    <input
                      id="admin-studio-zone"
                      type="text"
                      value={cmsState.studioInfo.neighborhood}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, neighborhood: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      Enlace de Google Maps
                    </label>
                    <input
                      type="url"
                      value={cmsState.studioInfo.googleMapsUrl}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, googleMapsUrl: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      Usuario de Instagram
                    </label>
                    <input
                      type="text"
                      value={cmsState.studioInfo.instagramHandle}
                      onChange={(e) =>
                        onUpdateCmsState({
                          ...cmsState,
                          studioInfo: { ...cmsState.studioInfo, instagramHandle: e.target.value },
                        })
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-black border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MULTIPLICADORES POR PORTE */}
            {activeTab === 'multipliers' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Portes de Vehículo y Multiplicadores de Precio
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Ajustá el factor por el cual se multiplican los precios base según el tamaño del vehículo
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(cmsState.vehicleMultipliers) as VehicleType[]).map((vKey) => {
                    const item = cmsState.vehicleMultipliers[vKey];
                    return (
                      <div
                        key={vKey}
                        className="p-4 rounded-2xl bg-black border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-neutral-400">
                            Categoría: {vKey}
                          </span>
                          <span className="text-xs font-mono text-white tabular-nums">
                            x{item.multiplier}
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            Etiqueta Completa
                          </label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) =>
                              onUpdateCmsState({
                                ...cmsState,
                                vehicleMultipliers: {
                                  ...cmsState.vehicleMultipliers,
                                  [vKey]: { ...item, label: e.target.value },
                                },
                              })
                            }
                            className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#111111] border border-white/15 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            Multiplicador de Precio (Ej: 1.0 = 100%, 1.2 = +20%)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            min="0.1"
                            value={item.multiplier}
                            onChange={(e) =>
                              onUpdateCmsState({
                                ...cmsState,
                                vehicleMultipliers: {
                                  ...cmsState.vehicleMultipliers,
                                  [vKey]: {
                                    ...item,
                                    multiplier: Number(e.target.value) || 1.0,
                                  },
                                },
                              })
                            }
                            className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#111111] border border-white/15 text-sm text-white tabular-nums"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
