import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../services/api';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/contact', {
        type: 'contact',
        ...data
      });
      
      // Track successful form submission as conversion
      if (typeof window.trackLead === 'function') {
        window.trackLead('contact_form');
      }
      
      // Track form submission event
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('form_submit', {
          form_name: 'contact_form',
          form_type: 'contact',
          page_location: window.location.pathname,
          conversion: true,
          conversion_value: 10 // Assign $10 value to contact form submissions
        });
      }
      
      // Track Meta Pixel Contact event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact');
      }
      
      setSuccess(true);
      reset();
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
        <h3 className="text-lg font-medium">Message sent successfully!</h3>
        <p className="mt-2">Thank you for contacting us. We'll get back to you soon.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-form-name="contact_form">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            {...register('firstName', { 
              required: 'First name is required',
              minLength: { value: 2, message: 'First name must be at least 2 characters' }
            })} 
            id="firstName" 
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.firstName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
            } bg-white dark:bg-gray-800`} 
          />
          {errors.firstName && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.firstName.message}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            {...register('lastName', { 
              required: 'Last name is required',
              minLength: { value: 2, message: 'Last name must be at least 2 characters' }
            })} 
            id="lastName" 
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.lastName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
            } bg-white dark:bg-gray-800`} 
          />
          {errors.lastName && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.lastName.message}
            </div>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input 
          type="email" 
          {...register('email', { 
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })} 
          id="email" 
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.email 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
          } bg-white dark:bg-gray-800`} 
        />
        {errors.email && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email.message}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number
        </label>
        <input 
          type="tel" 
          {...register('phone', {
            pattern: {
              value: /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{7,15}$/,
              message: 'Please enter a valid phone number'
            }
          })} 
          id="phone" 
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.phone 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
          } bg-white dark:bg-gray-800`} 
        />
        {errors.phone && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.phone.message}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea 
          {...register('message', { 
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters long' }
          })} 
          id="message" 
          rows={4} 
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.message 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
          } bg-white dark:bg-gray-800`}
        ></textarea>
        {errors.message && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.message.message}
          </div>
        )}
      </div>
      <div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full justify-center rounded-md border border-transparent bg-[#1FBBD2] py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-[#1A9DAA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm; 