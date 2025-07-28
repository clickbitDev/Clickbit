import React from 'react';
import DOMPurify from 'dompurify';

interface SecureHtmlRendererProps {
  content: string;
  className?: string;
}

const SecureHtmlRenderer: React.FC<SecureHtmlRendererProps> = ({ content, className = '' }) => {
  // Configure DOMPurify to allow safe HTML tags and attributes
  const cleanHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'div', 'span',
      'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title', 'width', 'height',
      'class', 'id',
      'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    USE_PROFILES: { html: true }
  });

  return (
    <div 
      className={`prose dark:prose-invert max-w-none blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
      style={{
        // Custom CSS for blog content
        '--tw-prose-body': 'rgb(55 65 81)', // gray-700
        '--tw-prose-headings': 'rgb(17 24 39)', // gray-900
        '--tw-prose-lead': 'rgb(55 65 81)', // gray-700
        '--tw-prose-links': '#1FBBD2', // primary color
        '--tw-prose-bold': 'rgb(17 24 39)', // gray-900
        '--tw-prose-counters': 'rgb(107 114 128)', // gray-500
        '--tw-prose-bullets': 'rgb(209 213 219)', // gray-300
        '--tw-prose-hr': 'rgb(229 231 235)', // gray-200
        '--tw-prose-quotes': 'rgb(17 24 39)', // gray-900
        '--tw-prose-quote-borders': 'rgb(229 231 235)', // gray-200
        '--tw-prose-captions': 'rgb(107 114 128)', // gray-500
        '--tw-prose-code': 'rgb(17 24 39)', // gray-900
        '--tw-prose-pre-code': 'rgb(229 231 235)', // gray-200
        '--tw-prose-pre-bg': 'rgb(17 24 39)', // gray-900
        '--tw-prose-th-borders': 'rgb(209 213 219)', // gray-300
        '--tw-prose-td-borders': 'rgb(229 231 235)', // gray-200
        // Dark mode colors
        '--tw-prose-invert-body': 'rgb(209 213 219)', // gray-300
        '--tw-prose-invert-headings': 'rgb(255 255 255)', // white
        '--tw-prose-invert-lead': 'rgb(156 163 175)', // gray-400
        '--tw-prose-invert-links': '#1FBBD2', // primary color
        '--tw-prose-invert-bold': 'rgb(255 255 255)', // white
        '--tw-prose-invert-counters': 'rgb(156 163 175)', // gray-400
        '--tw-prose-invert-bullets': 'rgb(75 85 99)', // gray-600
        '--tw-prose-invert-hr': 'rgb(55 65 81)', // gray-700
        '--tw-prose-invert-quotes': 'rgb(243 244 246)', // gray-100
        '--tw-prose-invert-quote-borders': 'rgb(55 65 81)', // gray-700
        '--tw-prose-invert-captions': 'rgb(156 163 175)', // gray-400
        '--tw-prose-invert-code': 'rgb(255 255 255)', // white
        '--tw-prose-invert-pre-code': 'rgb(209 213 219)', // gray-300
        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.5)',
        '--tw-prose-invert-th-borders': 'rgb(75 85 99)', // gray-600
        '--tw-prose-invert-td-borders': 'rgb(55 65 81)', // gray-700
      } as React.CSSProperties}
    />
  );
};

export default SecureHtmlRenderer; 