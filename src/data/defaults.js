import { generateId } from '../core/utils.js'

// ─── Option Lists ──────────────────────────────────────────────────────────────

export const INDUSTRY_OPTIONS = [
  { value: 'cooking-oil',   label: '🫙 Cooking Oil / Edible Oil' },
  { value: 'fmcg',          label: '🛒 FMCG / Consumer Goods' },
  { value: 'food-beverage', label: '🍱 Food & Beverage' },
  { value: 'chemical',      label: '⚗️  Chemical / Industrial' },
  { value: 'pharma',        label: '💊 Pharmaceutical' },
  { value: 'agri',          label: '🌾 Agriculture / Agri-products' },
  { value: 'retail',        label: '🏪 Retail / Distribution' },
  { value: 'other',         label: '📦 Other' },
]

export const COUNTRY_OPTIONS = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'VN', label: '🇻🇳 Vietnam' },
  { value: 'CN', label: '🇨🇳 China' },
  { value: 'ID', label: '🇮🇩 Indonesia' },
  { value: 'MY', label: '🇲🇾 Malaysia' },
  { value: 'TH', label: '🇹🇭 Thailand' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'SG', label: '🇸🇬 Singapore' },
  { value: 'KR', label: '🇰🇷 South Korea' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'other', label: '🌍 Other' },
]

export const TRANSPORT_MODES = [
  { value: 'truck-light',  label: '🚐 Light Truck (<5 ton)' },
  { value: 'truck-medium', label: '🚛 Medium Truck (5–15 ton)' },
  { value: 'truck-heavy',  label: '🚚 Heavy Truck / Semi (>15 ton)' },
  { value: 'truck-tanker', label: '🛢️  Tanker Truck' },
  { value: 'rail',         label: '🚂 Rail / Train' },
  { value: 'ship',         label: '🚢 Ocean Vessel / Container Ship' },
  { value: 'air',          label: '✈️  Air Freight' },
  { value: 'multimodal',   label: '🔁 Multimodal' },
]

export const PACK_TYPES = [
  { value: 'bottle',     label: '🍶 Bottle' },
  { value: 'can',        label: '🥫 Can / Jerry Can' },
  { value: 'drum',       label: '🪣 Drum (200L)' },
  { value: 'flexitank',  label: '💧 Flexitank / ISO Tank' },
  { value: 'bag',        label: '🛍️  Bag / Sack' },
  { value: 'box',        label: '📦 Carton Box' },
  { value: 'pallet',     label: '🏗️  Pallet' },
  { value: 'bulk',       label: '⚪ Bulk (no packaging)' },
]

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'VND', symbol: '₫',  name: 'Vietnamese Dong' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
]

export const DISTRIBUTION_CHANNELS = [
  { value: 'wholesale',     label: 'Wholesale / Distributors' },
  { value: 'retail-chain',  label: 'Retail Chains (Walmart, Carrefour...)' },
  { value: 'ecommerce',     label: 'E-commerce (Amazon, Shopee...)' },
  { value: 'export',        label: 'Export / International' },
  { value: 'food-service',  label: 'Food Service / Restaurants' },
  { value: 'industrial',    label: 'Industrial / B2B Direct' },
]

export const NODE_TYPES = [
  { value: 'factory',   label: '🏭 Factory / Production Plant', icon: '🏭', color: '#2563EB' },
  { value: 'warehouse', label: '🏢 Warehouse / Distribution Center', icon: '🏢', color: '#8B5CF6' },
  { value: 'dc',        label: '📦 Distribution Hub (DC)', icon: '📦', color: '#F59E0B' },
  { value: 'port',      label: '⚓ Port / Terminal', icon: '⚓', color: '#06B6D4' },
  { value: 'customer',  label: '🏪 Customer / Delivery Point', icon: '🏪', color: '#059669' },
]

export const CARRIER_TYPES = [
  { value: 'in-house', label: 'In-house Fleet' },
  { value: '3pl',      label: '3PL (Third-party Carrier)' },
  { value: 'mixed',    label: 'Mixed (In-house + 3PL)' },
]

export const FREQUENCY_UNITS = [
  { value: 'per-day',   label: 'per day' },
  { value: 'per-week',  label: 'per week' },
  { value: 'per-month', label: 'per month' },
]

export const WEIGHT_UNITS = [
  { value: 'ton', label: 'Metric Ton' },
  { value: 'kg',  label: 'Kilogram' },
  { value: 'lb',  label: 'Pound' },
]

export const DISTANCE_UNITS = [
  { value: 'km', label: 'Kilometer (km)' },
  { value: 'mi', label: 'Mile (mi)' },
]

// ─── Default cost categories template ────────────────────────────────────────

export const DEFAULT_COST_CATEGORIES = [
  // Transportation
  { id: 'c01', group: 'transportation', name: 'Fuel (diesel, gas)',          enabled: true,  monthlyCost: 0 },
  { id: 'c02', group: 'transportation', name: 'Driver & crew wages',         enabled: true,  monthlyCost: 0 },
  { id: 'c03', group: 'transportation', name: 'Tolls & road fees',           enabled: true,  monthlyCost: 0 },
  { id: 'c04', group: 'transportation', name: 'Vehicle depreciation / lease',enabled: true,  monthlyCost: 0 },
  { id: 'c05', group: 'transportation', name: 'Vehicle insurance & maintenance', enabled: true, monthlyCost: 0 },
  { id: 'c06', group: 'transportation', name: '3PL carrier fees',            enabled: false, monthlyCost: 0 },
  // Warehousing
  { id: 'c07', group: 'warehousing',    name: 'Warehouse rent / depreciation',enabled: true, monthlyCost: 0 },
  { id: 'c08', group: 'warehousing',    name: 'Utilities (electricity, water)',enabled: true, monthlyCost: 0 },
  { id: 'c09', group: 'warehousing',    name: 'Warehouse staff wages',       enabled: true,  monthlyCost: 0 },
  { id: 'c10', group: 'warehousing',    name: 'Equipment (forklift, racks)', enabled: false, monthlyCost: 0 },
  // Handling
  { id: 'c11', group: 'handling',       name: 'Loading & unloading',         enabled: true,  monthlyCost: 0 },
  { id: 'c12', group: 'handling',       name: 'Palletizing & wrapping',      enabled: false, monthlyCost: 0 },
  { id: 'c13', group: 'handling',       name: 'Labeling & quality check',    enabled: false, monthlyCost: 0 },
  // Loss
  { id: 'c14', group: 'loss',           name: 'Transit damage & claims',     enabled: true,  monthlyCost: 0 },
  { id: 'c15', group: 'loss',           name: 'Returns & reverse logistics', enabled: false, monthlyCost: 0 },
  { id: 'c16', group: 'loss',           name: 'Expired goods disposal',      enabled: false, monthlyCost: 0 },
  { id: 'c17', group: 'loss',           name: 'Cargo insurance',             enabled: true,  monthlyCost: 0 },
  // Admin
  { id: 'c18', group: 'admin',          name: 'Logistics management staff',  enabled: true,  monthlyCost: 0 },
  { id: 'c19', group: 'admin',          name: 'TMS / logistics software',    enabled: false, monthlyCost: 0 },
  { id: 'c20', group: 'admin',          name: 'Customs & documentation',     enabled: false, monthlyCost: 0 },
]

export const COST_GROUP_META = {
  transportation: { label: '🚗 Transportation',  color: 'var(--chart-transport)' },
  warehousing:    { label: '🏢 Warehousing',     color: 'var(--chart-warehouse)' },
  handling:       { label: '📦 Handling',         color: 'var(--chart-handling)'  },
  loss:           { label: '📉 Loss & Damage',    color: 'var(--chart-loss)'      },
  admin:          { label: '📋 Administration',   color: 'var(--chart-admin)'     },
}

// ─── Industry benchmarks ─────────────────────────────────────────────────────

export const INDUSTRY_BENCHMARKS = {
  logisticsAsPercentRevenue: { min: 8, avg: 12, max: 18 },
  costByGroupPercent: {
    transportation: 45,
    warehousing: 22,
    handling: 14,
    loss: 10,
    admin: 9,
  }
}

// ─── Demo config (Cooking Oil in USA) ─────────────────────────────────────────

export const DEFAULT_CONFIG = {
  company: {
    name: 'GoldenHarvest Foods',
    industry: 'cooking-oil',
    country: 'US',
    scale: 'medium',
    annualRevenue: 50000000,
    employeeCount: 220,
    channels: ['wholesale', 'retail-chain', 'export'],
    coverageArea: 'national',
  },

  products: [
    { id: 'p1', name: 'Soybean Oil 1L Bottle',     weight: 0.92, unit: 'kg', packType: 'bottle',    pricePerUnit: 3.50 },
    { id: 'p2', name: 'Sunflower Oil 5L Can',       weight: 4.60, unit: 'kg', packType: 'can',       pricePerUnit: 12.00 },
    { id: 'p3', name: 'Canola Oil 18L Food Service',weight: 16.5, unit: 'kg', packType: 'can',       pricePerUnit: 28.00 },
    { id: 'p4', name: 'Crude Palm Oil Flexitank',   weight: 22000,unit: 'kg', packType: 'flexitank', pricePerUnit: 18000 },
  ],

  nodes: [
    {
      id: 'n1', name: 'Houston Main Factory', type: 'factory',
      address: 'Houston, TX', lat: 29.76, lng: -95.37,
    },
    {
      id: 'n2', name: 'East Coast DC', type: 'warehouse',
      address: 'Newark, NJ', lat: 40.71, lng: -74.01,
      area: 8000, areaUnit: 'sqft', monthlyRent: 18000, climateControlled: false, avgDwellDays: 7,
    },
    {
      id: 'n3', name: 'West Coast DC', type: 'warehouse',
      address: 'City of Industry, CA', lat: 34.02, lng: -117.96,
      area: 6000, areaUnit: 'sqft', monthlyRent: 14000, climateControlled: false, avgDwellDays: 5,
    },
    {
      id: 'n4', name: 'Southeast Distribution', type: 'customer',
      address: 'Atlanta, GA', lat: 33.75, lng: -84.39,
    },
    {
      id: 'n5', name: 'Midwest Distribution', type: 'customer',
      address: 'Chicago, IL', lat: 41.88, lng: -87.63,
    },
  ],

  routes: [
    {
      id: 'r1', fromId: 'n1', toId: 'n2',
      distance: 2580, distanceUnit: 'km',
      transportMode: 'truck-heavy', carrier: 'in-house',
      frequency: 12, frequencyUnit: 'per-month',
      costPerTrip: 4500, volumePerTrip: 22, volumeUnit: 'ton',
    },
    {
      id: 'r2', fromId: 'n1', toId: 'n3',
      distance: 2490, distanceUnit: 'km',
      transportMode: 'truck-heavy', carrier: 'in-house',
      frequency: 10, frequencyUnit: 'per-month',
      costPerTrip: 4200, volumePerTrip: 22, volumeUnit: 'ton',
    },
    {
      id: 'r3', fromId: 'n2', toId: 'n4',
      distance: 1350, distanceUnit: 'km',
      transportMode: 'truck-medium', carrier: '3pl',
      frequency: 25, frequencyUnit: 'per-month',
      costPerTrip: 1800, volumePerTrip: 10, volumeUnit: 'ton',
    },
    {
      id: 'r4', fromId: 'n3', toId: 'n5',
      distance: 2800, distanceUnit: 'km',
      transportMode: 'truck-medium', carrier: '3pl',
      frequency: 20, frequencyUnit: 'per-month',
      costPerTrip: 2600, volumePerTrip: 10, volumeUnit: 'ton',
    },
  ],

  costCategories: [
    { id: 'c01', group: 'transportation', name: 'Fuel (diesel, gas)',              enabled: true,  monthlyCost: 45000 },
    { id: 'c02', group: 'transportation', name: 'Driver & crew wages',             enabled: true,  monthlyCost: 32000 },
    { id: 'c03', group: 'transportation', name: 'Tolls & road fees',               enabled: true,  monthlyCost: 8000  },
    { id: 'c04', group: 'transportation', name: 'Vehicle depreciation / lease',    enabled: true,  monthlyCost: 12000 },
    { id: 'c05', group: 'transportation', name: 'Vehicle insurance & maintenance', enabled: true,  monthlyCost: 6000  },
    { id: 'c06', group: 'transportation', name: '3PL carrier fees',                enabled: true,  monthlyCost: 84000 },
    { id: 'c07', group: 'warehousing',    name: 'Warehouse rent / depreciation',   enabled: true,  monthlyCost: 32000 },
    { id: 'c08', group: 'warehousing',    name: 'Utilities (electricity, water)',  enabled: true,  monthlyCost: 5000  },
    { id: 'c09', group: 'warehousing',    name: 'Warehouse staff wages',           enabled: true,  monthlyCost: 18000 },
    { id: 'c10', group: 'warehousing',    name: 'Equipment (forklift, racks)',     enabled: true,  monthlyCost: 3500  },
    { id: 'c11', group: 'handling',       name: 'Loading & unloading',             enabled: true,  monthlyCost: 9000  },
    { id: 'c12', group: 'handling',       name: 'Palletizing & wrapping',          enabled: true,  monthlyCost: 4500  },
    { id: 'c13', group: 'handling',       name: 'Labeling & quality check',        enabled: true,  monthlyCost: 3000  },
    { id: 'c14', group: 'loss',           name: 'Transit damage & claims',         enabled: true,  monthlyCost: 5500  },
    { id: 'c15', group: 'loss',           name: 'Returns & reverse logistics',     enabled: true,  monthlyCost: 3000  },
    { id: 'c16', group: 'loss',           name: 'Expired goods disposal',          enabled: false, monthlyCost: 0     },
    { id: 'c17', group: 'loss',           name: 'Cargo insurance',                 enabled: true,  monthlyCost: 4500  },
    { id: 'c18', group: 'admin',          name: 'Logistics management staff',      enabled: true,  monthlyCost: 14000 },
    { id: 'c19', group: 'admin',          name: 'TMS / logistics software',        enabled: false, monthlyCost: 0     },
    { id: 'c20', group: 'admin',          name: 'Customs & documentation',         enabled: false, monthlyCost: 0     },
  ],

  costData: { monthly: [] }, // Will be generated by calculator

  scenarios: [],

  preferences: {
    currency: 'USD',
    currencySymbol: '$',
    weightUnit: 'ton',
    distanceUnit: 'km',
    language: 'en',
    logo: null,
    dashboardTitle: 'Logistics Cost Dashboard',
  }
}
