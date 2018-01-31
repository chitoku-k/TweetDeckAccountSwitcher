import path from "path";
import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ZipPlugin from "zip-webpack-plugin";

module.exports = {
    entry: {
        "js/inject": "./src/js/inject.js",
        "js/content": "./src/js/content.js",
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                exclude: /node_modules/,
                use: [
                    { loader: "eslint-loader" },
                ],
            },
            {
                test: /\.js$/,
                enforce: "post",
                exclude: /node_modules/,
                use: [
                    { loader: "babel-loader" },
                ],
            },
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new CopyPlugin([
            {
                from: "img/*",
                context: "./src",
            },
            {
                from: "manifest.json",
                context: "./src",
            },
        ]),
        new CleanPlugin(
            path.join(__dirname, "/dist/**"),
        ),
        new ZipPlugin({
            path: path.join(__dirname, "/dist"),
            filename: "extension",
        }),
    ],
};
