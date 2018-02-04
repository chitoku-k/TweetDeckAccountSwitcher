import path from "path";
import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import GenerateJsonPlugin from "generate-json-webpack-plugin";
import ZipPlugin from "zip-webpack-plugin";

module.exports = {
    entry: {
        "js/inject": "./src/js/inject.js",
        "js/content": "./src/js/content.js",
    },
    output: {
        path: path.join(__dirname, "/dist", process.env.BROWSER),
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
        ]),
        new GenerateJsonPlugin(
            "manifest.json",
            require(path.join(__dirname, "/src/manifests/", process.env.BROWSER)).default,
            null,
            4,
        ),
        new CleanPlugin(
            path.join(__dirname, "/dist", process.env.BROWSER, "/**"),
        ),
        new ZipPlugin({
            path: path.join(__dirname, "/dist", process.env.BROWSER),
            filename: "extension",
            extension: { firefox: "xpi" }[process.env.BROWSER],
        }),
    ],
};
