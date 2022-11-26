import Image from 'next/image'
import { Header } from '../components/header'

type Props = {
	balance: number
	trades: {
		tradeId: string
		traderName: string
		traderImage: string
		wantItems: {
			image: string
			rarity: 'COMMON' | 'LEGENDARY'
		}[]
		giveItems: {
			image: string
			rarity: 'COMMON' | 'LEGENDARY'
		}[]
	}[]
}

export default function _({ balance, trades }: Props) {
	return (
		<>
			<Header balance={balance} />

			<main className="w-[min(1920px,95%)] mx-auto my-20 font-medium font-poppins divide-y-4 divide-white">
				{trades.map(({ tradeId, traderName, wantItems, giveItems }) => (
					<div
						key={tradeId}
						className="flex justify-center items-center bg-gray-100 p-12 shadow-xl space-x-7 rounded"
					>
						<div>
							<div className="mb-2">
								<strong className="text-2xl font-semibold mr-1">{traderName}</strong>
								quer trocar...
							</div>

							<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
								{giveItems.map(({ image, rarity }) => (
									<div
										key={image}
										className="w-[121px] h-[151px] flex justify-center items-center rounded"
										style={{
											backgroundColor: rarity
												? rarity === 'COMMON'
													? '#63C7FF'
													: '#F8BA1D'
												: '#f3f4f6',
											border: `2px solid ${
												rarity
													? rarity === 'COMMON'
														? '#0098ED'
														: '#B58200'
													: '#e5e7eb'
											}`,
											boxShadow: 'inset 0 0 5px 2px rgba(0,0,0,.1)',
										}}
									>
										{image ? (
											<Image src={image} alt="" width={100} height={130} unoptimized />
										) : null}
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col items-center space-y-4">
							<button className="text-lg px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors rounded">
								Trocar
							</button>
							<Image src="/arrow-right.png" alt="" width={75} height={45} unoptimized />
						</div>

						<div>
							<div className="mb-2">
								<strong className="text-2xl font-semibold mr-1 mb-2">Por</strong>
							</div>

							<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
								{wantItems.map(({ image, rarity }) => (
									<div
										key={image}
										className="w-[121px] h-[151px] flex justify-center items-center rounded"
										style={{
											backgroundColor: rarity
												? rarity === 'COMMON'
													? '#63C7FF'
													: '#F8BA1D'
												: '#f3f4f6',
											border: `2px solid ${
												rarity
													? rarity === 'COMMON'
														? '#0098ED'
														: '#B58200'
													: '#e5e7eb'
											}`,
											boxShadow: 'inset 0 0 5px 2px rgba(0,0,0,.1)',
										}}
									>
										{image ? (
											<Image src={image} alt="" width={100} height={130} unoptimized />
										) : null}
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</main>
		</>
	)
}

export async function getServerSideProps() {
	return {
		props: {
			balance: 123.09,
			trades: [
				{
					tradeId: '1',
					traderName: 'João 12',
					traderImage: 'https://i.imgur.com/8Q5ZQ9u.png',
					wantItems: [
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{},
					],

					giveItems: [
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
					],
				},
				{
					tradeId: '1',
					traderName: 'João',
					traderImage: 'https://i.imgur.com/8Q5ZQ9u.png',
					wantItems: [
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
					],

					giveItems: [
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'COMMON',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
						{
							image: '/pacote-figurinha.png',
							rarity: 'LEGENDARY',
						},
					],
				},
			],
		},
	}
}
