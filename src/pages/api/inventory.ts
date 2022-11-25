import { User, Prisma } from '@prisma/client'
import {} from '@prisma/client/index'
import { prisma } from '../../lib/prismadb'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

interface GetUserInventoryProps {
	user: string | User
	include?: Prisma.InventoryInclude
	where?: Omit<Prisma.InventoryWhereInput, 'user' | 'userId'>
}

export const getUserInventory = async ({ user: staleUser, include, where = {} }: GetUserInventoryProps) => {
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
			...where
		},
		include,
	})

	return inventory
}

export default apiHandler(async function handler(req, res) {
	const inventory = await getUserInventory({
		user: req.user ?? '',
		include: {
			item: {
				include: {
					country: true,
				},
			},
		},
	})

	res.status(200).json(inventory)
}, true)
