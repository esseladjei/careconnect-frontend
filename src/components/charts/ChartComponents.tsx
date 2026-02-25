import React from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import type { ChartData } from '../../types/analytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart colors - professional palette
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  secondary: '#8b5cf6',
  info: '#06b6d4',
  light: '#f3f4f6',
  dark: '#1f2937',
};

const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 12,
          weight: 500,
        },
        padding: 15,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 13, weight: 600 },
      bodyFont: { size: 12 },
      borderColor: COLORS.primary,
      borderWidth: 1,
    },
  },
};

interface LineChartProps {
  data: ChartData;
  title?: string;
  height?: string;
  showGrid?: boolean;
}

/**
 * Line Chart Component
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = '300px',
  showGrid = true,
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || COLORS.primary,
      backgroundColor: dataset.backgroundColor || `rgba(59, 130, 246, 0.1)`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.borderColor || COLORS.primary,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    })),
  };

  const options = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

interface BarChartProps {
  data: ChartData;
  title?: string;
  height?: string;
  horizontal?: boolean;
}

/**
 * Bar Chart Component
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = '300px',
  horizontal = false,
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: [
        COLORS.primary,
        COLORS.success,
        COLORS.danger,
        COLORS.warning,
        COLORS.secondary,
        COLORS.info,
      ][index % 6],
      borderColor: 'transparent',
      borderRadius: 8,
      borderSkipped: false,
    })),
  };

  const options = {
    ...commonChartOptions,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    scales: {
      y: {
        grid: {
          display: !horizontal,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: horizontal,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

interface PieChartProps {
  data: ChartData;
  title?: string;
  height?: string;
}

/**
 * Pie Chart Component
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = '300px',
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: [
        COLORS.primary,
        COLORS.success,
        COLORS.danger,
        COLORS.warning,
        COLORS.secondary,
        COLORS.info,
      ],
      borderColor: '#fff',
      borderWidth: 2,
    })),
  };

  const options = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' },
      },
    },
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

interface DoughnutChartProps {
  data: ChartData;
  title?: string;
  height?: string;
}

/**
 * Doughnut Chart Component
 */
export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  title,
  height = '300px',
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: [
        COLORS.primary,
        COLORS.success,
        COLORS.danger,
        COLORS.warning,
        COLORS.secondary,
        COLORS.info,
      ],
      borderColor: '#fff',
      borderWidth: 2,
    })),
  };

  const options = {
    ...commonChartOptions,
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export { COLORS };
