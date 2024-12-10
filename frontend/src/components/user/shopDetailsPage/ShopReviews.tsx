import { faComment, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const ShopReviews:React.FC = () => {

    const reviews = [
        {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/150?img=4',
          rating: 5,
          date: '2 weeks ago',
          comment: 'Excellent service! They fixed my car\'s suspension issue quickly and professionally. The staff was very knowledgeable and friendly. Highly recommend their services.',
          helpful: 12,
          replies: 2
        },
        {
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/150?img=7',
          rating: 4,
          date: '1 month ago',
          comment: 'Very knowledgeable staff and reasonable prices. The waiting area was comfortable and they kept me updated throughout the repair process.',
          helpful: 8,
          replies: 1
        },
        {
          name: 'Mike Johnson',
          avatar: 'https://i.pravatar.cc/150?img=3',
          rating: 5,
          date: '2 months ago',
          comment: 'Best automotive service I\'ve experienced. They diagnosed and fixed the issue with my car\'s engine in no time. Fair pricing and great customer service.',
          helpful: 15,
          replies: 3
        }
      ];

  return (
    <section id="reviews" className="scroll-mt-24">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <button className="px-4 py-2 btn-primary">
          Write a Review
        </button>
      </div>
      
      <div className="space-y-8">
        {reviews.map((review, index) => (
          <div key={index} className="border-b last:border-b-0 pb-8 last:pb-0">
            <div className="flex items-start gap-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon icon={faStar} className={`${i < review.rating ? 'text-yellow-400 ' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="mt-3 text-gray-600">{review.comment}</p>
                <div className="flex items-center gap-6 mt-4">
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-mainclr-600">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-mainclr-600">
                    <FontAwesomeIcon icon={faComment} />
                    <span>Reply ({review.replies})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default ShopReviews