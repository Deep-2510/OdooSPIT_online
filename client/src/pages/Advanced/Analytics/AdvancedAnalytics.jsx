// pages/Advanced/Analytics/AdvancedAnalytics.jsx
import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Timeline,
  Analytics,
  TrendingUp,
  Warehouse,
} from '@mui/icons-material';
import { useApi } from '../../../hooks/useApi';
import { dashboardAPI } from '../../../services/api/dashboard';
import StockForecastChart from '../../../components/charts/AdvancedCharts/StockForecastChart';
import WarehouseComparisonChart from '../../../components/charts/AdvancedCharts/WarehouseComparisonChart';
import MovementAnalytics from '../../../components/charts/AdvancedCharts/MovementAnalytics';
import KpiSummary from '../../../components/dashboard/KpiSummary';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewType, setViewType] = useState('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const { data: analyticsData, loading } = useApi(
    () => dashboardAPI.getAdvancedAnalytics({
      timeRange,
      warehouse: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    })
  );

  const { data: warehouseData } = useApi(() => dashboardAPI.getWarehouses());

  const kpiData = useMemo(() => ({
    totalProducts: analyticsData?.summary?.totalProducts || 0,
    lowStockItems: analyticsData?.summary?.lowStockItems || 0,
    outOfStockItems: analyticsData?.summary?.outOfStockItems || 0,
    totalValue: analyticsData?.summary?.totalValue || 0,
    stockTurnover: analyticsData?.metrics?.stockTurnover || 0,
    inventoryAccuracy: analyticsData?.metrics?.inventoryAccuracy || 0,
  }), [analyticsData]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Analytics sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1">
              Advanced Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Deep insights into inventory performance and trends
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={selectedWarehouse}
              label="Warehouse"
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <MenuItem value="all">All Warehouses</MenuItem>
              {warehouseData?.map(warehouse => (
                <MenuItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, value) => value && setTimeRange(value)}
            size="small"
          >
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
            <ToggleButton value="90d">90D</ToggleButton>
            <ToggleButton value="1y">1Y</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, value) => value && setViewType(value)}
            size="small"
          >
            <ToggleButton value="overview">Overview</ToggleButton>
            <ToggleButton value="detailed">Detailed</ToggleButton>
            <ToggleButton value="comparison">Comparison</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* KPI Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <KpiSummary data={kpiData} />
        </Grid>
      </Grid>

      {/* Advanced Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">Stock Turnover</Typography>
              </Box>
              <Typography variant="h4" color="primary.main">
                {kpiData.stockTurnover.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Times per year
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Warehouse color="success" />
                <Typography variant="h6">Inventory Accuracy</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {(kpiData.inventoryAccuracy * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on cycle counts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Timeline color="info" />
                <Typography variant="h6">Fill Rate</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {analyticsData?.metrics?.fillRate ? (analyticsData.metrics.fillRate * 100).toFixed(1) + '%' : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order fulfillment rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Analytics color="warning" />
                <Typography variant="h6">Carrying Cost</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                ${analyticsData?.metrics?.carryingCost?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Annual holding cost
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Movement Analytics
              </Typography>
              <MovementAnalytics 
                data={analyticsData?.movementAnalytics} 
                timeRange={timeRange}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Warehouse Stock Comparison
              </Typography>
              <WarehouseComparisonChart 
                data={analyticsData?.warehouseComparison}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demand Forecasting
              </Typography>
              <StockForecastChart 
                data={analyticsData?.forecastData}
                timeRange={timeRange}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedAnalytics;