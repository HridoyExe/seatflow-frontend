import React, { useState } from 'react';
import { Star, MessageSquare, Send, User, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useItemReviews, usePostReview } from '../../hooks/useMenuItems';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ReviewSection = ({ itemId }) => {
  const { user } = useAuth();
  
  const { data: reviewsData, isLoading, isError } = useItemReviews(itemId);
  const reviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.results || []);
  const postReviewMutation = usePostReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a review");
      return;
    }

    try {
      await postReviewMutation.mutateAsync({
        itemPk: itemId,
        reviewData: { rating, comment }
      });
      setComment('');
      setRating(5);
    } catch (err) {
      // Error is handled in the mutation onSuccess/onError
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(s)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${
              s <= count ? 'text-amber-400' : 'text-slate-200'
            }`}
          >
            <Star size={interactive ? 24 : 16} fill={s <= count ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500">Loading guest feedback...</p>
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-slate-100 pt-16">
      <div className="flex flex-col lg:flex-row gap-12">
        
        <div className="lg:w-2/3">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-orange-500" size={28} />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Guest Experiences</h2>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-bold">
              {reviews.length}
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-slate-50/50 rounded-3xl p-10 text-center border border-dashed border-slate-200">
               <p className="text-slate-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
                        {review.user_image ? (
                          <img src={review.user_image} alt={review.user_name} className="w-full h-full object-cover" />
                        ) : (
                          review.user_name?.charAt(0) || <User size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{review.user_name || 'Guest'}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <Calendar size={12} />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Leave a Review</h3>
                <p className="text-slate-400 text-sm mb-6">Tell us about your culinary journey with this dish.</p>

                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Your Rating</label>
                      {renderStars(rating, true)}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Your Thoughts</label>
                      <textarea
                        required
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you love about it?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                      ></textarea>
                    </div>

                    {postReviewMutation.isError && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-shake">
                        <AlertCircle size={14} />
                        {(() => {
                           const errorData = postReviewMutation.error?.response?.data;
                           if (typeof errorData === 'string') return errorData;
                           if (Array.isArray(errorData)) return errorData[0];
                           if (typeof errorData === 'object' && errorData !== null) {
                             return Object.values(errorData).flat()[0] || "Something went wrong.";
                           }
                           return "Something went wrong.";
                        })()}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={postReviewMutation.isPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {postReviewMutation.isPending ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <><Send size={18} /> Share Experience</>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-slate-400 text-sm mb-4">Please log in to leave a review for this dish.</p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-white text-slate-900 font-bold py-2 px-6 rounded-full text-sm hover:bg-slate-100 transition-colors"
                    >
                      Log In Now
                    </button>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReviewSection;
