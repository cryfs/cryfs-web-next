const React = require('react');

const Script = ({ children, ...props }) => {
  return React.createElement('script', props, children);
};

module.exports = Script;
module.exports.default = Script;
