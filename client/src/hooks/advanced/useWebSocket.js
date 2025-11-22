// hooks/advanced/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../useAuth';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const { user } = useAuth();

  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
  } = options;

  const connect = useCallback(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const wsUrl = `${url}?token=${token}`;
    
    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = (event) => {
        setIsConnected(true);
        console.log('WebSocket connected');
        onOpen?.(event);
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        onClose?.(event);
        
        // Attempt to reconnect
        if (reconnectTimeout.current === null) {
          reconnectTimeout.current = setTimeout(() => {
            reconnectTimeout.current = null;
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          setMessageHistory(prev => [...prev.slice(-99), message]); // Keep last 100 messages
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url, user, onMessage, onOpen, onClose, onError, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
      }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [isConnected]);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    messageHistory,
    sendMessage,
    reconnect,
    disconnect,
  };
};