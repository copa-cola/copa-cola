import { Inventory, Item as ItemType } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import { useMemo } from 'react'
import { userFromReq } from '../utils/userFromReq'
import { getUserInventory } from './api/inventory'

type Props = {
	inventory: (Inventory & { item: ItemType })[]
}

export default function _({ inventory: staleInventory }: Props) {
	const inventory = useMemo(
		() => staleInventory.filter(inventoryItem => inventoryItem.quantity > 0),
		[staleInventory]
	)

	return (
		<section className="grid grid-cols-4 font-poppins font-medium max-w-[760px] gap-y-6 mx-auto mt-10">
			{inventory.map(inventoryItem => (
				<div
					className="w-[168px] h-[300px] border border-[#868686] rounded p-3 pr-0 text-[#727272] cursor-pointer"
					key={inventoryItem.id}
					onClick={() => {
						fetch('/api/unpack', {
							method: 'POST',
						}).then(() => {
							location.reload()
						})
					}}
				>
					<div className="w-full h-full relative top-[calc(100%-200px-55px)] mx-auto flex flex-col items-center">
						<Image src="/pacote-figurinha.png" alt="" width={121} height={151} unoptimized />

						<div className="bg-white w-full text-center text-[#bd2a47] text-[16px] leading-tight font-semibold">
							{inventoryItem.item.name}
						</div>

						<p className="text-xl font-semibold mt-4">{inventoryItem.quantity}x</p>
					</div>
				</div>
			))}
		</section>
	)
}

export async function getServerSideProps(req: GetServerSidePropsContext) {
	const user = await userFromReq(req)
	const inventory = await getUserInventory({
		user,
		include: {
			item: true,
		},
	})

	return {
		props: {
			inventory: JSON.parse(JSON.stringify(inventory)),
		},
	}
}
