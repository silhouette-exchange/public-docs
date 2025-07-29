import React from 'react';

interface InfoIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  width = 25,
  height = 25,
  className
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 25 25" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12.1587 22.5C17.6815 22.5 22.1587 18.0228 22.1587 12.5C22.1587 6.97715 17.6815 2.5 12.1587 2.5C6.63584 2.5 2.15869 6.97715 2.15869 12.5C2.15869 18.0228 6.63584 22.5 12.1587 22.5Z" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12.1587 16.5V12.5" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12.1587 8.5H12.1687" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
