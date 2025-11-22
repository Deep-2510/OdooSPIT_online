// client/src/pages/Dashboard.jsx
import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Refresh,
  TrendingUp,
  Warning,
  Inventory,
  LocalShipping,
} from '@mui/icons-material';
import { useDashboardData } from '../hooks/custom/useDashboardData';
import KpiSummary from '../components/dashboard/KpiSummary';
import RecentActivities from '../components/dashboard/RecentActivities';
import StockChart from '../components/charts/StockChart';
import MovementChart from '../components/charts/MovementChart';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { data, loading, lastUpdated, refreshData, isConnected } = useDashboardData();

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              {isConnected && (
                <Box component="span" sx={{ color: 'success.main', ml: 1 }}>
                  • Live
                </Box>
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
          >
            <ToggleButton value="1d">1D</ToggleButton>
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
          </ToggleButtonGroup>

          <Button
            startIcon={<Refresh />}
            onClick={refreshData}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* KPI Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <KpiSummary data={data?.summary} loading={loading} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Movement
              </Typography>
              <MovementChart 
                data={data?.recentMovements} 
                timeRange={timeRange}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Distribution
              </Typography>
              <StockChart 
                data={data?.summary?.stockByCategory}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities and Quick Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <RecentActivities 
                activities={data?.recentMovements}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Inventory />}
                  fullWidth
                  href="/receipts/create"
                >
                  New Receipt
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalShipping />}
                  fullWidth
                  href="/deliveries/create"
                >
                  New Delivery
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Warning />}
                  fullWidth
                  href="/products?filter=low_stock"
                >
                  View Low Stock
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  fullWidth
                  href="/analytics"
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;