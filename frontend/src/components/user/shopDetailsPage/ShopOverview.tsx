import { faAward, faCar, faShield, faStar, faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ShopOverview:React.FC = () => {
  const {about, discription, image, shopName} = useSelector((state:RootState) => state.shop.shopDetails) || {};

    const stats = [
        { 
          icon: faStar, 
          label: 'Rating', 
          value: '4.8/5', 
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="aspect-video w-full">
          <img
            // src="https://images.unsplash.com/photo-1613214150384-277d56f2edd4?auto=format&fit=crop&w=1600&q=80"
            src={image}
            alt={shopName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${stat.bgColor} rounded-lg`}
                >
                  <FontAwesomeIcon icon={stat.icon} className={stat.iconColor} />
                  <div>
                    <h3 className="font-semibold">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{ discription?.title }</h2>
            <p className="text-gray-600 leading-relaxed">{ discription?.discript }
              {/* Welcome to PV Garagesz, your trusted automotive care partner. We are a full-service 
              auto repair shop committed to providing professional car care services with state-of-the-art 
              equipment and certified technicians. Our team specializes in servicing multiple car brands 
              including Nissan, Honda, Chevy, and Toyota. */}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
            <p className="text-gray-600 leading-relaxed">
              { about?.length !== 0 ? about : '' }
              {/* With over a decade of experience, we've built our reputation on quality workmanship, 
              honest pricing, and exceptional customer service. Our facility is equipped with the 
              latest diagnostic tools and equipment to handle everything from routine maintenance 
              to complex repairs. */}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopOverview