import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins, Inter } from '@next/font/google'
import { SessionProvider } from 'next-auth/react'

const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })
const inter = Inter({ weight: ['400', '700'], subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider>
			<style jsx global>
				{`
					:root {
						--poppins: ${poppins.style.fontFamily};
						--inter: ${inter.style.fontFamily};
					}
				`}
			</style>
			<Component {...pageProps} />
		</SessionProvider>
	)
}
