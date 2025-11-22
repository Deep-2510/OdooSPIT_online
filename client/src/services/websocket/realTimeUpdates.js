// services/websocket/realTimeUpdates.js
import { webSocketService } from './websocketService';

class RealTimeUpdateService {
  constructor() {
    this.stockUpdateCallbacks = new Set();
    this.lowStockCallbacks = new Set();
    this.systemAlertCallbacks = new Set();
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    webSocketService.onMessage('STOCK_UPDATE', (data) => {
      this.stockUpdateCallbacks.forEach(callback => callback(data));
    });

    webSocketService.onMessage('LOW_STOCK_ALERT', (data) => {
      this.lowStockCallbacks.forEach(callback => callback(data));
    });

    webSocketService.onMessage('SYSTEM_ALERT', (data) => {
      this.systemAlertCallbacks.forEach(callback => callback(data));
    });

    this.initialized = true;
  }

  // Stock updates
  onStockUpdate(callback) {
    this.stockUpdateCallbacks.add(callback);
    return () => this.stockUpdateCallbacks.delete(callback);
  }

  // Low stock alerts
  onLowStockAlert(callback) {
    this.lowStockCallbacks.add(callback);
    return () => this.lowStockCallbacks.delete(callback);
  }

  // System alerts
  onSystemAlert(callback) {
    this.systemAlertCallbacks.add(callback);
    return () => this.systemAlertCallbacks.delete(callback);
  }

  // Subscribe to specific product updates
  subscribeToProduct(productId) {
    webSocketService.subscribe('product', productId);
  }

  // Subscribe to warehouse updates
  subscribeToWarehouse(warehouseId) {
    webSocketService.subscribe('warehouse', warehouseId);
  }

  // Subscribe to low stock alerts
  subscribeToLowStockAlerts() {
    webSocketService.subscribe('alerts', 'low-stock');
  }

  // Unsubscribe from updates
  unsubscribeFromProduct(productId) {
    webSocketService.unsubscribe('product', productId);
  }

  unsubscribeFromWarehouse(warehouseId) {
    webSocketService.unsubscribe('warehouse', warehouseId);
  }

  // Request manual refresh
  requestStockRefresh() {
    webSocketService.send({
      action: 'REFRESH',
      entityType: 'stock',
    });
  }

  // Cleanup
  destroy() {
    this.stockUpdateCallbacks.clear();
    this.lowStockCallbacks.clear();
    this.systemAlertCallbacks.clear();
    this.initialized = false;
  }
}

export const realTimeUpdateService = new RealTimeUpdateService();