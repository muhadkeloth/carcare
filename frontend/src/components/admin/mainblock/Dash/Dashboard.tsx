import React, { useEffect, useState } from 'react'
import { formatDate, formatToIndianNumbering, mergeRatingCounts, ToastActive } from '../../../utilities/functions'
import { Period, StatusAnalytics } from '../../../utilities/interface'
import { faIndianRupeeSign, faLocationDot, faMoneyBillTrendUp, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BarChart from '../../../charts/BarChart'
import LineChart from '../../../charts/LineChart'
import PieChart from '../../../charts/PieChart'
import LineAnalytics from '../../../charts/lineAnalytics'
import { fetchfilterCountCart, fetchfilterPriceCart, fetchStatistics } from '../../../../services/adminService'

const Dashboard:React.FC = () => {
  const [periodBarChart, setPeriodBarChart] = useState<Period>('monthly')
  const [periodLineChart, setPeriodLineChart] = useState<Period>('monthly')
  const [bookingsCountforBarChart,setBarChartBarData] = useState<any[]>([])
  const [pickupsCountforBarChart,setPickupsCountforBarChart] = useState<any[]>([])
  const [bookingsPriceCountforLineChart,setBookingsPriceCountforLineChart] = useState<any[]>([])
  const [pickupsPriceCountforLineChart,setPickupsPriceCountforLineChart] = useState<any[]>([])
  const [brockeragePriceCountForLineChart,setBrockeragePriceCountForLineChart] = useState<any[]>([])
  const [ratingforPieChart,setRatingforPieChart] = useState<any[]>([])
  const [totalRevenue,setTotalRevenue] = useState('')
  const [totalBrockerage,setTotalBrockerage] = useState('')
  const [totalpickupsbyStatus,setTotalpickupsbyStatus] = useState<StatusAnalytics>({CANCELED:0,COMPLETED:0,PENDING:0})
  const [totalbookingsbyStatus,setTotalbookingsbyStatus] = useState<StatusAnalytics>({CANCELED:0,COMPLETED:0,PENDING:0})
  const [upComingbookings,setUpComingbookings] = useState<Record<string,any>[]>([])
  const [upComingpickups,setUpComingpickups] = useState<Record<string,any>[]>([])

  const statistics = [
    { id: 1, title: 'Total Revenue', value: `₹ ${totalRevenue}`, icon: faIndianRupeeSign, color: 'bg-green-500' },
    { id: 2, title: 'Total Brockerage', value: `₹ ${totalBrockerage}`, icon: faMoneyBillTrendUp, color: 'bg-yellow-500' },
    { id: 3, title: 'Total Bookings', value: formatToIndianNumbering(totalbookingsbyStatus?.COMPLETED), icon: faShoppingCart, color: 'bg-blue-500' },
    { id: 4, title: 'Total Pickups', value: formatToIndianNumbering(totalpickupsbyStatus?.COMPLETED), icon: faLocationDot, color: 'bg-purple-500' },
  ];

  const handleFilterChart = async(chart:string,period:Period) => {
    if(chart == 'Bar'){
      try {
        const response = await fetchfilterCountCart(period);
        const {
          bookingsCountforChart,
          pickupsCountforChart, 
        } = response.data;
        setBarChartBarData(bookingsCountforChart);
        setPickupsCountforBarChart(pickupsCountforChart);
        setPeriodBarChart(period)
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive("error",`chart filter failed ${errorMessage}`)
      }
    }else if(chart == 'Line'){
      try {
        const response = await fetchfilterPriceCart(period);
        const {
          bookingsPriceCountforChart, 
          pickupsPriceCountforChart, 
        } = response.data;
        setBookingsPriceCountforLineChart(bookingsPriceCountforChart);
        setPickupsPriceCountforLineChart(pickupsPriceCountforChart);
        setPeriodLineChart(period)
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive("error",`chart filter failed ${errorMessage}`)
      }
    }
  }


 useEffect(()=>{
  const fetchChartData = async ()=>{
    try{
      const response = await fetchStatistics()
      const {
        bookingsCountforChart,
        pickupsCountforChart,
        bookingsPriceCountforChart ,
        pickupsPriceCountforChart,
        bookingsRatingCountforChart,
        pickupsRatingCountforChart,
        totalbookingRevenue,
        totalpickupRevenue,
        totalbookingsbyStatus,
        totalpickupsbyStatus,
        UpComingbookings,
        UpComingpickups,
      } = response.data;
      setBarChartBarData(bookingsCountforChart);
      setPickupsCountforBarChart(pickupsCountforChart);
      setBookingsPriceCountforLineChart(bookingsPriceCountforChart);
      setPickupsPriceCountforLineChart(pickupsPriceCountforChart);
      setRatingforPieChart(mergeRatingCounts(bookingsRatingCountforChart,pickupsRatingCountforChart))
      setTotalRevenue(formatToIndianNumbering(totalbookingRevenue[0].totalAmount+totalpickupRevenue[0].totalAmount))
      setTotalBrockerage(formatToIndianNumbering( (totalbookingRevenue[0].totalAmount+totalpickupRevenue[0].totalAmount) * 0.2 ))
      setTotalbookingsbyStatus(totalbookingsbyStatus)
      setTotalpickupsbyStatus(totalpickupsbyStatus)
      setUpComingbookings(UpComingbookings)
      setUpComingpickups(UpComingpickups)
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive("error",`statistics not found${errorMessage}`)
    }
  }
  fetchChartData()
 },[])



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statistics.map((stat) => (
        <div
          key={stat.id}
          className={`p-4 rounded-lg shadow-md flex items-center ${stat.color} text-white`}
        >
          <FontAwesomeIcon icon={stat.icon} className="text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{`${periodBarChart[0].toUpperCase()}${periodBarChart.slice(1)}`} Breakdown</h3>
        <div className="flex text-sm text-gray-500 gap-2">
          <button className={`hover:text-mainclr-500  ${periodBarChart=='weekly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Bar','weekly')}>weekly</button>
          <button className={`hover:text-mainclr-500 ${periodBarChart=='monthly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Bar','monthly')}>monthly</button>
          <button className={`hover:text-mainclr-500 ${periodBarChart=='yearly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Bar','yearly')}>yearly</button>
        </div>
        </div>
        <BarChart period={periodBarChart} bookingsCountforBarChart={bookingsCountforBarChart} pickupsCountforBarChart={pickupsCountforBarChart} /> 
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{`${periodLineChart[0].toUpperCase()}${periodLineChart.slice(1)}`} Revenue</h3>
        <div className="flex text-sm text-gray-500 gap-2 ">
          <button className={`hover:text-mainclr-500  ${periodLineChart=='weekly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Line','weekly')}>weekly</button>
          <button className={`hover:text-mainclr-500 ${periodLineChart=='monthly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Line','monthly')}>monthly</button>
          <button className={`hover:text-mainclr-500 ${periodLineChart=='yearly'? 'text-mainclr-400':''}`} onClick={()=>handleFilterChart('Line','yearly')}>yearly</button>
        </div>
        </div>
        <LineChart period={periodLineChart} bookingsPriceCountforLineChart={bookingsPriceCountforLineChart} pickupsPriceCountforLineChart={pickupsPriceCountforLineChart} isAdmin={true} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Breakdown</h3>
        <PieChart ratingforPieChart={ratingforPieChart} />
      </div>
      <div className="flex flex-col bg-white p-6 gap-3 rounded-lg shadow-md">
        <LineAnalytics statusAnalytics={totalbookingsbyStatus} bookingthrow='Booking' />
        <LineAnalytics statusAnalytics={totalpickupsbyStatus} bookingthrow='Pickup' />
      </div>
      <div className="flex flex-col bg-white p-6 gap-3 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Bookings</h3>
        <ul className='list-disc ms-5'>
          {upComingbookings.length > 0 ? (
            upComingbookings.map(booking => (
              <li>{booking.userDetails.firstName} {booking.userDetails.phoneNumber} {formatDate(booking.shedule.date)} {booking.shedule.time}</li>
            ))
          ):(
            <li className='text-gray-400'>no upcoming bookings this week</li>
          )}
        </ul>
      </div>
      <div className="flex flex-col bg-white p-6 gap-3 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Pickups</h3>
        <ul className='list-disc ms-5'>
        {upComingbookings.length > 0 ? (
          upComingpickups.map(pickup =>(
            <li>{pickup.userDetails.firstName} {pickup.userDetails.phoneNumber} {formatDate(pickup.shedule.date)} {pickup.shedule.time}</li>
          ))
          ):(
            <li className='text-gray-400'>no upcoming pickups this week</li>
          )}
        </ul>
      </div>
    </div>
  </div>
  )
}

export default Dashboard