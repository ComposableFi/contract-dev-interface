/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		screens: {
			xl: '1920px',
			lg: '1600px',
			md: '1024px',
			sm: '768px',
			xs: '576px',
		},
		colors: {
			white: '#ffffff',
			black: '#000000',
			peppermint: '#34F56A',
			'peppermint.1': 'rgba(52, 245, 106, 0.1)',
			scarlet: '#EB2857',
			'scarlet.1': 'rgba(235, 40, 87, 0.1)',
			cerulean: '#35C2FF',
			'cerulean.1': 'rgba(53, 194, 255, 0.1)',
			india: 'rgba(251, 214, 52, 1)',
			'india.1': 'rgba(251, 214, 52, 0.1)',
			titanium: '#ffffff',
			'titanium.02': 'rgba(255,255,255,0.02)',
			'titanium.05': 'rgba(255,255,255,0.05)',
			'titanium.1': 'rgba(255,255,255,0.1)',
			'titanium.3': 'rgba(255,255,255,0.3)',
			'titanium.6': 'rgba(255,255,255,0.6)',
			explore: '#8C76FE',
			catch: '#231127',
			hexplore: '#6649FE',
			'hexplore-secondary': '#441FFF',
			'hexplore.1': 'rgba(102, 73, 254, 0.1)',
			'hexplore.05': 'rgba(102, 73, 254, 0.05)',
			'hexplore.15': 'rgba(102, 73, 254, 0.15)',
			'hexplore.3': 'rgba(102, 73, 254, 0.3)',
			// deep catch is .deep-catch defined in backgrounds.scss
			'grayish-catch': '#302F45',
			transparent: 'transparent',
		},
		fontFamily: {
			wavehaus: 'Wavehaus, ui-sans',
			metropolis: 'Metropolis, ui-sans-serif',
		},
		extend: {
			width: {
				lg: '1520px',
			},
			maxHeight: {
				0: '0',
			},
			rotate: {
				270: '270deg',
			},
		},
		boxShadow: {
			shadow: '0px 72px 121px rgba(0, 0, 0, 0.32)',
		},
	},
	// eslint-disable-next-line global-require,import/no-extraneous-dependencies
	plugins: [require('tailwind-scrollbar-hide'), require('@tailwindcss/line-clamp')],
};
