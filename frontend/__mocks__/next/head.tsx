import React from 'react';
import ReactDOM from 'react-dom';

interface HeadProps {
  children?: React.ReactNode;
}

const Head = ({ children }: HeadProps) => {
  // Portal children into actual document.head so meta/title elements work correctly
  return ReactDOM.createPortal(children, document.head);
};

export default Head;
module.exports = Head;
module.exports.default = Head;
