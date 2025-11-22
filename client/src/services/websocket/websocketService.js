// services/websocket/websocketService.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('token');
        const wsUrl = `${url}?token=${token}`;
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.resubscribeAll();
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket disconnected:', event);
          this.handleReconnection(url);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  handleReconnection(url) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(url);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      
      // Call specific handlers for message type
      if (this.messageHandlers.has(message.type)) {
        this.messageHandlers.get(message.type).forEach(handler => {
          handler(message.data);
        });
      }

      // Call general handlers
      if (this.messageHandlers.has('*')) {
        this.messageHandlers.get('*').forEach(handler => {
          handler(message);
        });
      }

    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  subscribe(entityType, entityId, filters = {}) {
    const subscriptionKey = `${entityType}:${entityId}`;
    
    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, { entityType, entityId, filters });
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({
          action: 'SUBSCRIBE',
          entityType,
          entityId,
          filters,
        });
      }
    }
  }

  unsubscribe(entityType, entityId) {
    const subscriptionKey = `${entityType}:${entityId}`;
    
    if (this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.delete(subscriptionKey);
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({
          action: 'UNSUBSCRIBE',
          entityType,
          entityId,
        });
      }
    }
  }

  resubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      this.send({
        action: 'SUBSCRIBE',
        ...subscription,
      });
    });
  }

  onMessage(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType).add(handler);
  }

  offMessage(messageType, handler) {
    if (this.messageHandlers.has(messageType)) {
      this.messageHandlers.get(messageType).delete(handler);
    }
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
      }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscriptions.clear();
    this.messageHandlers.clear();
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();