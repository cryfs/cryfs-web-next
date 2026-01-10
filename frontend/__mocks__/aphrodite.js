const StyleSheet = {
  create: (styles) => styles,
  rehydrate: jest.fn(),
};

const css = (...args) =>
  args
    .filter(Boolean)
    .map((arg) => (typeof arg === 'object' ? Object.keys(arg).join(' ') : ''))
    .join(' ');

module.exports = {
  StyleSheet,
  css,
};
