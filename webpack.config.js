const path = require('path');

module.exports = {

  mode: 'production',

  entry: './src/index.js',

  output: {

    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {

    contentBase: path.join(__dirname, "dist"),
    port: 9000,
    watchContentBase: true,
    progress: true
  },

  module: {
    rules: [

      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },

      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};
