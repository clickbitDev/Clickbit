import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import InteractiveCard from './InteractiveCard';
import api from '../services/api';

interface Testimonial {
  id?: number;
  name: string;
  rating: number;
  quote: string;
  review_text?: string;
  company?: string;
  position?: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600'}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { name: 'turner', rating: 5, quote: "I needed a fresh look for my business website, and their team absolutely delivered." },
    { name: 'harris', rating: 5, quote: "I was skeptical at first, but after a few months with ClickBIT, my website traffic doubled." },
    { name: 'johnson', rating: 5, quote: "Professional service and excellent results. Highly recommend their team!" },
    { name: 'williams', rating: 5, quote: "They transformed our online presence completely. Amazing work!" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reviews?featured=true');
        if (response.data && response.data.length > 0) {
          const reviews = response.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            rating: r.rating || 5,
            quote: r.review_text,
            company: r.company,
            position: r.position
          }));
          setTestimonials(reviews);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        // Keep fallback data if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Loading testimonials...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Customer stories: hear<br/>
            <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">what others love</span> about<br/>
            our services!
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8 [perspective:1000px]">
          {testimonials.map((testimonial, index) => (
            <InteractiveCard key={testimonial.id || testimonial.name + index}>
              <div 
                className="bg-white dark:bg-[#1C1C1C] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col gap-3 md:gap-4 h-full overflow-hidden"
              >
                <div className="flex flex-col gap-2 [transform:translateZ(40px)]">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{testimonial.name}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  {(testimonial.company || testimonial.position) && (
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {testimonial.position && testimonial.company 
                        ? `${testimonial.position} at ${testimonial.company}`
                        : testimonial.position || testimonial.company
                      }
                    </p>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed [transform:translateZ(20px)] break-words overflow-hidden">
                  "{testimonial.quote || testimonial.review_text}"
                </p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 