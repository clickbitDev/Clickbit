import React from 'react';

const logos = [
  { src: '/images/logos/client-1.png', alt: 'Client Logo 1' },
  { src: '/images/logos/client-2.png', alt: 'Client Logo 2' },
  { src: '/images/logos/client-3.png', alt: 'Client Logo 3' },
  { src: '/images/logos/client-4.png', alt: 'Client Logo 4' },
  { src: '/images/logos/client-5.png', alt: 'Client Logo 5' },
  { src: '/images/logos/client-6.png', alt: 'Client Logo 6' },
  { src: '/images/logos/client-7.png', alt: 'Client Logo 7' },
];

const LogoCloud: React.FC = () => {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 sm:mx-4 md:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {duplicatedLogos.map((logo, index) => (
          <li key={index}>
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="h-16 sm:h-24 md:h-32 lg:h-48 grayscale brightness-90 contrast-125 hover:grayscale-0 hover:brightness-100 hover:contrast-100 transition-all duration-300" 
            />
          </li>
        ))}
      </ul>
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 sm:mx-4 md:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
        {duplicatedLogos.map((logo, index) => (
          <li key={index}>
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="h-16 sm:h-24 md:h-32 lg:h-48 grayscale brightness-90 contrast-125 hover:grayscale-0 hover:brightness-100 hover:contrast-100 transition-all duration-300" 
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogoCloud; 