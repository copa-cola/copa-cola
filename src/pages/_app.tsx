import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from '@next/font/google'
import { SessionProvider } from 'next-auth/react'

const poppins = Poppins({ weight: ['300', '400', '500', '700'], subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<style jsx global>
				{`
					:root {
						--poppins: ${poppins.style.fontFamily};
					}
				`}
			</style>
			<SessionProvider>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	)
}
