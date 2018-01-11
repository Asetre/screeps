const path = require('path')

module.exports = {
    entry: `${path.join(__dirname, 'index.js')}`,
    output: {
        path: __dirname,
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    }
}
