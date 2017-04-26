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
    // name: 'client',
    entry: {
      app: ['./lib/main.js'], // This is the main file that gets loaded first; the "bootstrap", if you will.
    },

    output: { // Transpiled and bundled output gets put in `build/bundle.js`.
      path: path.resolve(__dirname, 'build'),
      publicPath: '/assets/', // But it gets served as "assets" for testing purposes.
      filename: 'bundle.js',   // Really, you want to upload index.html and assets/bundle.js
    },

    // This makes it easier to debug scripts by listing line number of whichever file
    // threw the exception or console.log or whathaveyounot.
    devtool: 'inline-source-map',
    // devtool: 'cheap-module-eval-source-map',
    // devtool: 'eval-source-map',

    module: {
      rules: [
        // {
        //   test: /\.js$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/,
        // },
        {
          test: /\.ts?$/, // Another convention is to use the .es6 filetype, but you then
          // have to supply that explicitly in import statements, which isn't cool.
          exclude: [/(node_modules|bower_components)/],
          loader: 'ts-loader',
          // loaders: ['babel-loader', 'ts-loader'],
        },
        {
          test: /\.js?$/, // Another convention is to use the .es6 filetype, but you then
          // have to supply that explicitly in import statements, which isn't cool.
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        // This nifty bit of magic right here allows us to load entire JSON files
        // synchronously using `require`, just like in NodeJS.
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        // This allows you to `require` CSS files.
        // We be in JavaScript land here, baby! No <style> tags for us!
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
      ],
    },
  },
  // {
  //   name: 'server',
  //   entry: {
  //     app: ['./lib/chapter8/index.js'],
  //   },
  //
  //   target: 'node',
  //
  //   output: { // Transpiled and bundled output gets put in `build/server.bundle.js`.
  //     path: path.resolve(__dirname, 'build'),
  //     filename: 'server.js',
  //   },
  //
  //   externals: {
  //     'canvas-prebuilt': 'commonjs canvas-prebuilt'
  //   },
  //
  //   devtool: 'inline-source-map',
  //
  //   module: {
  //     rules: [
  //       // {
  //       //   test: /\.js$/,
  //       //   loader: 'eslint-loader',
  //       //   exclude: /node_modules/
  //       // },
  //       {
  //         test: /\.js?$/, // Another convention is to use the .es6 filetype, but you then
  //         // have to supply that explicitly in import statements, which isn't cool.
  //         exclude: /(node_modules|bower_components)/,
  //         loader: 'babel-loader',
  //       },
  //       // This nifty bit of magic right here allows us to load entire JSON files
  //       // synchronously using `require`, just like in NodeJS.
  //       {
  //         test: /\.json$/,
  //         loader: 'json-loader',
  //       },
  //     ],
  //   },
  // }
];
