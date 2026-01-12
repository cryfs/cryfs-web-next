const React = require('react');
const ReactDOM = require('react-dom');

const Head = ({ children }) => {
  // Portal children into actual document.head so meta/title elements work correctly
  return ReactDOM.createPortal(children, document.head);
};

module.exports = Head;
module.exports.default = Head;
