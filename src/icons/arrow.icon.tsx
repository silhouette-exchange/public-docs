import React from 'react';

interface ArrowIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
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
      d="M7.15869 17.5L17.1587 7.5" 
      stroke="currentcolor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7.15869 7.5H17.1587V17.5" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
