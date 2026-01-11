const React = require('react');

const Head = ({ children }) => {
  // In test environment, we need to handle meta tags specially
  // This mock renders children as a fragment, which works with React 18
  // For React 19, we need additional handling in the test setup
  return React.createElement(React.Fragment, null, children);
};

module.exports = Head;
module.exports.default = Head;
