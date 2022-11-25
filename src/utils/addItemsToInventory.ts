import { Inventory, Item, User } from '@prisma/client'
import { prisma } from '../lib/prismadb'
import { getUserInventory } from '../pages/api/inventory'

export interface AddItemToInventoryParams {
	userId: string
	items: Item[]
	userInventory?: Inventory[]
}

export const addItemsToInventory = async ({ items, userId, userInventory }: AddItemToInventoryParams) => {
	const inventory = userInventory ?? (await getUserInventory({ user: userId }))

	const transactionData = items.reduce(
		(acc, sticker) => {
			const inventoryWithSticker = inventory.find(inventoryItem => inventoryItem.itemId === sticker.id)

			if (inventoryWithSticker) {
				if (acc.update[inventoryWithSticker.id]) {
					acc.update[inventoryWithSticker.id] += 1
				} else {
					acc.update[inventoryWithSticker.id] = inventoryWithSticker.quantity + 1
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
			update: {} as Record<string, number>,
		}
	)

	await prisma.inventory.createMany({
		data: Object.entries(transactionData.create).map(([stickerId, quantity]) => ({
			itemId: stickerId,
			userId: userId,
			quantity,
		})),
	})

	const updatePromises = Object.entries(transactionData.update).map(([stickerId, quantity]) => {
		return prisma.inventory.update({
			where: {
				id: stickerId,
			},
			data: {
				quantity,
			},
		})
	})

	await Promise.all(updatePromises)
}
