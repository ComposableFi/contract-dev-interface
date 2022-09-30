/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.worker\.[jt]s$/,
			loader: 'worker-loader',
			// options: { inline: true }, // also works
			options: {
				name: 'static/[hash].worker.js',
				publicPath: '/_next/',
			},
		});
		// eslint-disable-next-line no-param-reassign
		config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';

		// eslint-disable-next-line no-param-reassign
		config.experiments = { ...config.experiments, asyncWebAssembly: true };
		return config;
	},
	reactStrictMode: true,
	swcMinify: true,
	trailingSlash: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = nextConfig;
