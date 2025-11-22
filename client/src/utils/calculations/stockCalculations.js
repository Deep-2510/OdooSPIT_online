// utils/calculations/stockCalculations.js
export const calculateStockValue = (items, field = 'costPrice') => {
  return items.reduce((total, item) => {
    const quantity = item.quantity || item.quantityReceived || 0;
    const price = item[field] || 0;
    return total + (quantity * price);
  }, 0);
};

export const calculateStockTurnover = (costOfGoodsSold, averageInventory) => {
  if (!averageInventory || averageInventory === 0) return 0;
  return costOfGoodsSold / averageInventory;
};

export const calculateDaysInventoryOutstanding = (averageInventory, costOfGoodsSold, days = 365) => {
  if (!costOfGoodsSold || costOfGoodsSold === 0) return 0;
  return (averageInventory / costOfGoodsSold) * days;
};

export const forecastDemand = (historicalData, period = 30) => {
  if (!historicalData || historicalData.length === 0) return 0;
  
  // Simple moving average
  const recentData = historicalData.slice(-period);
  const total = recentData.reduce((sum, data) => sum + data.quantity, 0);
  return total / recentData.length;
};

export const calculateSafetyStock = (demand, leadTime, serviceLevel = 0.95) => {
  // Simple safety stock calculation
  const zScore = 1.65; // For 95% service level
  return zScore * Math.sqrt(demand * leadTime);
};

export const calculateReorderPoint = (demand, leadTime, safetyStock = 0) => {
  return (demand * leadTime) + safetyStock;
};

export const analyzeStockAging = (stockData, currentDate = new Date()) => {
  return stockData.map(item => {
    const receivedDate = new Date(item.receivedDate || item.createdAt);
    const ageInDays = Math.floor((currentDate - receivedDate) / (1000 * 60 * 60 * 24));
    
    let agingCategory = 'current';
    if (ageInDays > 180) agingCategory = 'very_old';
    else if (ageInDays > 90) agingCategory = 'old';
    else if (ageInDays > 30) agingCategory = 'aging';
    
    return {
      ...item,
      ageInDays,
      agingCategory,
    };
  });
};

export const identifySlowMovingItems = (items, thresholdDays = 90) => {
  return items.filter(item => {
    const lastMovement = new Date(item.lastMovementDate || item.createdAt);
    const daysSinceMovement = Math.floor((new Date() - lastMovement) / (1000 * 60 * 60 * 24));
    return daysSinceMovement > thresholdDays;
  });
};