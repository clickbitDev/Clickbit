import React from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SecureHtmlRendererProps {
  content: string;
  className?: string;
  contentType?: 'html' | 'markdown';
}

const SecureHtmlRenderer: React.FC<SecureHtmlRendererProps> = ({ 
  content, 
  className = '', 
  contentType = 'html' 
}) => {
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

  // If content type is markdown, render with ReactMarkdown
  if (contentType === 'markdown') {
    return (
      <div className={`blog-content ${className}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom components for better styling
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            a: ({ href, children }) => (
              <a href={href} className="text-[#1FBBD2] underline hover:text-[#168A99]">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
            th: ({ children }) => (
              <th className="px-4 py-2 text-left font-semibold text-gray-900">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 text-gray-700">
                {children}
              </td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#1FBBD2] pl-4 italic bg-gray-50 py-2 mb-4">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // For HTML content, use the existing DOMPurify approach
  return (
    <div 
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default SecureHtmlRenderer; 