export type ServiceCategory = 'todos' | 'ppf' | 'ploteos' | 'detailing' | 'polarizados' | 'academia';
export type VehicleType = 'auto' | 'suv' | 'moto' | 'nautica';
export type PortfolioCategory = 'todos' | 'ppf' | 'ploteos' | 'detailing' | 'motos_nautica';

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  bentoTitle: string;
  bentoSubtext: string;
  category: Exclude<ServiceCategory, 'todos'>;
  categoryLabel: string;
  shortDesc: string;
  duration: string;
  warranty: string;
  basePriceUsd: number;
  specs: string[];
  bentoSpan: 'large' | 'square' | 'wide';
  imagePosition: string;
  customImageUrl?: string;
  featured?: boolean;
}

export interface PortfolioItem {
  id: string;
  vehicle: string;
  treatment: string;
  category: Exclude<PortfolioCategory, 'todos'>;
  categoryLabel: string;
  brandMaterial: string;
  durationHours: number;
  imageUrl: string;
  objectPosition: string;
  summary: string;
}

export interface StudioScheduleRow {
  days: string;
  hours: string;
}

export interface StudioInfoData {
  brandLogoText: string;
  name: string;
  subtitle: string;
  heroHeadline: string;
  heroSubtitle: string;
  trustBannerText: string;
  phoneDisplay: string;
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappDirectUrl: string;
  googleMapsUrl: string;
  addressLine: string;
  neighborhood: string;
  schedule: StudioScheduleRow[];
  logoPath: string;
  fallbackLogoUrl: string;
  fallbackHeroUrl: string;
  portfolioGridAsset: string;
  profileHeaderAsset: string;
}

export type VehicleMultiplierMap = Record<
  VehicleType,
  { label: string; shortLabel: string; multiplier: number }
>;

export interface StudioCmsState {
  studioInfo: StudioInfoData;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  vehicleMultipliers: VehicleMultiplierMap;
}

export interface BookingFormInput {
  clientName: string;
  vehicleModel: string;
  vehicleType: VehicleType;
  serviceId: string;
  preferredShift: 'manana' | 'tarde' | 'sabado';
  notes?: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: {
    clientName?: string;
    vehicleModel?: string;
    serviceId?: string;
  };
}

export const STUDIO_INFO: StudioInfoData = {
  brandLogoText: 'MW // STUDIO',
  name: 'MONTEVIDEO WRAPPING',
  subtitle: 'Detail Studio | PPF, Polarizados y Ploteos',
  heroHeadline: 'PROTECCIÓN Y ESTÉTICA AL MÁS ALTO NIVEL.',
  heroSubtitle: 'Especialistas en PPF, Polarizados y Tratamientos Gyeon en Montevideo.',
  trustBannerText: 'Instaladores Oficiales: GYEON Quartz | AlloyGator',
  phoneDisplay: '092 488 728',
  whatsappNumber: '59892488728',
  instagramHandle: '@montevideowrapping',
  instagramUrl: 'https://www.instagram.com/montevideowrapping/',
  tiktokUrl: 'https://www.tiktok.com/@montevideowrapping',
  whatsappDirectUrl:
    'https://wa.me/59892488728?text=Hola%20Montevideo%20Wrapping%2C%20quiero%20cotizar%20un%20tratamiento%20para%20mi%20veh%C3%ADculo.',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Montevideo+Wrapping+Detail+Studio+Montevideo+Uruguay',
  addressLine: 'Montevideo, Uruguay · Cabina Climatizada con Túnel de Inspección LED',
  neighborhood: 'Zona Centro / Cordón Sur · Recepción Privada con Seguridad 24h',
  schedule: [
    { days: 'Lunes a Viernes', hours: '09:00 – 18:30 hs' },
    { days: 'Sábados', hours: '09:00 – 14:00 hs' },
  ],
  logoPath: '/assets/aistudio/image_0ded5524.png',
  fallbackLogoUrl: 'https://placehold.co/150x150/111111/FFFFFF?text=MW',
  fallbackHeroUrl: 'https://placehold.co/1080x1920/111111/FFFFFF?text=Luxury+Car+Wrap',
  portfolioGridAsset: '/assets/aistudio/_8189D1DE-17F7-4462-866C-39D895D95C4A__87d0340a.png',
  profileHeaderAsset: '/assets/aistudio/_CC265BD9-2DCD-494D-8B86-6F9DDCCB7447__9d02baec.png',
};

export const VEHICLE_TYPE_LABELS: VehicleMultiplierMap = {
  auto: { label: 'Auto / Coupé / Sedán', shortLabel: 'Auto / Coupé', multiplier: 1.0 },
  suv: { label: 'SUV / Pick-Up / Camioneta', shortLabel: 'SUV / Pick-Up', multiplier: 1.2 },
  moto: { label: 'Moto Alta Cilindrada', shortLabel: 'Moto', multiplier: 0.6 },
  nautica: { label: 'Lancha / Embarcación', shortLabel: 'Náutica', multiplier: 1.4 },
};

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'ppf-front',
    code: '01',
    title: 'Paint Protection Film (PPF)',
    bentoTitle: 'Paint Protection Film (PPF)',
    bentoSubtext: 'Blindaje invisible autorregenerativo de 200 micras contra impactos de ruta y rayones.',
    category: 'ppf',
    categoryLabel: 'PPF Protección',
    shortDesc: 'Film de poliuretano termoplástico (TPU) con memoria elástica por calor, hidrofobia extrema y acabado espejo o Satin Stealth.',
    duration: '2 a 5 días',
    warranty: '10 años de garantía',
    basePriceUsd: 950,
    specs: [
      'Capot entero sin costuras, paragolpes, ópticas y guardabarros',
      'Opción Full Body Gloss o conversión Satin Stealth',
      'Autorregeneración térmica de micro-rayas y protección UV',
    ],
    bentoSpan: 'large',
    imagePosition: '50% 6%',
    featured: true,
  },
  {
    id: 'gyeon-ceramic',
    code: '02',
    title: 'Detailing & Cerámicos',
    bentoTitle: 'Detailing & Cerámicos',
    bentoSubtext: 'Brillo extremo',
    category: 'detailing',
    categoryLabel: 'Gyeon Quartz Certified',
    shortDesc: 'Corrección de barniz multietapa para eliminar el 90%+ de swirls y sellado cerámico Gyeon Quartz de dureza 9H.',
    duration: '2 a 3 días',
    warranty: '3 a 5 años de protección',
    basePriceUsd: 480,
    specs: [
      'Descontaminado férrico y corrección de laca espejo',
      'Sellado cerámico certificado Gyeon Quartz (Mohs EVO / Infinite)',
      'Sellado de llantas, calipers y cristales incluido',
    ],
    bentoSpan: 'square',
    imagePosition: '1% 6%',
    featured: true,
  },
  {
    id: 'wrap-full',
    code: '03',
    title: 'Car Wrapping',
    bentoTitle: 'Car Wrapping',
    bentoSubtext: 'Cambio de color premium',
    category: 'ploteos',
    categoryLabel: 'Ploteo Vehicular',
    shortDesc: 'Transformación estética integral con vinilos fundidos de alta gama (Alltak, 3M, Avery Dennison) totalmente reversible.',
    duration: '4 a 5 días',
    warranty: '5 años de garantía',
    basePriceUsd: 1350,
    specs: [
      'Más de 120 tonos: Satinados, Metálicos, Gloss y Especiales',
      'Desarme seguro y terminación tipo pintura en bordes e interiores',
      'Sellado superior con Gyeon HALO específico para vinilos',
    ],
    bentoSpan: 'square',
    imagePosition: '25.5% 6%',
    featured: true,
  },
  {
    id: 'polarizado-nano',
    code: '04',
    title: 'Polarizados Nanocerámicos & AlloyGator',
    bentoTitle: 'Polarizados Nanocerámicos & AlloyGator',
    bentoSubtext: 'Rechazo térmico infrarrojo del 85% y protección oficial de llantas contra cordoneos.',
    category: 'polarizados',
    categoryLabel: 'Control Solar & Llantas',
    shortDesc: 'Láminas nanocerámicas de alta visibilidad nocturna combinadas con anillos protectores de llantas AlloyGator.',
    duration: '4 a 6 horas',
    warranty: 'Garantía extendida',
    basePriceUsd: 240,
    specs: [
      'Filtro UV 99.9% y reducción real de temperatura en habitáculo',
      'Opción de lámina antivandálica de seguridad',
      'Instalación oficial AlloyGator Uruguay (rodados 12" a 24")',
    ],
    bentoSpan: 'wide',
    imagePosition: '74.5% 6%',
  },
  {
    id: 'curso-ppf',
    code: '05',
    title: 'Academia MW: Instalador Profesional de PPF',
    bentoTitle: 'Academia MW: Instalador de PPF',
    bentoSubtext: 'Formación intensiva práctica en cabina',
    category: 'academia',
    categoryLabel: 'Academia MW',
    shortDesc: 'Capacitación personalizada dictada por Gonza en nuestro estudio sobre vehículos reales de alta gama.',
    duration: '3 jornadas intensivas',
    warranty: 'Certificado Oficial MW',
    basePriceUsd: 650,
    specs: [
      'Técnicas de estiramiento, anclaje, corte seguro y uso de software',
      'Práctica intensiva sobre paneles complejos y paragolpes',
      'Asesoramiento de negocio, costos, insumos y proveedores',
    ],
    bentoSpan: 'square',
    imagePosition: '100% 56%',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'ferrari-f355',
    vehicle: 'Ferrari F355 Berlinetta',
    treatment: 'Corrección de Laca Histórica + PPF Full Front',
    category: 'ppf',
    categoryLabel: 'PPF & Detailing',
    brandMaterial: 'Gyeon Quartz + PPF Gloss',
    durationHours: 48,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '1% 6%',
    summary: 'Restauración de brillo espejo sobre Rosso Corsa clásico y blindaje transparente frontal.',
  },
  {
    id: 'bmw-m4-gold',
    vehicle: 'BMW M4 Coupé Competition',
    treatment: 'Car Wrapping Olive Gold + Sellado Gyeon HALO',
    category: 'ploteos',
    categoryLabel: 'Car Wrapping',
    brandMaterial: 'Vinilo Cast + Gyeon HALO',
    durationHours: 42,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '25.5% 6%',
    summary: 'Cambio de color completo con acabado profundo y protección cerámica específica para vinilos.',
  },
  {
    id: 'audi-etron-gt',
    vehicle: 'Audi e-tron GT quattro',
    treatment: 'PPF Full Body + Polarizado Nanocerámico',
    category: 'ppf',
    categoryLabel: 'PPF Full Body',
    brandMaterial: 'TPU Self-Healing 200 micras',
    durationHours: 54,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '50% 6%',
    summary: 'Protección integral de carrocería eléctrica de alto desempeño y rechazo térmico en cabina.',
  },
  {
    id: 'ev-stealth-black',
    vehicle: 'Coupé Eléctrico Satin Black',
    treatment: 'Conversión Satin Stealth PPF + Chrome Delete',
    category: 'ploteos',
    categoryLabel: 'Satin Stealth',
    brandMaterial: 'PPF Matte Stealth',
    durationHours: 50,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '74.5% 6%',
    summary: 'Transformación de pintura brillante original a negro satinado sedoso con protección anti-impactos.',
  },
  {
    id: 'mercedes-glc',
    vehicle: 'Mercedes-Benz GLC Coupé',
    treatment: 'Tratamiento Cerámico Gyeon + Detailing Interior',
    category: 'detailing',
    categoryLabel: 'Detailing Gyeon',
    brandMaterial: 'Gyeon Q² Mohs EVO',
    durationHours: 28,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '1% 56%',
    summary: 'Descontaminado profundo, abrillantado multietapa y recubrimiento fluoro-modificado.',
  },
  {
    id: 'superbike-alltak',
    vehicle: 'Superbike Pista #28 Alltak',
    treatment: 'Diseño Racing Personalizado & Ploteo Turquesa',
    category: 'motos_nautica',
    categoryLabel: 'Motos & Náutica',
    brandMaterial: 'Alltak Tuning + PPF Tanque',
    durationHours: 24,
    imageUrl: STUDIO_INFO.portfolioGridAsset,
    objectPosition: '50% 56%',
    summary: 'Ploteo de carenado completo con gráficas de competición y protección de tanque.',
  },
];

export const ADMIN_PASSWORD = 'wrapping';
export const CMS_STORAGE_KEY = 'mw_studio_cms_v1';

export function verifyAdminPassword(input: string): boolean {
  return input.trim().toLowerCase() === ADMIN_PASSWORD;
}

export function getDefaultCmsState(): StudioCmsState {
  return {
    studioInfo: { ...STUDIO_INFO, schedule: STUDIO_INFO.schedule.map((s) => ({ ...s })) },
    services: SERVICES_CATALOG.map((s) => ({ ...s, specs: [...s.specs] })),
    portfolio: PORTFOLIO_ITEMS.map((p) => ({ ...p })),
    vehicleMultipliers: {
      auto: { ...VEHICLE_TYPE_LABELS.auto },
      suv: { ...VEHICLE_TYPE_LABELS.suv },
      moto: { ...VEHICLE_TYPE_LABELS.moto },
      nautica: { ...VEHICLE_TYPE_LABELS.nautica },
    },
  };
}

export function loadCmsState(): StudioCmsState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getDefaultCmsState();
  }
  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return getDefaultCmsState();
    const parsed = JSON.parse(raw) as Partial<StudioCmsState>;
    const defaults = getDefaultCmsState();
    return {
      studioInfo: { ...defaults.studioInfo, ...(parsed.studioInfo ?? {}) },
      services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : defaults.services,
      portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : defaults.portfolio,
      vehicleMultipliers: { ...defaults.vehicleMultipliers, ...(parsed.vehicleMultipliers ?? {}) },
    };
  } catch {
    return getDefaultCmsState();
  }
}

export function saveCmsState(state: StudioCmsState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function upsertServiceItem(services: ServiceItem[], item: ServiceItem): ServiceItem[] {
  const exists = services.some((s) => s.id === item.id);
  if (exists) {
    return services.map((s) => (s.id === item.id ? item : s));
  }
  return [...services, item];
}

export function removeServiceItem(services: ServiceItem[], serviceId: string): ServiceItem[] {
  return services.filter((s) => s.id !== serviceId);
}

export function upsertPortfolioItem(items: PortfolioItem[], item: PortfolioItem): PortfolioItem[] {
  const exists = items.some((p) => p.id === item.id);
  if (exists) {
    return items.map((p) => (p.id === item.id ? item : p));
  }
  return [item, ...items];
}

export function removePortfolioItem(items: PortfolioItem[], itemId: string): PortfolioItem[] {
  return items.filter((p) => p.id !== itemId);
}

export function filterServicesByCategory(
  services: ServiceItem[],
  category: ServiceCategory
): ServiceItem[] {
  if (category === 'todos') {
    return services;
  }
  return services.filter((item) => item.category === category);
}

export function filterPortfolioByCategory(
  items: PortfolioItem[],
  category: PortfolioCategory
): PortfolioItem[] {
  if (category === 'todos') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function calculateEstimatedQuote(
  serviceId: string,
  vehicleType: VehicleType,
  catalog: ServiceItem[] = SERVICES_CATALOG,
  multipliers: VehicleMultiplierMap = VEHICLE_TYPE_LABELS
): { service: ServiceItem; estimatedUsd: number; vehicleLabel: string } | null {
  const service = catalog.find((s) => s.id === serviceId);
  if (!service) return null;

  const vehicleMeta = multipliers[vehicleType] ?? multipliers.auto;
  const multiplier = service.category === 'academia' ? 1.0 : vehicleMeta.multiplier;
  const estimatedUsd = Math.round((service.basePriceUsd * multiplier) / 10) * 10;

  return {
    service,
    estimatedUsd,
    vehicleLabel: vehicleMeta.label,
  };
}

export function validateBookingRequest(
  input: BookingFormInput,
  catalog: ServiceItem[] = SERVICES_CATALOG
): BookingValidationResult {
  const errors: BookingValidationResult['errors'] = {};

  if (!input.clientName || input.clientName.trim().length < 2) {
    errors.clientName = 'Ingresá tu nombre para generar la cotización.';
  }
  if (!input.vehicleModel || input.vehicleModel.trim().length < 2) {
    errors.vehicleModel = 'Indicá marca y modelo del vehículo.';
  }
  if (!input.serviceId || !catalog.some((s) => s.id === input.serviceId)) {
    errors.serviceId = 'Seleccioná un tratamiento válido.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppBookingUrl(
  input: BookingFormInput,
  catalog: ServiceItem[] = SERVICES_CATALOG,
  multipliers: VehicleMultiplierMap = VEHICLE_TYPE_LABELS,
  whatsappNumber: string = STUDIO_INFO.whatsappNumber
): string {
  const quote = calculateEstimatedQuote(input.serviceId, input.vehicleType, catalog, multipliers);
  const serviceTitle = quote ? quote.service.title : 'Tratamiento Especializado';
  const vehicleCategory = multipliers[input.vehicleType]?.label ?? 'Vehículo';

  const shiftLabels: Record<BookingFormInput['preferredShift'], string> = {
    manana: 'Mañana (09:00 - 13:00 hs)',
    tarde: 'Tarde (14:00 - 18:30 hs)',
    sabado: 'Sábado (09:00 - 14:00 hs)',
  };

  const lines = [
    `Hola *Montevideo Wrapping*! Quiero cotizar / agendar un vehículo:`,
    `• *Cliente:* ${input.clientName.trim()}`,
    `• *Vehículo:* ${input.vehicleModel.trim()} (${vehicleCategory})`,
    `• *Tratamiento:* ${serviceTitle}`,
    `• *Preferencia horaria:* ${shiftLabels[input.preferredShift]}`,
  ];

  if (input.notes && input.notes.trim().length > 0) {
    lines.push(`• *Detalles:* ${input.notes.trim()}`);
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  const cleanPhone = whatsappNumber.replace(/\D/g, '') || STUDIO_INFO.whatsappNumber;
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
