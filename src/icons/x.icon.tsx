import React from 'react';

interface XIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const XIcon: React.FC<XIconProps> = ({
  width = 37,
  height = 36,
  className
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 37 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M21.5841 15.2453L34.977 0H31.8044L20.1705 13.2346L10.8855 0H0.173584L14.2175 20.0149L0.173584 36H3.34614L15.6239 22.0208L25.4317 36H36.1436M4.49119 2.34285H9.36512L31.802 33.7723H26.9269" 
      fill="currentColor"
    />
  </svg>
);