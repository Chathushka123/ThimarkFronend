import API from '../../../api/API';

// All dashboard endpoints return { success, data, meta }.
// Extract the inner `data` payload; fall back gracefully for old-style responses.
const get = async (path, params = {}) => {
  const response = await API.get(path, { params });
  const body = response.data;
  return (body && typeof body === 'object' && 'success' in body) ? body.data : body;
};

// ── PO ──────────────────────────────────────────────────────────────
export const getPOSummary = (params) => get('/purchase-orders/active-summary', params);

// Filtered summary — statuses[] array + date_field + from + to
export const getFilteredPOSummary = ({ statuses = [], dateField, from, to } = {}) => {
  const qs = new URLSearchParams();
  statuses.forEach((s) => qs.append('statuses[]', s));
  if (dateField) qs.set('date_field', dateField);
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  return get(`/purchase-orders/filtered-summary?${qs.toString()}`);
};

// ── Procurement ──────────────────────────────────────────────────────────────
export const getProcurementSummary = (params) => get('/dashboard/procurement/summary', params);
export const getProcurementOrders = (params) => get('/dashboard/procurement/orders', params);

// ── Inventory ────────────────────────────────────────────────────────────────
export const getInventorySummary = (params) => get('/dashboard/inventory/summary', params);
export const getInventoryLowStock = (params) => get('/dashboard/inventory/low-stock', params);
export const getInventoryItems = (params) => get('/dashboard/inventory/items', params);

// ── Consumption ──────────────────────────────────────────────────────────────
export const getConsumptionSummary = (params) => get('/dashboard/consumption/summary', params);
export const getConsumptionByBatch = (params) => get('/dashboard/consumption/by-batch', params);
export const getConsumptionByMaterial = (params) => get('/dashboard/consumption/by-material', params);

// ── GRN ──────────────────────────────────────────────────────────────────────
export const getGrnSummary = (params) => get('/dashboard/grn/summary', params);
export const getGrnList = (params) => get('/dashboard/grn/list', params);
export const getGrnBySupplier = (params) => get('/dashboard/grn/by-supplier', params);

// ── Payments ─────────────────────────────────────────────────────────────────
export const getPaymentsSummary = (params) => get('/dashboard/payments/summary', params);
export const getPaymentsList = (params) => get('/dashboard/payments/list', params);
export const getPaymentsTrend = (params) => get('/dashboard/payments/trend', params);

