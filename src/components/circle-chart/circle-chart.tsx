import { Pie } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import type { IModeratorDecisions } from '../../types/stats-api.ts'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  data: IModeratorDecisions
}

export const CircleChart = ({ data }: PieChartProps) => {
  const chartData = {
    labels: ['Одобрено', 'Отклонено', 'На доработку'],
    datasets: [
      {
        data: [data.approved, data.rejected, data.requestChanges],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderColor: ['#16a34a', '#dc2626', '#d97706'],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Диаграмма распределения решений',
      },
    },
  }

  return <Pie data={chartData} options={options} />
}
