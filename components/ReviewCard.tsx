
import React from 'react';
import { ThumbsUp, MessageSquare, ShieldCheck, MoreVertical } from 'lucide-react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  onGenerateReply: (review: Review) => void;
  isMerchant?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onGenerateReply, isMerchant }) => {
  const sentimentColors = {
    positive: 'bg-green-50 text-green-700 border-green-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
    negative: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase overflow-hidden">
            {review.avatar ? (
              <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
            ) : (
              review.author.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.author}</h4>
              <ShieldCheck size={14} className="text-blue-500" title="Verified Purchase" />
            </div>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StarRating rating={review.rating} />
          {review.sentiment && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sentimentColors[review.sentiment]}`}>
              {review.sentiment}
            </span>
          )}
        </div>
      </div>

      <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((img, idx) => (
            <img key={idx} src={img} alt="User feedback" className="w-20 h-20 rounded-lg object-cover border border-gray-100" />
          ))}
        </div>
      )}

      {review.merchantReply && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-indigo-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700">Merchant Response</span>
          </div>
          <p className="text-sm text-gray-600 italic">"{review.merchantReply}"</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
            <ThumbsUp size={14} />
            <span>Helpful ({review.likes})</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
            <MessageSquare size={14} />
            <span>Comment</span>
          </button>
        </div>
        
        {isMerchant && !review.merchantReply && (
          <button 
            onClick={() => onGenerateReply(review)}
            className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare size={14} />
            AI Smart Reply
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
