import {motion} from 'framer-motion'
import RatingStars from '../../reuseComponents/RatingStars';

interface ReviewCardProps {
    _id?:string;
    review:{rating:number,feedback?:string};
    userDetails:{username:string;image:string};
  }

const ReviewCard = ({ review, userDetails }: ReviewCardProps) => {
  return (
  <motion.div
  className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
>
  <div className="flex items-center gap-4 mb-4">
    <img
      src={userDetails.image}
      alt={userDetails.username}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div>
      <h3 className="font-semibold text-lg">{userDetails.username}</h3>
    </div>
  </div>
  <div className="flex gap-1 mb-3">
    <RatingStars rating={review.rating} />
  </div>
  <p className="text-gray-700 flex justify-center leading-relaxed">{review.feedback}</p>
</motion.div>
  )
}

export default ReviewCard