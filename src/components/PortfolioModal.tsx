import React, { useState } from 'react';
import { X, ArrowUpRight, Calendar, Eye } from 'lucide-react';
import {
  PORTFOLIO_ITEMS,
  STUDIO_INFO,
  PortfolioCategory,
  PortfolioItem,
  StudioInfoData,
  filterPortfolioByCategory,
} from '../utils/studioData';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteSimilar: () => void;
  portfolioItems?: PortfolioItem[];
  studioInfo?: StudioInfoData;
}

const PORTFOLIO_TABS: { id: PortfolioCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ppf', label: 'PPF' },
  { id: 'ploteos', label: 'Ploteos' },
  { id: 'detailing', label: 'Detailing Gyeon' },
  { id: 'motos_nautica', label: 'Motos & Náutica' },
];

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onQuoteSimilar,
  portfolioItems = PORTFOLIO_ITEMS,
  studioInfo = STUDIO_INFO,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('todos');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [showFullFeedImage, setShowFullFeedImage] = useState(false);

  if (!isOpen) return null;

  const filteredItems = filterPortfolioByCategory(portfolioItems, selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
    >
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="portfolio-modal-title" className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Portafolio
            </h2>
            <p className="text-xs text-neutral-400">
              Trabajos reales realizados en nuestro estudio · {studioInfo.instagramHandle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar portafolio"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter & View Toggle */}
        <div className="px-5 pt-3.5 pb-3 border-b border-white/5 bg-black/40 space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PORTFOLIO_TABS.map((tab) => {
              const active = selectedCategory === tab.id && !showFullFeedImage;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setShowFullFeedImage(false);
                    setActiveItem(null);
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setShowFullFeedImage(!showFullFeedImage);
                setActiveItem(null);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                showFullFeedImage
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Mosaico Completo</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {showFullFeedImage ? (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={studioInfo.portfolioGridAsset}
                  alt="Mosaico de trabajos realizados por Montevideo Wrapping"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-xs text-neutral-400 text-center">
                Galería oficial de trabajos en cabina climatizada de Montevideo Wrapping.
              </p>
            </div>
          ) : activeItem ? (
            <div className="p-4 rounded-2xl bg-black border border-white/15 space-y-3.5">
              <div
                role="img"
                aria-label={activeItem.vehicle}
                style={{
                  backgroundImage: `url(${activeItem.imageUrl})`,
                  backgroundSize: '515% 270%',
                  backgroundPosition: activeItem.objectPosition,
                }}
                className="relative h-52 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 bg-no-repeat"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] text-neutral-300">
                    {activeItem.categoryLabel} · {activeItem.durationHours} hs de cabina
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                    {activeItem.vehicle}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-white font-medium">{activeItem.treatment}</p>
                <p className="text-neutral-400 leading-relaxed">{activeItem.summary}</p>
                <div className="pt-2 border-t border-white/10 text-neutral-400 flex items-center justify-between">
                  <span>Material empleado:</span>
                  <span className="text-white font-medium">{activeItem.brandMaterial}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
                >
                  Volver a la grilla
                </button>
                <button
                  type="button"
                  onClick={onQuoteSimilar}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cotizar similar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="w-full text-left p-3.5 rounded-2xl bg-black border border-white/10 hover:border-white/30 transition-all flex items-center gap-3.5 group cursor-pointer"
                >
                  <div
                    aria-hidden="true"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: '515% 270%',
                      backgroundPosition: item.objectPosition,
                    }}
                    className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 bg-no-repeat"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-neutral-400 truncate">
                      <span>{item.categoryLabel}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.brandMaterial}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate mt-0.5">{item.vehicle}</h3>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{item.treatment}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Instagram & Booking Footer Actions */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={onQuoteSimilar}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Turno para mi Vehículo</span>
            </button>

            <a
              href={studioInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver trabajos en Instagram ({studioInfo.instagramHandle})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
