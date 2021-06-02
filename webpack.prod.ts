import { merge } from 'webpack-merge';
import path from 'path';
import { Configuration } from 'webpack';
// eslint-disable-next-line import/no-unresolved
import common from './webpack.common';

const config: Configuration = merge(common, {
  mode: 'production',
  devtool: 'source-map', // inline-- or eval-- increase the bundle size
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
});
export default config;
