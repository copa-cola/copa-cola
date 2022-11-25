import { User } from '@prisma/client'
import { prisma } from '../../../lib/prismadb'
import ApiError from '../../../utils/ApiError'
import { apiHandler } from '../../../utils/apiHandler'

interface BuyItemProps {
	user: string | User
	stickerId: string
}

export const stickSticker = async ({
	user: staleUser,
	stickerId
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

	const findStickerInInventory = await prisma.inventory.findFirst({
		where: {
			userId: user.id,
			itemId: stickerId
		},
		include: {
			item: true
		}
	})

	if (!findStickerInInventory) {
		throw new ApiError('Sticker not found.', 404)
	}

	if (findStickerInInventory.item.type !== 'STICKER') {
		throw new ApiError("You can't stick that.")
	}

	if (findStickerInInventory.isSticked) {
		throw new ApiError('This sticker is already sticked.')
	}

	if (findStickerInInventory.quantity <= 0) {
		throw new ApiError("You don't have enough stickers to do that.")
	}

	const updatedSticker = await prisma.inventory.update({
		where: {
			id: findStickerInInventory.id
		},
		data: {
			isSticked: true,
			quantity: findStickerInInventory.quantity - 1
		},
		include: {
			item: true
		}
	})

	return updatedSticker
}

export default apiHandler(async function handler(req, res) {
	const { id: stickerId } = req.query

	const inventory = await stickSticker({
		stickerId:
			(Array.isArray(stickerId) ? stickerId.join('') : stickerId) ?? '',
		user: req.user ?? ''
	})

	res.status(200).json(inventory)
}, true)
