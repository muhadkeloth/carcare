import React, { useEffect, useState } from 'react'
import { StatusAnalytics } from '../utilities/interface';

const LineAnalytics:React.FC<{bookingthrow:string;statusAnalytics:StatusAnalytics}> = ({statusAnalytics,bookingthrow}) => {
    const [animatedCompleted, setAnimatedCompleted] = useState(0);
    const [animatedFailed, setAnimatedFailed] = useState(0);
    const [animatedPending, setAnimatedPending] = useState(0);

    const totalBookings = Object.values(statusAnalytics).reduce((t,v)=>t+v,0);
    const completed = statusAnalytics.COMPLETED;
    const failed = statusAnalytics.CANCELED;
    const pending = statusAnalytics.PENDING;

    const completedPercentage = Math.round((completed / totalBookings) * 100);
    const failedPercentage = Math.round((failed / totalBookings) * 100);
    const pendingPercentage = Math.round((pending / totalBookings) * 100);

  useEffect(() => {
    const animationSpeed = 20;
    const animateProgress = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      let current = 0;
      const interval = setInterval(() => {
        if (current < target) {
          current++;
          setter(current);
        } else {
          clearInterval(interval);
        }
      }, animationSpeed);
    };
    animateProgress(completedPercentage, setAnimatedCompleted);
    animateProgress(failedPercentage, setAnimatedFailed);
    animateProgress(pendingPercentage, setAnimatedPending);
  }, [completedPercentage, failedPercentage, pendingPercentage]);

  return (
    <div className="w-full max-w-lg mx-auto p-6 border rounded-lg shadow-md bg-white">
    <h2 className="text-xl font-bold mb-4">{bookingthrow} Analytics</h2>

    <div className="mb-4">
      <p className="text-gray-600 font-medium">Total {bookingthrow}s: {totalBookings}</p>
    </div>

    <div className="space-y-4">
      {/* Completed */}
      <div className="relative group">
        <p className="text-sm text-gray-500 mb-1">Completed ({completedPercentage}%)</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-green-500 rounded-full transition-all duration-700"
            style={{ width: `${animatedCompleted}%` }}
          ></div>
        </div>
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-6 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
          {completed} completed out of {totalBookings}
        </div>
      </div>

      {/* Failed */}
      <div className="relative group">
        <p className="text-sm text-gray-500 mb-1">Failed ({failedPercentage}%)</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-red-500 rounded-full transition-all duration-700"
            style={{ width: `${animatedFailed}%` }}
          ></div>
        </div>
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-6 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
          {failed} failed out of {totalBookings}
        </div>
      </div>

      {/* Pending */}
      <div className="relative group">
        <p className="text-sm text-gray-500 mb-1">Pending ({pendingPercentage}%)</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-yellow-500 rounded-full transition-all duration-700"
            style={{ width: `${animatedPending}%` }}
          ></div>
        </div>
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-6 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
          {pending} pending out of {totalBookings}
        </div>
      </div>
    </div>
  </div>
  )
}

export default LineAnalytics