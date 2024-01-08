const path = require('path')

module.exports = {
	entry: './static/dashb/dockviewer_app.js',
	output: {
		filename: 'viewer_bundle.js',
		path: path.resolve(__dirname, 'static', 'dashb')
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
			}
		]
	},
};
