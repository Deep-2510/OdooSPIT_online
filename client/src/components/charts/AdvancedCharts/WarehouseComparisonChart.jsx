// components/charts/AdvancedCharts/WarehouseComparisonChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography } from '@mui/material';
import LoadingSpinner from '../../common/UI/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WarehouseComparisonChart = ({ data, loading = false }) => {
  const chartData = {
    labels: data?.map(item => item.warehouse) || [],
    datasets: [
      {
        label: 'Total Stock Value',
        data: data?.map(item => item.totalValue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Number of Products',
        data: data?.map(item => item.productCount) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Low Stock Items',
        data: data?.map(item => item.lowStockCount) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Total Stock Value') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Warehouse',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count / Value',
        },
      },
    },
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No warehouse comparison data available
        </Typography>
      </Box>
    );
  }

  return <Bar data={chartData} options={options} />;
};

export default WarehouseComparisonChart;