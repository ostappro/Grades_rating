const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require("dotenv").config()

let mode = "production"
if (process.env.NODE_ENV == "dev") mode = "development"
const devtool = (mode == "development") ? "inline-source-map" : undefined
const optimization = (mode == "development") ? undefined : {
    namedModules: false,
    namedChunks: false,
    nodeEnv: 'production',
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    noEmitOnErrors: true,
    checkWasmTypes: true,
    minimize: true,
}

module.exports = {
	mode,
	devtool,
	optimization,
	entry: {
		app: './src/app/app.tsx',
		login: './src/app/login.ts',
	},
	output: {
		path: path.resolve(__dirname, 'out/app'),
		filename: '[name].js'
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			}, {
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].css'
		})
	]
};
