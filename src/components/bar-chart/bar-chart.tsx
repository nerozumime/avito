import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { IModeratorActivity } from '../../types/stats-api.ts'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  data: IModeratorActivity[]
}

export const BarChart = ({ data }: BarChartProps) => {
  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
    }),
    datasets: [
      {
        label: 'Одобрено',
        data: data.map((item) => item.approved),
        backgroundColor: '#32ff36',
        borderColor: '#1ab61d',
        borderWidth: 1,
      },
      {
        label: 'Отклонено',
        data: data.map((item) => item.rejected),
        backgroundColor: '#fa2c2c',
        borderColor: '#c51d1d',
        borderWidth: 1,
      },
      {
        label: 'На доработку',
        data: data.map((item) => item.requestChanges),
        backgroundColor: '#f8c748',
        borderColor: '#f8bf26',
        borderWidth: 1,
      },
    ],
  }

  return <Bar data={chartData} />
}
