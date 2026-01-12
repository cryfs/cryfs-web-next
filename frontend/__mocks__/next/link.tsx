import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
  legacyBehavior?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
}

const Link = ({
  children,
  href,
  legacyBehavior,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  locale,
  ...props
}: LinkProps) => {
  // Filter out Next.js-specific props that shouldn't be passed to DOM elements
  return React.createElement(
    'a',
    { href, ...props },
    children
  );
};

export default Link;
module.exports = Link;
module.exports.default = Link;
