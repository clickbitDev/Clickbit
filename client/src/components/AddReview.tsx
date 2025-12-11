import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewsAPI } from '../services/api';

const AddReview: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !rating || !reviewText) {
      setError('Please fill in all required fields and select a rating.');
      return;
    }
    setLoading(true);
    try {
      await reviewsAPI.submit({
        name,
        email,
        company,
        position,
        rating,
        review_text: reviewText,
        service_type: serviceType,
        project_type: projectType
      });
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setCompany('');
      setPosition('');
      setRating(0);
      setReviewText('');
      setServiceType('');
      setProjectType('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
              <h3 className="text-lg font-medium">Thank you for your review!</h3>
              <p className="mt-2">Your feedback has been submitted successfully and will be reviewed before being published.</p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-gray-900"
            >
              Submit Another Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Leave a Review
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Your Company"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="CEO, Manager, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    id="serviceType"
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="E-commerce Solutions">E-commerce Solutions</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Design & Branding">Design & Branding</option>
                    <option value="Custom Web Applications">Custom Web Applications</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Type
                  </label>
                  <input
                    type="text"
                    name="projectType"
                    id="projectType"
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Website, App, Marketing Campaign, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <Star
                        key={starValue}
                        size={32}
                        className="cursor-pointer transition-colors duration-200"
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                        fill={starValue <= (hoverRating || rating) ? '#F39C12' : 'none'}
                        stroke={starValue <= (hoverRating || rating) ? '#F39C12' : 'currentColor'}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Share your experience with ClickBit. What did you like? How did we help your business?"
                  required
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview; 