/**
* Learning Data Visualization With D3.js, Second Edition
*
* Ændrew Rininsland, <aendrew@aendrew.com>
*
* This is the Webpack configuration file. Webpack is used both as a task runner
* and also a module bundler. This is why we can use snazzy NodeJS-style `require`
* statements and also ES6 module definitions.
*/

const path = require('path');
module.exports = [
  {
    output: { // Transpiled and bundled output gets put in `build/bundle.js`.
      path: path.resolve(__dirname, 'build'),
      publicPath: '/assets/', // But it gets served as "assets" for testing purposes.
      filename: 'bundle.js',   // Really, you want to upload index.html and assets/bundle.js
    },

    devtool: 'inline-source-map',

    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: [/(node_modules|bower_components)/],
          loader: 'ts-loader',
        },
        {
          test: /\.js?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
      ],
    },
  },
];
