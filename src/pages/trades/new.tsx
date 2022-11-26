import { Inventory, Item as ItemType } from '@prisma/client'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { api } from '../../services/api'
import { userFromReq } from '../../utils/userFromReq'
import { AlbumSticker, getAlbum } from '../api/album'
import { getUserInventory } from '../api/inventory'

// import { Container } from './styles';

type NewTradeProps = {
	album: AlbumSticker[]
	inventory: (Inventory & { item: ItemType })[]
}

const NewTrade = ({ album, inventory }: NewTradeProps) => {
	const [selectedFromInventory, setSelectedFromInventory] = useState([] as string[])
	const [selectedFromAlbum, setSelectedFromAlbum] = useState([] as string[])

	const handleSelectFromInventory = useCallback((id: string) => {
		setSelectedFromInventory(old => {
			if (old.includes(id)) {
				return old.filter(oldItem => oldItem !== id)
			}

			return [...old, id]
		})
	}, [])

	const handleSelectFromAlbum = useCallback((id: string) => {
		setSelectedFromAlbum(old => {
			if (old.includes(id)) {
				return old.filter(oldItem => oldItem !== id)
			}

			return [...old, id]
		})
	}, [])

	const router = useRouter()

	const handleSubmit = useCallback(async () => {
		const parsedInventory = selectedFromInventory.reduce((acc, entry) => {
			const id = entry.split('/')[0]

			if (acc[id]) {
				acc[id]++
			} else {
				acc[id] = 1
			}

			return acc
		}, {} as Record<string, number>)

		const itemsOffer = Object.entries(parsedInventory).map(([key, value]) => ({
			id: key,
			quantity: value,
		}))

		const response = await api.post('/trades', {
			itemsOffer,

			itemsWants: selectedFromAlbum.map(id => ({ id, quantity: 1 })),
		})

		router.push('/trades')
	}, [router, selectedFromAlbum, selectedFromInventory])

	return (
		<section className="flex flex-col bg-gray-100 p-12 shadow-xl space-x-7 rounded">
			<div className="flex justify-center items-center ">
				<div>
					<div className="mb-2">
						<strong className="text-2xl font-semibold mr-1">Trocar...</strong>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
						{inventory.map(({ item: { rarity }, itemId, item, id }) => (
							<div
								onClick={() => handleSelectFromInventory(itemId)}
								key={itemId}
								className="w-[121px] h-[151px] flex justify-center items-center rounded cursor-pointer"
								style={{
									backgroundColor: rarity
										? rarity === 'COMMON'
											? '#63C7FF'
											: '#F8BA1D'
										: '#f3f4f6',
									border: `2px solid ${
										selectedFromInventory.includes(itemId)
											? '#11AA11'
											: rarity
											? rarity === 'COMMON'
												? '#0098ED'
												: '#B58200'
											: '#e5e7eb'
									}`,
									boxShadow: 'inset 0 0 5px 2px rgba(0,0,0,.1)',
								}}
							>
								{item.image ? (
									<Image src={`/${item.image}`} alt="" width={100} height={130} />
								) : null}
								{/* <p className="text-[12px] text-center self-end">{item.name}</p> */}
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col items-center space-y-4">
					<Image src="/arrow-right.png" alt="" width={75} height={45} unoptimized />
				</div>

				<div className="self-start">
					<div className="mb-2">
						<strong className="text-2xl font-semibold mr-1 mb-2">Por</strong>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-9 gap-y-6 bg-gray-200 shadow-lg p-8 rounded-lg">
						{album.map(({ rarity, ...item }) => (
							<div
								onClick={() => handleSelectFromAlbum(item.id)}
								key={item.id}
								className="w-[121px] h-[151px] flex justify-center items-center rounded cursor-pointer"
								style={{
									backgroundColor: rarity
										? rarity === 'COMMON'
											? '#63C7FF'
											: '#F8BA1D'
										: '#f3f4f6',
									border: `2px solid ${
										selectedFromAlbum.includes(item.id)
											? '#11AA11'
											: rarity
											? rarity === 'COMMON'
												? '#0098ED'
												: '#B58200'
											: '#e5e7eb'
									}`,
									boxShadow: 'inset 0 0 5px 2px rgba(0,0,0,.1)',
								}}
							>
								{item.image ? (
									<Image src={item.image} alt="" width={100} height={130} unoptimized />
								) : null}
								{/* <p className="text-[12px] text-center self-end">{item.name}</p> */}
							</div>
						))}
					</div>
				</div>
			</div>
			<button
				onClick={handleSubmit}
				type="button"
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-auto ml-auto mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-5/12 mt-6 self-center"
			>
				Criar proposta de troca
			</button>
		</section>
	)
}

export default NewTrade

export const getServerSideProps: GetServerSideProps = async context => {
	const user = await userFromReq(context)
	const album = await getAlbum({ user })
	const inventory = await getUserInventory({
		user,
		include: {
			item: {
				include: {
					country: true,
				},
			},
		},
		where: {
			item: {
				type: {
					not: 'STICKER_PACK',
				},
			},
		},
	})

	const parsedInventory: (Inventory & { item: ItemType })[] = inventory.reduce(
		(acc, item) => [
			...acc,
			...Array.from({ length: item.quantity }, (_, i) => ({ ...item, itemId: `${item.itemId}/${i}` })),
		],
		[] as any[]
	)

	return {
		props: {
			album: JSON.parse(JSON.stringify(album)),
			inventory: JSON.parse(JSON.stringify(parsedInventory)),
		},
	}
}
