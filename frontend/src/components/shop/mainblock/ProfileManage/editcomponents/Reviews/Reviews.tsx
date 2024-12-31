import { useEffect, useState } from "react";
import ShopReview from "./ShopReview";
import { Reviews as Review } from "../../../../../utilities/interface";
import { ToastActive } from "../../../../../utilities/functions";
import { fetchAllReviews } from "../../../../../../services/shopService";
import { ColorRing } from "react-loader-spinner";



const Reviews = () => {
  const [allreviews,setAllReviews] = useState<Review[]>([]);
  const [isloading,setIsloading] = useState(false)

  const fetchReviews = async() => {
    try {
      setIsloading(true);
      const response = await fetchAllReviews();
      setAllReviews(response.data.allReviews || [])
    } catch (error) {
      ToastActive('error','error to fetch reviews ')
    }finally{
      setIsloading(false)
    }
  }

  useEffect(()=> {
    fetchReviews()
  },[])


  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8">
      <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
        <p className="text-muted-foreground">
          See what customers are saying about their feedback
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-3xl mx-auto">
        {isloading ? (
          <div className="flex justify-center">
          <ColorRing
          visible={true}
          width="50"
          ariaLabel="color-ring-loading"
          wrapperClass="color-ring-wrapper"
          colors={[ '#000','#000', '#000', '#000', '#000']} />
          </div>
        ):(
          allreviews.map((review) => (
            <ShopReview key={review._id} review={review} />
          ))
        )}
      </div>
    </div>
      </main>
    </div>
  )
}

export default Reviews