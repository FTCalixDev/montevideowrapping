import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVICES_CATALOG,
  PORTFOLIO_ITEMS,
  STUDIO_INFO,
  verifyAdminPassword,
  upsertServiceItem,
  removeServiceItem,
  upsertPortfolioItem,
  removePortfolioItem,
  filterServicesByCategory,
  filterPortfolioByCategory,
  calculateEstimatedQuote,
  validateBookingRequest,
  buildWhatsAppBookingUrl,
} from './studioData';

test('verifyAdminPassword only accepts wrapping password', () => {
  assert.equal(verifyAdminPassword('wrapping'), true);
  assert.equal(verifyAdminPassword('  WRAPPING '), true);
  assert.equal(verifyAdminPassword('admin123'), false);
  assert.equal(verifyAdminPassword(''), false);
});

test('upsertServiceItem and removeServiceItem add, update, and delete services accurately', () => {
  const initial = [...SERVICES_CATALOG];
  const newService = {
    ...initial[0],
    id: 'custom-ppf-matte',
    title: 'PPF Matte Full Stealth',
    basePriceUsd: 3100,
  };

  const withAdded = upsertServiceItem(initial, newService);
  assert.equal(withAdded.length, initial.length + 1);
  assert.ok(withAdded.some((s) => s.id === 'custom-ppf-matte'));

  const updatedService = { ...newService, basePriceUsd: 3300 };
  const withUpdated = upsertServiceItem(withAdded, updatedService);
  assert.equal(withUpdated.length, initial.length + 1);
  assert.equal(withUpdated.find((s) => s.id === 'custom-ppf-matte')?.basePriceUsd, 3300);

  const withRemoved = removeServiceItem(withUpdated, 'custom-ppf-matte');
  assert.equal(withRemoved.length, initial.length);
  assert.equal(withRemoved.some((s) => s.id === 'custom-ppf-matte'), false);
});

test('upsertPortfolioItem and removePortfolioItem manage portfolio vehicles accurately', () => {
  const initial = [...PORTFOLIO_ITEMS];
  const newVehicle = {
    ...initial[0],
    id: 'porsche-911-gt3',
    vehicle: 'Porsche 911 GT3 RS',
    treatment: 'PPF Full Body Track Pack',
  };

  const added = upsertPortfolioItem(initial, newVehicle);
  assert.equal(added.length, initial.length + 1);
  assert.equal(added[0].id, 'porsche-911-gt3');

  const removed = removePortfolioItem(added, 'porsche-911-gt3');
  assert.equal(removed.length, initial.length);
});

test('STUDIO_INFO contains required landing page copy and brand identifiers', () => {
  assert.equal(STUDIO_INFO.brandLogoText, 'MW // STUDIO');
  assert.equal(STUDIO_INFO.heroHeadline, 'PROTECCIÓN Y ESTÉTICA AL MÁS ALTO NIVEL.');
  assert.equal(
    STUDIO_INFO.heroSubtitle,
    'Especialistas en PPF, Polarizados y Tratamientos Gyeon en Montevideo.'
  );
  assert.equal(STUDIO_INFO.trustBannerText, 'Instaladores Oficiales: GYEON Quartz | AlloyGator');
});

test('filterServicesByCategory and filterPortfolioByCategory filter items properly', () => {
  const all = filterServicesByCategory(SERVICES_CATALOG, 'todos');
  assert.equal(all.length, SERVICES_CATALOG.length);

  const ploteos = filterPortfolioByCategory(PORTFOLIO_ITEMS, 'ploteos');
  assert.ok(ploteos.length >= 1);
  assert.ok(ploteos.every((p) => p.category === 'ploteos'));
});

test('calculateEstimatedQuote scales base price by vehicle type multiplier', () => {
  const autoQuote = calculateEstimatedQuote('ppf-front', 'auto');
  const suvQuote = calculateEstimatedQuote('ppf-front', 'suv');
  assert.ok(autoQuote);
  assert.ok(suvQuote);
  assert.equal(autoQuote.estimatedUsd, 950);
  assert.equal(suvQuote.estimatedUsd, 1140);
});

test('validateBookingRequest and buildWhatsAppBookingUrl validate and encode properly', () => {
  const valid = validateBookingRequest({
    clientName: 'Martín Rodríguez',
    vehicleModel: 'BMW M4 Competition',
    vehicleType: 'auto',
    serviceId: 'ppf-front',
    preferredShift: 'manana',
  });
  assert.equal(valid.valid, true);

  const url = buildWhatsAppBookingUrl({
    clientName: 'Gonzalo',
    vehicleModel: 'Ferrari F355',
    vehicleType: 'auto',
    serviceId: 'ppf-front',
    preferredShift: 'tarde',
  });
  assert.ok(url.startsWith('https://wa.me/59892488728?text='));
});
