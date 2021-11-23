// path — встроенный в Node.js модуль
const path = require('path');

module.exports = {
  // указываем путь до входной точки
  entry: './src/main.js',
  // описываем куда следует поместить результат работы
  output: {
    // путь до директории (важно использовать path.resolve)
    path: path.resolve(__dirname, 'public'),
    // имя файла со сборкой
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    // hot: false = hot: replace
    // hot - горячая перезагрузка модулей // возможность автоматической перезагрузки модуля если в него внесли изменения (??)
    hot: false
  },

  // взаимодействие с babel
  module: {
    rules: [
      {
        // когда webpack встречает файлы с расширением js
        test: /\.js$/,
        // исключая все файлы из директории:
        exclude: /(node_modules)/,
        // нужно передать их babel-loader-у
        use: ['babel-loader']
      }
    ]
  }
};
