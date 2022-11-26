/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'purecatamphetamine.github.io',
			'lh3.googleusercontent.com',
			'i.imgur.com',
			'avatars.githubusercontent.com',
		],
	},
}

module.exports = nextConfig
