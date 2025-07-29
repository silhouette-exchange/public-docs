import React from 'react';

interface BookIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BookIcon: React.FC<BookIconProps> = ({
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
    <path d="M2.15869 3.5H8.15869C9.21956 3.5 10.237 3.92143 10.9871 4.67157C11.7373 5.42172 12.1587 6.43913 12.1587 7.5V21.5C12.1587 20.7044 11.8426 19.9413 11.28 19.3787C10.7174 18.8161 9.95434 18.5 9.15869 18.5H2.15869V3.5Z" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.1587 3.5H16.1587C15.0978 3.5 14.0804 3.92143 13.3303 4.67157C12.5801 5.42172 12.1587 6.43913 12.1587 7.5V21.5C12.1587 20.7044 12.4748 19.9413 13.0374 19.3787C13.6 18.8161 14.363 18.5 15.1587 18.5H22.1587V3.5Z" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);
