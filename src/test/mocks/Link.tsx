import React, { type ComponentProps } from 'react';

type LinkProps = ComponentProps<'a'> & {
  to?: string;
};

export default function Link({ to, href, children, ...rest }: LinkProps) {
  return (
    <a href={to ?? href} {...rest}>
      {children}
    </a>
  );
}
