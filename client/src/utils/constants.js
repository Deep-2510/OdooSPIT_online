// client/src/utils/constants.js
// Application constants and configuration

export const APP_CONFIG = {
  NAME: 'Inventory Management System',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@inventory.com',
  COMPANY_NAME: 'Inventory Corp',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: '/products',
  WAREHOUSES: '/warehouses',
  SUPPLIERS: '/suppliers',
  RECEIPTS: '/receipts',
  DELIVERIES: '/deliveries',
  TRANSFERS: '/transfers',
  ADJUSTMENTS: '/adjustments',
  STOCK: '/stock',
  REPORTS: '/reports',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  INVENTORY_MANAGER: 'inventory_manager',
  WAREHOUSE_STAFF: 'warehouse_staff',
  VIEWER: 'viewer',
};

export const PRODUCT_CATEGORIES = [
  'Raw Material',
  'Finished Goods',
  'Consumables',
  'Spare Parts',
  'Packaging',
  'Electronics',
  'Furniture',
  'Tools',
  'Clothing',
  'Food & Beverage',
  'Pharmaceutical',
  'Chemicals',
  'Other',
];

export const UNIT_OF_MEASURE = [
  'units',
  'kg',
  'g',
  'lb',
  'oz',
  'liters',
  'ml',
  'gallons',
  'meters',
  'cm',
  'feet',
  'boxes',
  'pallets',
  'cartons',
  'bundles',
  'pairs',
];

export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_TRANSIT: 'in_transit',
  RECEIVED: 'received',
};

export const STOCK_MOVEMENT_TYPES = {
  INWARD: 'inward',
  OUTWARD: 'outward',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
};

export const ADJUSTMENT_TYPES = {
  PHYSICAL_COUNT: 'physical_count',
  DAMAGE: 'damage',
  LOSS: 'loss',
  THEFT: 'theft',
  EXPIRY: 'expiry',
  CORRECTION: 'correction',
  OTHER: 'other',
};

export const TRANSFER_REASONS = {
  STOCK_REBALANCING: 'stock_rebalancing',
  PRODUCTION: 'production',
  SALES: 'sales',
  CONSIGNMENT: 'consignment',
  QUALITY_ISSUE: 'quality_issue',
  OVERSTOCK: 'overstock',
  OTHER: 'other',
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZES: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 1000,
};

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
};

export const STOCK_ALERT_LEVELS = {
  NORMAL: 'normal',
  LOW: 'low',
  CRITICAL: 'critical',
  OUT_OF_STOCK: 'out_of_stock',
};

export const COLOR_PALETTE = {
  PRIMARY: '#2563eb',
  SECONDARY: '#7c3aed',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  ERROR: '#dc2626',
  INFO: '#0369a1',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  TABLE_SETTINGS: 'table_settings',
};

export const WEBSOCKET_EVENTS = {
  STOCK_UPDATE: 'STOCK_UPDATE',
  LOW_STOCK_ALERT: 'LOW_STOCK_ALERT',
  OUT_OF_STOCK_ALERT: 'OUT_OF_STOCK_ALERT',
  DOCUMENT_STATUS_CHANGE: 'DOCUMENT_STATUS_CHANGE',
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
};