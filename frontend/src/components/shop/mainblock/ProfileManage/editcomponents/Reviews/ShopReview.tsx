import { Reviews } from "../../../../../utilities/interface";
import RatingStars from "../../../../../reuseComponents/RatingStars";


interface ShopReviewProps {
    review: Reviews;
  }
  

const ShopReview = ({ review }: ShopReviewProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12">
          <img src={review.userId.image} alt={review.userId.username} className="w-12 h-12 rounded-full" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{review.userId.username}</h3>
          <p className="text-sm text-muted-foreground">
            Booking Id #{review._id} • {new Date(review.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <RatingStars rating={review.review.rating} />
    </div>
    
    <div className="mt-4">
      <p className="text-foreground">{review.review.feedback}</p>
    </div>
  </div>
  )
}

export default ShopReview