import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { ToastActive } from '../../utilities/functions';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { fetchShopReviews } from '../../../services/userService';
import { Reviews } from '../../utilities/interface';
import { ThreeDots } from 'react-loader-spinner';
import { formatDistanceStrict } from 'date-fns';


const ShopReviews:React.FC = () => {
  const { _id } = useSelector((state:RootState) => state.shop.shopDetails) || {}
  const [reviews,setReviews] = useState<Reviews[]>([])
  const [isloading,setIsloading] = useState(false)


  useEffect(() => {
    if(!_id) return;
    const fetchReviews = async() => {
      try {
        setIsloading(true);
        const response = await fetchShopReviews(_id)
        console.log('response',response.data.allReviews)
        setReviews(response.data.allReviews || []);
      } catch (error) {
        ToastActive('error','error to fetch reviews ')
      }finally{
        setIsloading(false)
      }
    }
    fetchReviews()
  },[_id])

  return (
    <section id="reviews" className="scroll-mt-24">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
      </div>
      
      <div className="space-y-8">
        {isloading ? (
          <ThreeDots height="" color="" wrapperClass="w-10 h-6"/>
        ): reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="border-b last:border-b-0 pb-8 last:pb-0">
              <div className="flex items-start gap-4">
              <img
              src={review.userId.image}
              alt={review.userId.username}
              className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
              <div className="flex justify-between items-start">
              <div>
              <h3 className="font-semibold text-gray-900">{review.userId.username}</h3>
              <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon icon={faStar} className={`${i < review.review.rating ? 'text-yellow-400 ' : 'text-gray-300'}`} />
              ))}
              </div>
              </div>
              <span className="text-sm text-gray-500">
              {formatDistanceStrict(new Date(review.updatedAt),new Date(),{addSuffix:true})}
              </span>
              </div>
              <p className="mt-3 text-gray-600">{review.review.feedback}</p>
              </div>
              </div>
              </div>
            ))
          ):(
            <p className="flex text-gray-400 justify-center">no reviews ...</p>
        )} 
      </div>
    </div>
  </section>
  )
}

export default ShopReviews