
import React, { useState, useEffect } from 'react';
import { Camera, Send, X, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';
import { getReviewSentiment } from '../services/geminiService';

interface ReviewFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounced sentiment analysis
  useEffect(() => {
    if (comment.length < 10) {
      setSentiment(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await getReviewSentiment(comment);
        setSentiment(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [comment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !comment) return;
    onSubmit({
      rating,
      title,
      comment,
      sentiment: sentiment || 'neutral',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'You',
      likes: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-500">Share your thoughts with the community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-700">How would you rate it?</span>
            <StarRating rating={rating} size={32} interactive onRatingChange={setRating} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Headline</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Feedback</label>
              <textarea 
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                required
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {isAnalyzing && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                )}
                {sentiment && !isAnalyzing && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' : 
                    sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {sentiment} detected
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
              <Camera size={24} className="text-gray-400" />
              <span className="text-xs text-gray-500">Add Photos or Video</span>
              <input type="file" className="hidden" accept="image/*" multiple />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <Send size={18} />
              Post Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
