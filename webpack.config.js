
module.exports = {
    output: {
        filename: 'app-bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: "style!css!autoprefixer-loader!sass"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel"
        }]
    }
};