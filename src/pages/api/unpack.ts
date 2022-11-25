import { Inventory, User } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
import { addItemsToInventory } from '../../utils/addItemsToInventory'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

interface BuyItemProps {
	user: string | User
}

const randomItemFromArray = <T>(arr: T[]) => {
	return arr[Math.floor(Math.random() * arr.length)]
}

export const unpack = async ({ user: staleUser }: BuyItemProps) => {
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser },
			  })
			: staleUser

	if (!user) {
		throw new ApiError('User not found.', 404)
	}

	const inventory = await prisma.inventory.findMany({
		where: {
			userId: user.id,
		},
		include: {
			item: true,
		},
	})

	const findPackageInInventory = inventory.find(({ item }) => item.type === 'STICKER_PACK')

	if (!findPackageInInventory || !findPackageInInventory.quantity) {
		throw new ApiError("You don't have any packages in your inventory.", 404)
	}

	const stickers = await prisma.item.findMany({
		where: {
			type: 'STICKER',
		},
	})

	const commonStickers = stickers.filter(sticker => sticker.rarity === 'COMMON')
	const rareStickers = stickers.filter(sticker => sticker.rarity === 'LEGENDARY')

	const newStickers = Array.from({ length: 4 }, () =>
		Math.floor(Math.random() * (100 - 1 + 1) + 1) > 95
			? randomItemFromArray(rareStickers)
			: randomItemFromArray(commonStickers)
	)

	await addItemsToInventory({
		items: newStickers,
		userId: user.id,
		userInventory: inventory,
	})

	await prisma.inventory.update({
		where: {
			id: findPackageInInventory.id,
		},
		data: {
			quantity: findPackageInInventory.quantity - 1,
		},
	})

	return newStickers
}

export default apiHandler(async function handler(req, res) {
	const inventory = await unpack({
		user: req.user ?? '',
	})

	res.status(200).json(inventory)
}, true)
