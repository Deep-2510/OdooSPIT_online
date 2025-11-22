// client/src/contexts/AppContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { productAPI } from '../services/api/products';
import { warehouseAPI } from '../services/api/warehouses';
import { supplierAPI } from '../services/api/suppliers';

const AppContext = createContext();

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_WAREHOUSES: 'SET_WAREHOUSES',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_SUPPLIERS: 'SET_SUPPLIERS',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_ERROR: 'SET_ERROR',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_WAREHOUSE: 'UPDATE_WAREHOUSE',
  REFRESH_DATA: 'REFRESH_DATA',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case ACTION_TYPES.SET_WAREHOUSES:
      return {
        ...state,
        warehouses: action.payload,
        warehousesLoaded: true,
      };
    
    case ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        productsLoaded: true,
      };
    
    case ACTION_TYPES.SET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
        suppliersLoaded: true,
      };
    
    case ACTION_TYPES.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload,
        dashboardLoaded: true,
      };
    
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    
    case ACTION_TYPES.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
      };
    
    case ACTION_TYPES.UPDATE_WAREHOUSE:
      return {
        ...state,
        warehouses: state.warehouses.map(warehouse =>
          warehouse._id === action.payload._id ? action.payload : warehouse
        ),
      };
    
    case ACTION_TYPES.REFRESH_DATA:
      return {
        ...state,
        productsLoaded: false,
        warehousesLoaded: false,
        suppliersLoaded: false,
        dashboardLoaded: false,
      };
    
    default:
      return state;
  }
};

const initialState = {
  // Data
  products: [],
  warehouses: [],
  suppliers: [],
  dashboardData: null,
  
  // Loading states
  loading: false,
  productsLoaded: false,
  warehousesLoaded: false,
  suppliersLoaded: false,
  dashboardLoaded: false,
  
  // Error state
  error: null,
  
  // Refresh trigger
  refreshTrigger: 0,
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (loading) => 
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    
    setWarehouses: (warehouses) => 
      dispatch({ type: ACTION_TYPES.SET_WAREHOUSES, payload: warehouses }),
    
    setProducts: (products) => 
      dispatch({ type: ACTION_TYPES.SET_PRODUCTS, payload: products }),
    
    setSuppliers: (suppliers) => 
      dispatch({ type: ACTION_TYPES.SET_SUPPLIERS, payload: suppliers }),
    
    setDashboardData: (data) => 
      dispatch({ type: ACTION_TYPES.SET_DASHBOARD_DATA, payload: data }),
    
    setError: (error) => 
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    
    updateProduct: (product) => 
      dispatch({ type: ACTION_TYPES.UPDATE_PRODUCT, payload: product }),
    
    updateWarehouse: (warehouse) => 
      dispatch({ type: ACTION_TYPES.UPDATE_WAREHOUSE, payload: warehouse }),
    
    refreshData: () => 
      dispatch({ type: ACTION_TYPES.REFRESH_DATA }),
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        actions.setLoading(true);
        
        const [productsRes, warehousesRes, suppliersRes] = await Promise.all([
          productAPI.getProducts({ limit: 1000 }),
          warehouseAPI.getWarehouses(),
          supplierAPI.getSuppliers(),
        ]);
        
        actions.setProducts(productsRes.data);
        actions.setWarehouses(warehousesRes.data);
        actions.setSuppliers(suppliersRes.data);
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
        actions.setError('Failed to load application data');
      } finally {
        actions.setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Refresh data when trigger changes
  useEffect(() => {
    if (state.refreshTrigger > 0) {
      actions.refreshData();
      // Reload data here if needed
    }
  }, [state.refreshTrigger]);

  const value = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Helper functions
    getProductById: (id) => state.products.find(product => product._id === id),
    getWarehouseById: (id) => state.warehouses.find(warehouse => warehouse._id === id),
    getSupplierById: (id) => state.suppliers.find(supplier => supplier._id === id),
    
    // Refresh function
    refreshAllData: () => {
      dispatch({ type: ACTION_TYPES.REFRESH_DATA });
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};