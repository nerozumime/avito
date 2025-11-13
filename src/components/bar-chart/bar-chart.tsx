import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { IModeratorActivity } from '../../types/stats-api.ts'
import { STATUS_COLOR_MAP } from '../../constants/constants.ts'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  data: IModeratorActivity[]
  period: string
}

export const BarChart = ({ data, period }: BarChartProps) => {
  const total = data.reduce(
    (prevVal, currVal) => (prevVal += currVal.approved + currVal.requestChanges + currVal.rejected),
    0,
  )
  if (total <= 0) return null
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
        backgroundColor: STATUS_COLOR_MAP.approved.backgroundColor,
        borderColor: STATUS_COLOR_MAP.approved.borderColor,
        borderWidth: 1,
      },
      {
        label: 'Отклонено',
        data: data.map((item) => item.rejected),
        backgroundColor: STATUS_COLOR_MAP.rejected.backgroundColor,
        borderColor: STATUS_COLOR_MAP.rejected.borderColor,
        borderWidth: 1,
      },
      {
        label: 'На доработку',
        data: data.map((item) => item.requestChanges),
        backgroundColor: STATUS_COLOR_MAP.requestChanges.backgroundColor,
        borderColor: STATUS_COLOR_MAP.requestChanges.borderColor,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `График активности (${period})`,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
