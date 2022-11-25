import { Inventory, User } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
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
					where: { id: staleUser }
			  })
			: staleUser

	if (!user) {
		throw new ApiError('User not found.', 404)
	}

	const inventory = await prisma.inventory.findMany({
		where: {
			userId: user.id
		},
		include: {
			item: true
		}
	})

	const findPackageInInventory = inventory.find(
		({ item }) => item.type === 'STICKER_PACK'
	)

	if (!findPackageInInventory || !findPackageInInventory.quantity) {
		throw new ApiError("You don't have any packages in your inventory.", 404)
	}

	const stickers = await prisma.item.findMany({
		where: {
			type: 'STICKER'
		}
	})

	const commonStickers = stickers.filter(
		(sticker) => sticker.rarity === 'COMMON'
	)
	const rareStickers = stickers.filter(
		(sticker) => sticker.rarity === 'LEGENDARY'
	)

	const newStickers = Array.from({ length: 4 }, () =>
		Math.floor(Math.random() * (100 - 1 + 1) + 1) > 95
			? randomItemFromArray(rareStickers)
			: randomItemFromArray(commonStickers)
	)

	const transactionData = newStickers.reduce(
		(acc, sticker) => {
			const inventoryWithSticker = inventory.find(
				(inventoryItem) => inventoryItem.itemId === sticker.id
			)

			if (inventoryWithSticker) {
				if (acc.update[inventoryWithSticker.id]) {
					acc.update[inventoryWithSticker.id] += 1
				} else {
					acc.update[inventoryWithSticker.id] = inventoryWithSticker.quantity
				}
			} else {
				if (acc.create[sticker.id]) {
					acc.create[sticker.id] += 1
				} else {
					acc.create[sticker.id] = 1
				}
			}

			return acc
		},
		{
			create: {} as Record<string, number>,
			update: {} as Record<string, number>
		}
	)

	await prisma.inventory.createMany({
		data: Object.entries(transactionData.create).map(
			([stickerId, quantity]) => ({
				itemId: stickerId,
				userId: user.id,
				quantity
			})
		)
	})

	const updatePromises = Object.entries(transactionData.update).map(
		async ([stickerId, quantity]) => {
			return await prisma.inventory.update({
				where: {
					id: stickerId
				},
				data: {
					quantity
				}
			})
		}
	)

	await Promise.all(updatePromises)

	await prisma.inventory.update({
		where: {
			id: findPackageInInventory.id
		},
		data: {
			quantity: findPackageInInventory.quantity - 1
		}
	})

	return newStickers
}

export default apiHandler(async function handler(req, res) {
	const inventory = await unpack({
		user: req.user ?? ''
	})

	res.status(200).json(inventory)
}, true)
