const path = require('path')

module.exports = {
	entry: './static/jobs/chains.ts',
	output: {
		filename: 'chains_bundle.js',
		path: path.resolve(__dirname, 'static', 'jobs')
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: [
					'html-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
	}
};
