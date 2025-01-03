import { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard';
import { AnimatePresence, motion } from 'framer-motion'
import { fetchRandomFeedback } from '../../../services/userService';


type ReviewType = {
  _id?:string;
  review:{rating:number,feedback?:string};
  userDetails:{username:string;image:string};
  userId:string;
}

const Reviews = () => {
      const [reviews,setReviews] = useState<ReviewType[]>([]);
      const [currentIndex, setCurrentIndex] = useState(0);

       const fetchReviews = async () => {
             try {
                  const response = await fetchRandomFeedback();
                  setReviews(response.data.allReviews);
             } catch (error) {
               const errorMessage = (error as Error).message;
               console.error("error fetchingfeedback shops:",errorMessage);
               setReviews([]);
             }
         }
  
  
      useEffect(()=>{
             fetchReviews();
         },[]);

         useEffect(() => {
          if (reviews.length > 1) {
            const interval = setInterval(() => {
              setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
            }, 5000); 
            return () => clearInterval(interval);
          }
        }, [reviews]);


  return (
  <section className="py-16 px-4 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Don't just take our word for it. Here's what our amazing community
        has to say about their experience.
      </p>
    </div>

    <div className="relative  w-full">
      {reviews.length > 0 ? (
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50,position: 'absolute' }}
            transition={{ duration: 0.6 }}
            className="  w-full  flex justify-center"
          >
            <ReviewCard {...reviews[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-center text-gray-500">No reviews available at the moment.</p>
      )}
    </div>

    <div className="flex justify-center gap-2 mt-6">
      {reviews.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`w-3 h-3 rounded-full ${
            index === currentIndex ? 'bg-mainclr-500' : 'bg-gray-300'
          }`}
        ></button>
      ))}
    </div>
  </div>
</section>


  );
}

export default Reviews