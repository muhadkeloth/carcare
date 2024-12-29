import MotionWrapper from '../reuseComponents/ui/MotionWrapper ';
import { StatusAnalytics } from '../utilities/interface';
import { motion } from 'framer-motion'

interface LineAnalyticsProps {
  bookingthrow:string;
  statusAnalytics:StatusAnalytics
}

const LineAnalytics = ({statusAnalytics,bookingthrow}:LineAnalyticsProps) => {
    const totalBookings = Object.values(statusAnalytics).reduce((t,v)=>t+v,0);
    const completed = statusAnalytics.COMPLETED;
    const failed = statusAnalytics.CANCELED;
    const pending = statusAnalytics.PENDING;

    const completedPercentage = Math.round((completed / totalBookings) * 100);
    const failedPercentage = Math.round((failed / totalBookings) * 100);
    const pendingPercentage = Math.round((pending / totalBookings) * 100);

  return (
    <MotionWrapper  className="w-full max-w-lg mx-auto p-6 border rounded-lg shadow-md bg-white" >
      <h2 className="text-xl font-bold mb-4">{bookingthrow} Analytics</h2>

      <div className="mb-4">
        <p className="text-gray-600 font-medium">
          Total {bookingthrow}s: {totalBookings}
        </p>
      </div>

      <div className="space-y-4">
      {[
          { label: 'Completed', percentage: completedPercentage, count: completed, color: 'bg-green-500' },
          { label: 'Failed', percentage: failedPercentage, count: failed, color: 'bg-red-500' },
          { label: 'Pending', percentage: pendingPercentage, count: pending, color: 'bg-yellow-500' },
        ].map((item) => (
          <div key={item.label} className="relative group">
          <p className="text-sm text-gray-500 mb-1">
            {item.label} ({item.percentage}%)
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className={`h-4 ${item.color} rounded-full`}
              initial={{ width: 0 }}
              whileInView={{ width: `${item.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-6 right-0 text-xs px-2 py-1 rounded-md shadow-md"
            style={{ backgroundColor: item.color }}
          >
            {item.count} {item.label.toLowerCase()} out of {totalBookings}
          </div>
        </div>
        ))}
      </div>
    </MotionWrapper>
  );
}

export default LineAnalytics