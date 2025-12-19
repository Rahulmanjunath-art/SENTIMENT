
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  Package, 
  ShoppingBag,
  Heart,
  Share2,
  Menu,
  Sparkles
} from 'lucide-react';
import { Review, Product, AISummaryData, SortOption } from './types';
import { mockProduct, initialReviews } from './mockData';
import ReviewCard from './components/ReviewCard';
import AISummary from './components/AISummary';
import ReviewStats from './components/ReviewStats';
import ReviewForm from './components/ReviewForm';
import StarRating from './components/StarRating';
import { analyzeReviews, generateMerchantReply } from './services/geminiService';

const App: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [product] = useState<Product>(mockProduct);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isMerchantMode, setIsMerchantMode] = useState(false);

  // Filter and sort logic
  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    
    if (searchQuery) {
      result = result.filter(r => 
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_helpful':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
      default:
        // Mock newest by reversing current array
        break;
    }

    return result;
  }, [reviews, searchQuery, sortBy]);

  // Generate AI Summary on mount or when reviews change significantly
  useEffect(() => {
    const fetchAISummary = async () => {
      setIsSummarizing(true);
      try {
        const data = await analyzeReviews(reviews);
        setAiSummary(data);
      } catch (err) {
        console.error("Failed to generate AI summary", err);
      } finally {
        setIsSummarizing(false);
      }
    };

    fetchAISummary();
  }, [reviews.length]);

  const handleAddReview = (newReview: any) => {
    setReviews([{ ...newReview, id: Date.now().toString() }, ...reviews]);
    setIsFormOpen(false);
  };

  const handleGenerateReply = async (review: Review) => {
    try {
      const reply = await generateMerchantReply(review);
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, merchantReply: reply } : r));
    } catch (err) {
      console.error("Failed to generate AI reply", err);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Revie<span className="text-indigo-600">AI</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Products</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Categories</a>
              <a href="#" className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pt-1">Reviews Hub</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMerchantMode(!isMerchantMode)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                isMerchantMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isMerchantMode ? 'MERCHANT ON' : 'BUYER MODE'}
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/100/100?random=1" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span>Home</span>
          <ChevronDown size={12} className="-rotate-90" />
          <span>{product.category}</span>
          <ChevronDown size={12} className="-rotate-90" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="relative group">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white text-gray-700 transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white text-gray-700 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{product.brand}</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">In Stock</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.averageRating} size={20} />
                <span className="font-bold text-gray-900 text-lg">{product.averageRating}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <a href="#reviews" className="text-sm font-medium text-indigo-600 hover:underline">
                {reviews.length} Verified Reviews
              </a>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-3xl font-black text-gray-900">${product.price}</span>
              <span className="text-gray-400 line-through text-lg">$349.99</span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">15% OFF</span>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200">
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="flex-1 border-2 border-gray-200 text-gray-900 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <Package size={20} />
                Product Details
              </button>
            </div>
          </div>
        </div>

        {/* AI & Statistics Divider */}
        <div id="reviews" className="flex items-center justify-between mb-8 pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">Customer Feedback</h2>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} />
            Post Review
          </button>
        </div>

        <ReviewStats reviews={reviews} />
        <div className="mb-12">
          <AISummary data={aiSummary} isLoading={isSummarizing} />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 sticky top-[65px] bg-gray-50/95 backdrop-blur py-4 z-30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 cursor-pointer shadow-sm">
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={14} />
              </div>
            </div>
            
            <div className="relative flex-1 md:flex-none">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 cursor-pointer shadow-sm">
                <ArrowUpDown size={16} />
                <select 
                  className="bg-transparent border-none outline-none appearance-none pr-6 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="most_helpful">Most Helpful</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                isMerchant={isMerchantMode}
                onGenerateReply={handleGenerateReply}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {isFormOpen && (
        <ReviewForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleAddReview} 
        />
      )}

      {/* Footer Branding */}
      <footer className="mt-20 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-xl font-black tracking-tight">Revie<span className="text-indigo-400">AI</span></span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              The world's most advanced product review platform. Powered by Gemini to bring you honest, summarized, and smart insights from real customers.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">For Merchants</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
          <p>© 2024 RevieAI Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built with Gemini Flash</span>
            <div className="w-px h-3 bg-gray-700"></div>
            <span>Powered by React 18</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
