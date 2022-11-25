import { User } from '@prisma/client'
import { prisma } from '../../../lib/prismadb'
import ApiError from '../../../utils/ApiError'
import { apiHandler } from '../../../utils/apiHandler'
import { getUserInventory } from '../inventory'

export interface CreateTradeParams {
	itemsOffer: Array<{
		id: string
		quantity: number
	}>
	itemsWants: Array<{
		id: string
		quantity: number
	}>
}

export interface GetTradesProps {
	user?: string | User
}

export const getTrades = async ({ user: staleUser }: GetTradesProps) => {
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser },
			  })
			: staleUser

	const trades = await prisma.trade.findMany({
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
    orderBy: {
      closedAt: { sort: 'desc', nulls: 'first' }
    }
	})

	if (!user) {
		return trades
	}

	return trades.sort((a, b) => (a.buyerId === user.id ? 1 : -1))
}

export default apiHandler(async (req, res) => {
	const staleUser = req.user
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser },
			  })
			: staleUser

	if (!user) {
		throw new ApiError('User not found.', 404)
	}

	if (req.method === 'GET') {
		const trades = await getTrades({ user: req.user ?? '' })

		return res.status(200).json(trades)
	}

	if (req.method === 'POST') {
		const { itemsOffer, itemsWants } = req.body as Partial<CreateTradeParams>

		if (!itemsOffer || !itemsWants) {
			console.log({ itemsOffer, itemsWants })
			throw new ApiError('Items missing in request.')
		}

		const inventory = await getUserInventory({ user })

		const itemsWithInventory = itemsOffer.map(itemOffer => ({
			...itemOffer,
			inventoryItem: inventory.find(
				inventoryItemFind =>
					inventoryItemFind.itemId === itemOffer.id &&
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

		const trade = await prisma.trade.create({
			data: {
				sellerId: req.user!.id,
				itemsOffer: {
					createMany: {
						data: itemsOffer.map(item => ({ itemId: item.id, quantity: item.quantity })),
					},
				},
				itemsWants: {
					createMany: {
						data: itemsWants.map(item => ({ itemId: item.id, quantity: item.quantity })),
					},
				},
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

		return res.status(201).json(trade)
	}

	throw new ApiError('Method not allowed.', 405)
}, true)
