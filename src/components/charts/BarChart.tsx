import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js'
import { Bar, } from 'react-chartjs-2';
import { generateCountsforChart } from '../utilities/functions';
import { Period } from '../utilities/interface';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const BarChart:React.FC<{bookingsCountforBarChart:any[];pickupsCountforBarChart:any[];period:Period}> = ({bookingsCountforBarChart,pickupsCountforBarChart,period}) => {
  const normalizedBookings = generateCountsforChart(period,bookingsCountforBarChart)
  const normalizedPickups = generateCountsforChart(period,pickupsCountforBarChart)
    const barChartDatas = {
        labels: normalizedBookings.map((v)=>v._id),
        datasets: [
          {
            label: `${period[0].toUpperCase()}${period.slice(1)} Bookings`,
            data: normalizedBookings.map((v)=>v.count),
            backgroundColor: 'rgba(0, 230, 118, 0.6)',
            borderColor: 'rgba(0, 230, 118, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: `${period[0].toUpperCase()}${period.slice(1)} Pickups`,
            data: normalizedPickups.map((v)=>v.count),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      };

  return <Bar
  data={barChartDatas}
  options={{
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  }}
/>
}

export default BarChart