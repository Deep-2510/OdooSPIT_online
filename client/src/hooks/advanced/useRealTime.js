// hooks/advanced/useRealTime.js
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useNotification } from '../../contexts/NotificationContext';

export const useRealTime = (entityType, filters = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/inventory`,
    {
      onMessage: (message) => {
        switch (message.type) {
          case 'STOCK_UPDATE':
            handleStockUpdate(message.data);
            break;
          case 'LOW_STOCK_ALERT':
            showNotification(
              `Low stock alert: ${message.data.productName}`,
              'warning'
            );
            break;
          case 'OUT_OF_STOCK':
            showNotification(
              `Out of stock: ${message.data.productName}`,
              'error'
            );
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      },
    }
  );

  const handleStockUpdate = (update) => {
    setData(prevData => {
      const index = prevData.findIndex(item => item._id === update._id);
      if (index !== -1) {
        const newData = [...prevData];
        newData[index] = { ...newData[index], ...update };
        return newData;
      }
      return [update, ...prevData];
    });
  };

  const subscribeToUpdates = (entityId) => {
    if (isConnected) {
      sendMessage({
        action: 'SUBSCRIBE',
        entityType,
        entityId,
        filters,
      });
    }
  };

  const unsubscribeFromUpdates = (entityId) => {
    if (isConnected) {
      sendMessage({
        action: 'UNSUBSCRIBE',
        entityType,
        entityId,
      });
    }
  };

  const requestDataRefresh = () => {
    if (isConnected) {
      sendMessage({
        action: 'REFRESH',
        entityType,
        filters,
      });
    }
  };

  return {
    data,
    isLoading,
    isConnected,
    lastMessage,
    subscribeToUpdates,
    unsubscribeFromUpdates,
    requestDataRefresh,
  };
};