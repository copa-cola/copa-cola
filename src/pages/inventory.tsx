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
					className="w-[168px] h-[300px] border border-[#868686] rounded p-3 pr-0 text-[#727272]"
					key={inventoryItem.id}
				>
					<div className="w-full h-full relative top-[calc(100%-200px-55px)] mx-auto">
						<Image
							src="/sticker/Obelisco.png"
							alt=""
							fill
							className="!w-[80%] !h-[100px] !relative mx-auto"
							style={{
								filter: 'drop-shadow(3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 -3px 0 white)  drop-shadow(3px 0 0 #dc3256) drop-shadow(0 -2px 0 #dc3256)',
							}}
						/>

						<div className="bg-white w-full text-center text-[#bd2a47] text-[16px] leading-tight font-semibold">
							{inventoryItem.item.name}
						</div>

						<p>{inventoryItem.quantity}</p>
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
