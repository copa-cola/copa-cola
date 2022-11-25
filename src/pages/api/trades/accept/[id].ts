import { Item, User } from '@prisma/client'
import { prisma } from '../../../../lib/prismadb'
import { addItemsToInventory } from '../../../../utils/addItemsToInventory'
import ApiError from '../../../../utils/ApiError'
import { apiHandler } from '../../../../utils/apiHandler'
import { getUserInventory } from '../../inventory'

export interface AcceptTradeProps {
	user: string | User
	tradeId: string
}

export const acceptTrade = async ({ tradeId, user: staleUser }: AcceptTradeProps) => {
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser },
			  })
			: staleUser

	if (!user) {
		throw new ApiError('User not found.', 404)
	}

	const trade = await prisma.trade.findFirst({
		where: { id: tradeId },
		include: {
			itemsOffer: true,
			itemsWants: {
				include: {
					item: true,
				},
			},
		},
	})

	if (!trade) {
		throw new ApiError('Trade not found.', 404)
	}

	if (trade.closedAt) {
		throw new ApiError("This trade isn't active anymore.")
	}

	const inventory = await getUserInventory({ user })

	const itemsWithInventory = trade.itemsWants.map(itemOffer => ({
		...itemOffer,
		inventoryItem: inventory.find(
			inventoryItemFind =>
				inventoryItemFind.itemId === itemOffer.itemId &&
				inventoryItemFind.quantity >= itemOffer.quantity
		),
	}))

	if (itemsWithInventory.some(itemOffer => !itemOffer.inventoryItem)) {
		throw new ApiError("You don't have enough items in your inventory to do that.")
	}

	const updatePromises = itemsWithInventory.map(itemOffer => {
		return prisma.inventory.update({
			where: {
				id: itemOffer.inventoryItem!.id,
			},
			data: {
				quantity: itemOffer.inventoryItem!.quantity - itemOffer.quantity,
			},
		})
	})

	await Promise.all(updatePromises)

	const updatedTrade = await prisma.trade.update({
		where: {
			id: trade.id,
		},
		data: {
			buyerId: user.id,
			closedAt: new Date(),
		},
		include: {
			itemsOffer: {
				include: {
					item: true,
				},
			},
			itemsWants: {
				include: {
					item: true,
				},
			},
		},
	})

	await addItemsToInventory({
		userId: trade.sellerId,
		items: trade.itemsWants.reduce(
			(acc, { item, quantity }) => [...acc, ...Array.from({ length: quantity }, () => item)],
			[] as Item[]
		),
	})

	return updatedTrade
}

export default apiHandler(async function handler(req, res) {
	const { id: tradeId } = req.query

	const newInventory = await acceptTrade({
		tradeId: (Array.isArray(tradeId) ? tradeId.join('') : tradeId) ?? '',
		user: req.user ?? '',
	})

	res.status(200).json(newInventory)
}, true)
