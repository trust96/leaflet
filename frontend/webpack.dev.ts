import { merge } from 'webpack-merge';
import path from 'path';

import common from './webpack.common';
import { Configuration } from 'webpack';

const config: Configuration = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
});
export default config;
