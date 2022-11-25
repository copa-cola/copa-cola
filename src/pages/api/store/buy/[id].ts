import { User } from '@prisma/client'
import { prisma } from '../../../../lib/prismadb'
import ApiError from '../../../../utils/ApiError'
import { apiHandler } from '../../../../utils/apiHandler'

interface BuyItemProps {
	user: string | User
	storeItemId: string
}

export const buyItem = async ({
	storeItemId,
	user: staleUser
}: BuyItemProps) => {
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser }
			  })
			: staleUser

	if (!user) {
		throw new ApiError('User not found.', 404)
	}

	const storeItem = await prisma.storeItem.findFirst({
		where: { id: storeItemId },
		include: { item: true }
	})

	if (!storeItem) {
		throw new ApiError('Item not found.', 404)
	}

	if (user.balance - storeItem.price < 0) {
		throw new ApiError("You don't have enough balance to do that.", 404)
	}

	let newLoyaltyBalance = user.loyaltyBalance + storeItem.price
	const loyaltyHit = newLoyaltyBalance >= 10000

	if (loyaltyHit) {
		newLoyaltyBalance -= 10000
	}

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			balance: user.balance - storeItem.price,
			loyaltyBalance: newLoyaltyBalance
		}
	})

	const checkItemExistsInInventory = await prisma.inventory.findFirst({
		where: {
			userId: user.id,
			itemId: storeItem.item.id
		}
	})

	if (checkItemExistsInInventory) {
		const newQuantity =
			checkItemExistsInInventory.quantity +
			storeItem.quantity +
			(loyaltyHit ? 5 : 0)

		const inventory = await prisma.inventory.update({
			where: {
				id: checkItemExistsInInventory.id
			},
			data: {
				quantity: newQuantity
			}
		})

		return { inventory, loyaltyHit }
	}

	const inventory = await prisma.inventory.create({
		data: {
			itemId: storeItem.item.id,
			userId: user.id,
			quantity: storeItem.quantity + (loyaltyHit ? 5 : 0)
		}
	})
	return { inventory, loyaltyHit }
}

export default apiHandler(async function handler(req, res) {
	const { id: itemId } = req.query

	const newInventory = await buyItem({
		storeItemId: (Array.isArray(itemId) ? itemId.join('') : itemId) ?? '',
		user: req.user ?? ''
	})

	res.status(200).json(newInventory)
}, true)
