import React from 'react';

interface CompassLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompassLogo: React.FC<CompassLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <div className={`relative ${dimensions[size]} ${className}`}>
      <div className="absolute inset-0 bg-[#F28705] rounded-sm transform rotate-45"></div>
      <div className="absolute inset-[15%] border-2 border-white rounded-sm transform rotate-45"></div>
      <div className="absolute inset-[35%] bg-[#F28705] rounded-sm transform rotate-45"></div>
    </div>
  );
};

// SVG version of the logo for more consistent rendering
export const CompassLogoSVG: React.FC<CompassLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <svg 
      viewBox="0 0 40 40" 
      className={`${dimensions[size]} ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(45 20 20)">
        <rect x="4" y="4" width="32" height="32" fill="#F28705" />
        <rect x="8" y="8" width="24" height="24" stroke="white" strokeWidth="2" fill="none" />
        <rect x="14" y="14" width="12" height="12" fill="#F28705" />
      </g>
    </svg>
  );
};

export default CompassLogo;
