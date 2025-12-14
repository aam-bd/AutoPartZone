import React, { useState } from 'react';

// --- Placeholder Review Data ---
const mockReviews = [
    { id: 101, user: "Alex J.", date: "2025-10-15", rating: 5, title: "Fantastic Coilovers!", text: "Vastly improved my car's handling. Easy to adjust and the ride quality is surprisingly good for performance suspension." },
    { id: 102, user: "Mike S.", date: "2025-09-28", rating: 4, title: "Great value, solid build", text: "Took a bit of time to dial in the settings, but for the price, these are unbeatable. Would buy again." },
    { id: 103, user: "Sarah K.", date: "2025-08-01", rating: 5, title: "Perfect Fit!", text: "As promised, this fit my specific vehicle model without any issues. Packaging was excellent." },
];

// Utility function to calculate review summary
const calculateReviewSummary = (reviews) => {
    if (reviews.length === 0) return { average: 0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    
    const total = reviews.length;
    let sum = 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
        sum += review.rating;
        counts[review.rating]++;
    });
    
    const average = (sum / total).toFixed(1);
    
    return { average, total, counts };
};

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState(mockReviews);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', text: '' });
    const { average, total, counts } = calculateReviewSummary(reviews);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReview.title || !newReview.text) {
            alert("Please fill in both the title and the review text.");
            return;
        }

        const submittedReview = {
            id: Date.now(),
            user: "You (Pending Approval)",
            date: new Date().toISOString().split('T')[0],
            rating: newReview.rating,
            title: newReview.title,
            text: newReview.text,
        };

        setReviews([submittedReview, ...reviews]);
        setNewReview({ rating: 5, title: '', text: '' });
        alert("Your review has been submitted for approval!");
    };

    const RatingBar = ({ rating, count, total }) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8 text-gray-700">{rating} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
            </div>
        );
    };

    return (
        <div className="my-12">
            <h2 className="text-3xl font-extrabold text-gray-900 border-b-2 border-red-600 pb-2 mb-8">
                Customer Reviews ({total})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Review Summary */}
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Overall Rating</h3>
                    <div className="text-center mb-6">
                        <p className="text-6xl font-extrabold text-red-600">{average}</p>
                        <div className="text-yellow-500 text-3xl my-1">
                            {'★'.repeat(Math.round(average))}{'☆'.repeat(5 - Math.round(average))}
                        </div>
                        <p className="text-gray-500">Based on {total} reviews</p>
                    </div>

                    <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(r => (
                            <RatingBar key={r} rating={r} count={counts[r]} total={total} />
                        ))}
                    </div>
                </div>

                {/* 2. List of Reviews */}
                <div className="md:col-span-2 space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-800">{review.user}</span>
                                <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="text-yellow-500 text-lg mb-2">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <h4 className="text-lg font-bold mb-1">{review.title}</h4>
                            <p className="text-gray-700">{review.text}</p>
                        </div>
                    ))}
                    {total === 0 && <p className="text-gray-500">Be the first to leave a review for this product!</p>}
                </div>
            </div>

            {/* 3. Leave a Review Form */}
            <div className="mt-12 p-8 border rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    
                    {/* Rating Selector */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Your Rating</label>
                        <select 
                            value={newReview.rating} 
                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                            className="p-3 border rounded-lg w-full md:w-1/3"
                            required
                        >
                            <option value={5}>5 Stars (Excellent)</option>
                            <option value={4}>4 Stars (Very Good)</option>
                            <option value={3}>3 Stars (Average)</option>
                            <option value={2}>2 Stars (Poor)</option>
                            <option value={1}>1 Star (Terrible)</option>
                        </select>
                    </div>
                    
                    {/* Review Title */}
                    <div>
                        <label htmlFor="reviewTitle" className="block text-gray-700 font-semibold mb-2">Review Title</label>
                        <input 
                            id="reviewTitle"
                            type="text" 
                            placeholder="e.g., Great value, amazing quality"
                            value={newReview.title}
                            onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                            className="p-3 border rounded-lg w-full focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>

                    {/* Review Text */}
                    <div>
                        <label htmlFor="reviewText" className="block text-gray-700 font-semibold mb-2">Your Review</label>
                        <textarea 
                            id="reviewText"
                            placeholder="Describe your experience with the product..."
                            rows="5"
                            value={newReview.text}
                            onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                            className="p-3 border rounded-lg w-full focus:ring-red-500 focus:border-red-500"
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
                    >
                        Submit Review
                    </button>
                </form>
            </div>

        </div>
    );
};

export default ProductReviews;