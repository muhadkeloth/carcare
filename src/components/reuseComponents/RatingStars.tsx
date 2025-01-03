import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

  return (
   <div className="flex items-center gap-0.5">
           {[...Array(fullStars)].map((_, i) => (
               <FontAwesomeIcon icon={faStar} 
               key={`full=${i}`} 
               className='text-yellow-400 '
               />
            ))}
           {hasHalfStar && (
               <FontAwesomeIcon icon={faStarHalf} 
               className='text-yellow-400 '
               />
            )}
           {[...Array(emptyStars)].map((_, i) => (
               <FontAwesomeIcon icon={faStar} 
               key={`empty=${i}`} 
               className='text-gray-400 '
               />
           ))}
         </div>
  )
}

export default RatingStars