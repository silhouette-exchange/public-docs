import React from 'react';

interface QuestionMarkIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const QuestionMarkIcon: React.FC<QuestionMarkIconProps> = ({
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
      d="M9.24866 9.50008C9.48376 8.83175 9.94781 8.26819 10.5586 7.90921C11.1694 7.55024 11.8876 7.41902 12.5858 7.53879C13.2841 7.65857 13.9175 8.02161 14.3737 8.56361C14.83 9.10561 15.0797 9.7916 15.0787 10.5001C15.0787 12.5001 12.0787 13.5001 12.0787 13.5001" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12.1587 17.5H12.1687" 
      stroke="currentcolor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
