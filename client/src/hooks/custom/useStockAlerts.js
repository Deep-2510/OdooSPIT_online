// hooks/custom/useStockAlerts.js
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../advanced/useWebSocket';
import { useNotification } from '../../contexts/NotificationContext';
import { productAPI } from '../../services/api/products';

export const useStockAlerts = (options = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const { isConnected, lastMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/alerts`,
    {
      onMessage: (message) => {
        handleAlertMessage(message);
      },
    }
  );

  const handleAlertMessage = useCallback((message) => {
    switch (message.type) {
      case 'LOW_STOCK':
        const lowStockAlert = {
          id: `low-stock-${Date.now()}`,
          type: 'low_stock',
          severity: 'warning',
          title: 'Low Stock Alert',
          message: `Product ${message.data.productName} is running low on stock`,
          productId: message.data.productId,
          currentStock: message.data.currentStock,
          reorderLevel: message.data.reorderLevel,
          timestamp: new Date(),
        };
        
        setAlerts(prev => [lowStockAlert, ...prev.slice(0, 49)]); // Keep last 50 alerts
        showNotification(lowStockAlert.message, 'warning');
        break;

      case 'OUT_OF_STOCK':
        const outOfStockAlert = {
          id: `out-of-stock-${Date.now()}`,
          type: 'out_of_stock',
          severity: 'error',
          title: 'Out of Stock Alert',
          message: `Product ${message.data.productName} is out of stock`,
          productId: message.data.productId,
          timestamp: new Date(),
        };
        
        setAlerts(prev => [outOfStockAlert, ...prev.slice(0, 49)]);
        showNotification(outOfStockAlert.message, 'error');
        break;

      case 'EXPIRING_STOCK':
        const expiringAlert = {
          id: `expiring-${Date.now()}`,
          type: 'expiring',
          severity: 'info',
          title: 'Expiring Stock Alert',
          message: `Product ${message.data.productName} will expire soon`,
          productId: message.data.productId,
          expiryDate: message.data.expiryDate,
          timestamp: new Date(),
        };
        
        setAlerts(prev => [expiringAlert, ...prev.slice(0, 49)]);
        showNotification(expiringAlert.message, 'info');
        break;

      default:
        console.log('Unknown alert type:', message.type);
    }
  }, [showNotification]);

  const loadInitialAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productAPI.getLowStockItems();
      const lowStockAlerts = response.data.map(product => ({
        id: `low-stock-${product._id}`,
        type: 'low_stock',
        severity: 'warning',
        title: 'Low Stock',
        message: `${product.name} (${product.sku}) - Current: ${product.currentStock}, Reorder: ${product.reorderLevel}`,
        productId: product._id,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        timestamp: new Date(),
      }));

      setAlerts(lowStockAlerts);
    } catch (error) {
      console.error('Failed to load initial alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const dismissAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getAlertCount = useCallback((type = null) => {
    if (type) {
      return alerts.filter(alert => alert.type === type).length;
    }
    return alerts.length;
  }, [alerts]);

  useEffect(() => {
    if (options.loadInitial) {
      loadInitialAlerts();
    }
  }, [options.loadInitial, loadInitialAlerts]);

  return {
    alerts,
    loading,
    isConnected,
    dismissAlert,
    dismissAllAlerts,
    getAlertCount,
    refreshAlerts: loadInitialAlerts,
  };
};