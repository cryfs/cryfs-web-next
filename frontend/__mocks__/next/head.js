const React = require('react');

const Head = ({ children }) => {
  // Render children into a div so tests can query them
  return React.createElement('div', { 'data-testid': 'next-head' }, children);
};

module.exports = Head;
module.exports.default = Head;
