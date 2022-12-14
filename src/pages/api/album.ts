import { Country, Rarity, User } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
import { apiHandler } from '../../utils/apiHandler'
import { getUserInventory } from './inventory'

export interface AlbumSticker {
	id: string
	number: number
	name: string
	bottomText: string
	image: string
	country: Omit<Country, 'initials'> & { abbreviation: string }
	userQuantity: number
	isSticked: boolean
	rarity: Rarity
}

export interface GetAlbumProps {
	user?: string | User
}

export const getAlbum = async ({ user: staleUser }: GetAlbumProps) => {
	const user =
		typeof staleUser === 'string'
			? await prisma.user.findFirst({
					where: { id: staleUser },
			  })
			: staleUser

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

	const inventory = user
		? await getUserInventory({
				user,
				where: {
					item: {
						type: 'STICKER',
					},
				},
		  })
		: []

	const album = allStickers.map(sticker => {
		const { name, rarity, country, bottomText, id, number, image } = sticker

		const stickerInInventory = inventory.find(inventoryItem => inventoryItem.itemId === sticker.id)

		const albumSticker: AlbumSticker = {
			name,
			rarity,
			country: {
				id: country!.id,
				name: country!.name,
				abbreviation: country!.initials,
			},
			bottomText,
			id,
			number: number!,
			isSticked: !!stickerInInventory?.isSticked,
			userQuantity: stickerInInventory?.quantity ?? 0,
			image: image ? `/${image}` : '/sticker/Obelisco.png',
		}

		return albumSticker
	})

	return album
}

export default apiHandler(async (req, res) => {
	const album = await getAlbum({
		user: req.user ?? '',
	})

	res.status(200).json(album)
}, true)
