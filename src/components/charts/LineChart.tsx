import React from 'react'
import { Line } from 'react-chartjs-2'
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { Period } from '../utilities/interface';
import { generateCountsforChart } from '../utilities/functions';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend)

const LineChart:React.FC<{bookingsPriceCountforLineChart:any[];pickupsPriceCountforLineChart:any[];period:Period;isAdmin?:boolean}> = ({bookingsPriceCountforLineChart,pickupsPriceCountforLineChart,period,isAdmin}) => {
  const normalizedBookings = generateCountsforChart(period,bookingsPriceCountforLineChart)
  const normalizedPickups = generateCountsforChart(period,pickupsPriceCountforLineChart)

  let adminDataset: { label:string;data:number[];borderColor:string;backgroundColor:string;borderDash:[number,number];tension:number } | null = null;
  if(isAdmin){
    const adminData = normalizedBookings.map((v, i) => {
      const bookingTotal = v.total || 0;
      const pickupTotal = normalizedPickups[i]?.total || 0;
      return (bookingTotal + pickupTotal) * 0.2;
    })
    adminDataset = {
      label:"Brockerage 20% Cut (₹)",
      data:adminData,
      borderColor:'rgba(75, 192, 192, 1)',
      backgroundColor:'rgba(75, 192, 192, 1)',
      borderDash:[5,5],
      tension:0.2,
    }
  }
    const linedata = {
        labels: normalizedBookings.map((v)=>v._id),
        datasets: [
          {
            label: 'Bookings Revenue (₹)',
            data: normalizedBookings.map((v)=>v.total),
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.6,
          },
          {
            label: 'Pickups Revenue (₹)',
            data: normalizedPickups.map((v)=>v.total),
            borderColor: 'rgba(255, 105, 180, 1)',
            tension: 0.6,
          },
          ...(adminDataset ? [adminDataset] : []),
        ],
      };

  return <Line 
  data={linedata}
  options={{
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  }} />
}

export default LineChart