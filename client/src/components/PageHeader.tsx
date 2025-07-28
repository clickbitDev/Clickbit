import React from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  name: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <div className="px-4 md:px-8">
      <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-4xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/patterns/page-header-bg.svg')`, opacity: 0.3 }}
        ></div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
          <div className="mt-4 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.name}>
                <Link to={crumb.href} className="hover:text-[#1FBBD2]">
                  {crumb.name}
                </Link>
                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 