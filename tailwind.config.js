const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['var(--poppins)', ...defaultTheme.fontFamily.sans],
				inter: ['var(--inter)', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
}
