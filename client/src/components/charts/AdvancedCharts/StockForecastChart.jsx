// components/charts/AdvancedCharts/StockForecastChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Box, Typography } from '@mui/material';
import LoadingSpinner from '../../common/UI/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockForecastChart = ({ data, timeRange, loading = false }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Historical Demand',
        data: data?.historical || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Forecasted Demand',
        data: data?.forecast || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Confidence Interval (Upper)',
        data: data?.confidenceUpper || [],
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 1,
        borderDash: [2, 2],
        fill: '+1',
        pointRadius: 0,
      },
      {
        label: 'Confidence Interval (Lower)',
        data: data?.confidenceLower || [],
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0,
        fill: false,
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
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Quantity',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No forecast data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Line data={chartData} options={options} />
      {data.accuracy && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Forecast Accuracy: {(data.accuracy * 100).toFixed(1)}%
        </Typography>
      )}
    </Box>
  );
};

export default StockForecastChart;