import React from 'react'
import {Chart as ChartJS,ArcElement,Tooltip,Legend,Title,} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { RatingData } from '../utilities/interface';

ChartJS.register(ArcElement,Tooltip,Legend,Title)

const PieChart:React.FC<{ratingforPieChart:RatingData[]}> = ({ratingforPieChart}) => {

    const pieChartData = {
        labels: ratingforPieChart.map(v=>`${'★'.repeat(v.rating)} (${v.count})`),
        datasets: [
          {
            data: ratingforPieChart.map(v=>v.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };

  return <Pie
    data={pieChartData}
    options={{
      responsive: true,
    }}
  />
}

export default PieChart