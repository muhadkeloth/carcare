import { faAward, faCar, faShield, faStar, faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { DropMotionWrapper, ZoomMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import { motion } from 'framer-motion'


const ShopOverview:React.FC = () => {
  const {about, discription, rating, image, shopName} = useSelector((state:RootState) => state.shop.shopDetails) || {};

    const stats = [
        { 
          icon: faStar, 
          label: 'Rating', 
          value: `${rating?.ratingSum?( rating?.ratingSum/rating.count).toFixed(1) : '-'}/5`, 
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600' 
        },
        { 
          icon: faAward, 
          label: 'Experience', 
          value: '10+ Years', 
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600' 
        },
        { 
          icon: faCar, 
          label: 'Cars Serviced', 
          value: '5000+', 
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600' 
        },
        { 
          icon: faWrench, 
          label: 'Services', 
          value: '15+', 
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600' 
        },
        { 
          icon: faShield, 
          label: 'Warranty', 
          value: '100%', 
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600' 
        },
        { 
          icon: faUser, 
          label: 'Expert Staff', 
          value: '20+', 
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600' 
        }
      ];


  return (
    <section id="overview" className="scroll-mt-24">
      <DropMotionWrapper className="bg-white rounded-xl shadow-sm overflow-hidden">
        <motion.div
          className="aspect-video w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={image}
            alt={shopName}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              return (
                <ZoomMotionWrapper
                  key={index}
                  className={`flex items-center gap-3 p-4 ${stat.bgColor} rounded-lg`}
                >
                  <FontAwesomeIcon
                    icon={stat.icon}
                    className={stat.iconColor}
                  />
                  <div>
                    <h3 className="font-semibold">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </ZoomMotionWrapper>
              );
            })}
          </div>

          <DropMotionWrapper className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {discription?.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {discription?.discript}
            </p>
            {about?.length !== 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  { about }
                </p>
              </>
            )}
          </DropMotionWrapper>
        </div>
      </DropMotionWrapper>
    </section>
  );
}

export default ShopOverview