import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

	theme: {
		extend: {
			colors: {
				primary: colors.sky,
				secondary: colors.emerald,
			},
			animation: {
				dropIn: 'dropIn 0.2s ease-out',
			},
			keyframes: {
				dropIn: {
					'0%': { transform: 'translateY(-100px)' },
					'100%': { transform: 'translateY(0)' },
				},
			},
		},
	},


	plugins: [
		require('@tailwindcss/forms'),
	],
}
