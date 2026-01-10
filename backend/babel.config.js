const pkg = require('./package.json');
const nodeVersion = pkg.engines.node.replace('.x', '');

module.exports = {
  comments: false,
  presets: [
    ['@babel/preset-env', { modules: false, targets: { node: nodeVersion } }]
  ],
  plugins: ['@babel/plugin-transform-class-properties'],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ]
    }
  }
};
