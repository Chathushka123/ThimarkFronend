import API from '../../../api/API';

const getData = async (path, params = {}) => {
  const response = await API.get(path, { params });
  return response.data;
};

// Procurement
export const getProcurementSummary = (params) => getData('/dashboard/procurement/summary', params);
export const getProcurementOrders = (params) => getData('/dashboard/procurement/orders', params);

// Inventory
export const getInventorySummary = (params) => getData('/dashboard/inventory/summary', params);

// Consumption
export const getConsumptionSummary = (params) => getData('/dashboard/consumption/summary', params);

// GRN
export const getGrnSummary = (params) => getData('/dashboard/grn/summary', params);

// Payments
export const getPaymentsSummary = (params) => getData('/dashboard/payments/summary', params);
