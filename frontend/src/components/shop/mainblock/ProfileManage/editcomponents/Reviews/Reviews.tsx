import { useEffect, useState } from "react";
import ShopReview from "./ShopReview";
import { Reviews as Review } from "../../../../../utilities/interface";
import { ToastActive } from "../../../../../utilities/functions";
import { fetchAllReviews } from "../../../../../../services/shopService";
import { ColorRing } from "react-loader-spinner";

const SAMPLE_REVIEWS = [
  {
    id: '1',
    rating: 5,
    feedback: "Absolutely amazing experience! The product quality exceeded my expectations, and the delivery was super fast. I'll definitely be shopping here again.",
    user: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop',
    },
    orderId: 'ORD-2024-001',
    createdAt: '2024-03-20T10:30:00Z',
    orderDetails: 'Handcrafted Leather Wallet - Brown',
  },
  {
    id: '2',
    rating: 4.5,
    feedback: "Great product and excellent customer service. The only minor issue was the packaging, but the product itself is perfect.",
    user: {
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop',
    },
    orderId: 'ORD-2024-002',
    createdAt: '2024-03-19T15:45:00Z',
    orderDetails: 'Vintage Style Watch - Silver',
  },
  {
    id: '3',
    rating: 5,
    feedback: "This shop never disappoints! The attention to detail and quality of their products is consistently outstanding.",
    user: {
      name: 'Emma Davis',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop',
    },
    orderId: 'ORD-2024-003',
    createdAt: '2024-03-18T09:15:00Z',
    orderDetails: 'Handmade Ceramic Mug Set',
  },
];


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