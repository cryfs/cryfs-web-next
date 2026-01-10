const React = require('react');

const Head = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

module.exports = Head;
module.exports.default = Head;
