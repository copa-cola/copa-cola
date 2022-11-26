import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import { useAuth } from '../../hooks/auth'
import { userFromReq } from '../../utils/userFromReq'
import { getTrades, TradeOffer } from '../api/trades'

type Props = {
	balance: number
	trades: TradeOffer[]
}

export default function _({ balance, trades }: Props) {
	const { user } = useAuth()

	const handleSubmit = useCallback(async () => {}, [])

	return (
		<>
			<section className="flex flex-col w-[min(1920px,95%)] mx-auto my-20 font-medium font-poppins divide-y-4 divide-white">
				<Link href="/trades/new" className="ml-auto">
					Nova troca
				</Link>
				{trades.map(
					({
						id,
						seller: { name: sellerName, id: sellerId, image: sellerImage },
						itemsOffer,
						itemsWants,
						closedAt,
					}) => (
						<div
							style={closedAt ? { opacity: 0.2 } : {}}
							key={id}
							className="flex justify-center items-center bg-gray-100 p-12 shadow-xl space-x-7 rounded"
						>
							<div>
								<div className="mb-2 flex items-center">
									<Image
										src={sellerImage}
										alt=""
										width={50}
										height={50}
										unoptimized
										className="rounded-full mr-2"
									/>
									<strong className="text-2xl font-semibold mr-1">{sellerName}</strong> quer
									trocar...
								</div>

								<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
									{itemsOffer.map(({ item: { rarity }, item, itemId }) => (
										<div
											key={item.id}
											className="w-[121px] h-[151px] flex justify-center items-center rounded relative"
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
											{item.image ? (
												<Image
													src={`/${item.image}`}
													alt=""
													fill
													className="object-cover"
													unoptimized
												/>
											) : null}
											{/* <p className="text-[12px] text-center self-end">{item.name}</p> */}
										</div>
									))}
								</div>
							</div>

							<div className="flex flex-col items-center space-y-4">
								<button
									disabled={!!closedAt || sellerId === user?.id}
									className="text-lg px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors rounded"
								>
									Trocar
								</button>
								<Image src="/arrow-right.png" alt="" width={75} height={45} unoptimized />
							</div>

							<div>
								<div className="mb-2">
									<strong className="text-2xl font-semibold mr-1 mb-2">Por</strong>
								</div>

								<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
									{itemsWants.map(({ item, item: { rarity } }) => (
										<div
											key={item.id}
											className="w-[121px] h-[151px] flex justify-center items-center rounded relativeFcons"
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
											{item.image ? (
												<Image
													src={`/${item.image}`}
													alt=""
													fill
													className="object-cover"
													unoptimized
												/>
											) : null}
											{/* <p className="text-[12px] text-center self-end">{item.name}</p> */}
										</div>
									))}
								</div>
							</div>
						</div>
					)
				)}
			</section>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async context => {
	const user = await userFromReq(context)
	const trades = await getTrades({ user })

	const parsedTrades: TradeOffer[] = trades.map(trade => ({
		...trade,
		itemsWants: trade.itemsWants.reduce(
			(acc, { quantity, ...item }) => [...acc, ...Array.from({ length: quantity }, () => item)],
			[] as any[]
		),
		itemsOffer: trade.itemsOffer.reduce(
			(acc, { quantity, ...item }) => [...acc, ...Array.from({ length: quantity }, () => item)],
			[] as any[]
		),
	}))

	return {
		props: {
			trades: JSON.parse(JSON.stringify(parsedTrades)),
		},
	}
}
