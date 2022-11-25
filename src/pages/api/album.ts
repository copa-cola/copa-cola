import { Country, Rarity } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

export interface AlbumSticker {
	id: string
	number: number
	name: string
	bottomText: string
	country: Country & { abbreviation: string }
	userQuantity: number
	isSticked: boolean
	rarity: Rarity
}

export default apiHandler(async (req, res) => {
	if (!req.user) {
		throw new ApiError('User not found.', 404)
	}

	const allStickers = await prisma.item.findMany({
		where: {
			type: 'STICKER',
		},
		include: {
			country: true,
		},
		orderBy: {
			number: 'asc',
		},
	})

	const inventory = await prisma.inventory.findMany({
		where: {
			userId: req.user.id,
			item: {
				type: 'STICKER',
			},
		},
	})

	const album = allStickers.map(sticker => {
		const { name, rarity, country, bottomText, id, number } = sticker

		const stickerInInventory = inventory.find(inventoryItem => inventoryItem.itemId === sticker.id)

		const albumSticker: AlbumSticker = {
			name,
			rarity,
			country: {
				...country!,
				abbreviation: country!.initials,
			},
			bottomText,
			id,
			number: number!,
			isSticked: !!stickerInInventory?.isSticked,
			userQuantity: stickerInInventory?.quantity ?? 0,
		}

		return albumSticker
	})

	res.status(200).json(album)
}, true)
