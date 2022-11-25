import { User } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

interface BuyItemProps {
	user: string | User
}

export const getUserInventory = async ({ user: staleUser }: BuyItemProps) => {
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

  return inventory
}

export default apiHandler(async function handler(req, res) {
	const inventory = await getUserInventory({
		user: req.user ?? ''
	})

	res.status(200).json(inventory)
}, true)
