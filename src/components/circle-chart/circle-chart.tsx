import { Pie } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import type { IModeratorDecisions } from '../../types/stats-api.ts'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CircleChart {
  data: IModeratorDecisions
}

export const CircleChart = ({ data }: CircleChart) => {
  const total = data.approved + data.rejected + data.requestChanges
  if (total <= 0) return null
  const chartData = {
    labels: ['Одобрено', 'Отклонено', 'На доработку'],
    datasets: [
      {
        data: [data.approved, data.rejected, data.requestChanges],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderColor: ['#16a34a', '#dc2626', '#d97706'],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Диаграмма распределения решений',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.parsed
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}
