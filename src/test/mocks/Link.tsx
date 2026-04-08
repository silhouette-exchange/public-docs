import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
}

export default function Link({ to, href, children, ...rest }: LinkProps) {
  return (
    <a href={to ?? href} {...rest}>
      {children}
    </a>
  );
}
