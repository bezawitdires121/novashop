"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string | null; imageUrl: string | null };
};

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={interactive ? 24 : 16}
            className={
              star <= (hovered || rating)
                ? "fill-[#6272f6] text-[#6272f6]"
                : "fill-gray-700 text-gray-700"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { isSignedIn, user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });

  const loadReviews = () => {
    fetch("/api/reviews?productId=" + productId)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setForm({ rating: 0, title: "", comment: "" });
      setShowForm(false);
      loadReviews();
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col md:flex-row gap-8 mb-10 p-6 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-6xl font-bold text-white">{avgRating.toFixed(1)}</span>
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-gray-500 mt-1">{reviews.length} reviews</span>
          </div>
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-4">{star}</span>
                <Star size={14} className="fill-[#6272f6] text-[#6272f6]" />
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[#6272f6] rounded-full transition-all"
                    style={{ width: reviews.length > 0 ? (count / reviews.length) * 100 + "%" : "0%" }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      {isSignedIn && !showForm && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="mb-8 px-6 py-3 rounded-xl border border-[#6272f6]/50 text-[#8196fb] hover:bg-[#6272f6]/10 transition-colors text-sm font-medium"
        >
          Write a Review
        </motion.button>
      )}

      {!isSignedIn && (
        <p className="text-gray-500 text-sm mb-8">
          <a href="/sign-in" className="text-[#6272f6] hover:underline">Sign in</a> to leave a review.
        </p>
      )}

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="mb-8 p-6 rounded-2xl border border-white/10"
            style={{ background: "rgba(98,114,246,0.05)" }}
          >
            <h3 className="font-semibold mb-4">Your Review</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Rating</p>
              <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} interactive />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Review title (optional)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white transition-colors"
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Share your experience with this product..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Review list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <Star size={40} className="mx-auto mb-3 text-gray-700" />
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#6272f6]/20 flex items-center justify-center flex-shrink-0">
                  {review.user.imageUrl ? (
                    <img src={review.user.imageUrl} alt={review.user.name || ""} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-[#6272f6]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-white">{review.user.name || "Anonymous"}</span>
                    {review.isVerified && (
                      <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle size={11} />
                        Verified Purchase
                      </span>
                    )}
                    <span className="text-xs text-gray-600">{formatDate(review.createdAt)}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.title && <p className="font-semibold mt-2">{review.title}</p>}
                  {review.comment && <p className="text-gray-400 text-sm mt-1 leading-relaxed">{review.comment}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}