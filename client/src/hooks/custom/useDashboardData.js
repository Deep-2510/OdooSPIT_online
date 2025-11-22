// hooks/custom/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../advanced/useWebSocket';
import { dashboardAPI } from '../../services/api/dashboard';

export const useDashboardData = (autoRefresh = true) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { isConnected, lastMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/dashboard`,
    {
      onMessage: (message) => {
        if (message.type === 'DASHBOARD_UPDATE') {
          setDashboardData(prev => ({
            ...prev,
            ...message.data,
          }));
          setLastUpdated(new Date());
        }
      },
    }
  );

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryResponse, movementResponse, operationsResponse] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getStockMovement({ limit: 50 }),
        dashboardAPI.getOperationsSummary(),
      ]);

      const data = {
        summary: summaryResponse.data,
        recentMovements: movementResponse.data,
        operations: operationsResponse.data,
        lastUpdated: new Date(),
      };

      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh data
  useEffect(() => {
    loadDashboardData();

    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadDashboardData]);

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'STOCK_UPDATE') {
      // Update dashboard data in real-time
      setDashboardData(prev => {
        if (!prev) return prev;

        const updatedSummary = { ...prev.summary };
        
        // Update total value if cost price changed
        if (lastMessage.data.costPrice) {
          // Recalculate total value (simplified)
          updatedSummary.totalValue = prev.summary.totalValue + 
            (lastMessage.data.quantity * lastMessage.data.costPrice);
        }

        // Add to recent movements
        const newMovement = {
          _id: `realtime-${Date.now()}`,
          product: lastMessage.data.product,
          movementType: lastMessage.data.movementType,
          quantity: lastMessage.data.quantity,
          reference: lastMessage.data.reference,
          createdAt: new Date(),
        };

        const updatedMovements = [newMovement, ...prev.recentMovements.slice(0, 49)];

        return {
          ...prev,
          summary: updatedSummary,
          recentMovements: updatedMovements,
          lastUpdated: new Date(),
        };
      });
    }
  }, [lastMessage]);

  return {
    data: dashboardData,
    loading,
    lastUpdated,
    refreshData,
    isConnected,
  };
};