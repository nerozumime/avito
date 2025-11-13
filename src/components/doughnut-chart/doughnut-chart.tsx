import { Doughnut } from 'react-chartjs-2'
import type { TChartsCategories } from '../../types/stats-api.ts'

interface DoughnutChartProps {
  data: TChartsCategories
}

export const DoughnutChart = ({ data }: DoughnutChartProps) => {
  const categories = Object.keys(data)
  const values = Object.values(data)
  const total = values.reduce((sum, value) => sum + value, 0)

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 20,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: '50%',
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Распределение по категориям',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.parsed
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Doughnut data={chartData} options={options} />
}
