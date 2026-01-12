import React from 'react';

interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  children?: React.ReactNode;
}

const Script = ({ children, ...props }: ScriptProps) => {
  return React.createElement('script', props, children);
};

export default Script;
module.exports = Script;
(module.exports as { default: typeof Script }).default = Script;
