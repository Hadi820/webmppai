import React from 'react';

export const IdentificationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
    >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 12.75c-2.43 0-4.62.866-6.346 2.376a8.455 8.455 0 00-.73 8.163A17.91 17.91 0 0112 21.75a17.91 17.91 0 016.076-1.461 8.455 8.455 0 00-.73-8.163C16.62 13.616 14.43 12.75 12 12.75z" 
        clipRule="evenodd" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.25 8.25h19.5" 
    />
  </svg>
);
