import Image from 'next/image'
import { Header } from '../components/header'
import { NextSeo } from 'next-seo'
import { Ad } from '../components/ad'
import { useSession } from 'next-auth/react'

type Props = {
	balance: number
}

export default function _({ balance }: Props) {
	return (
		<>
			<NextSeo
				title="TuriStar"
				description="Turistar é o seu album de figurinhas online, é possivel realizar operações desde trocas até compras."
				additionalLinkTags={[
					{
						rel: 'apple-touch-icon',
						sizes: '180x180',
						href: '/apple-touch-icon.png',
					},
					{
						rel: 'icon',
						type: 'image/png',
						sizes: '32x32',
						href: '/favicon-32x32.png',
					},
					{
						rel: 'icon',
						type: 'image/png',
						sizes: '16x16',
						href: '/favicon-16x16.png',
					},
					{
						rel: 'manifest',
						href: '/site.webmanifest',
					},
					{
						rel: 'mask-icon',
						href: '/safari-pinned-tab.svg',
						color: '#5bbad5',
					},
				]}
				additionalMetaTags={[
					{
						name: 'msapplication-TileColor',
						content: '#da532c',
					},
					{
						name: 'theme-color',
						content: '#ffffff',
					},
				]}
			/>
			<Header balance={balance} />

			<main>
				<section className="max-w-[1220px] mx-auto mt-56">
					<div className="flex space-x-16">
						<div className="font-inter space-y-4 max-w-[570px] w-full">
							<h2 className="text-7xl font-bold leading-[93px]">Negocie as suas Figurinhas</h2>
							<p className="text-3xl font-medium leading-[35px] w-[90%]">
								Turistar é o seu album de figurinhas online, é possivel realizar operações
								desde trocas até compras.
							</p>
						</div>
						<Image src="/home-image.png" alt="" width={568} height={400} unoptimized />
					</div>
				</section>

				<Ad urlImage="/ad.png" className="mx-auto mt-12" />
			</main>
		</>
	)
}

export async function getServerSideProps() {
	return {
		props: {
			balance: 123.09,
		},
	}
}
