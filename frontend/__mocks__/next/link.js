const React = require('react');

const Link = ({ children, href, legacyBehavior, passHref, prefetch, replace, scroll, shallow, locale, ...props }) => {
  // Filter out Next.js-specific props that shouldn't be passed to DOM elements
  return React.createElement(
    'a',
    { href, ...props },
    children
  );
};

module.exports = Link;
module.exports.default = Link;
