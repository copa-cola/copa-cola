import { User } from '@prisma/client'
import { prisma } from '../../lib/prismadb'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

interface GetUserDataProps {
	user: string | User
}

export const getUserData = async ({ user: staleUser }: GetUserDataProps) => {
	if (typeof staleUser === 'string') {
		const user = await prisma.user.findFirst({
			where: {
				id: staleUser
			},
			select: {}
		})

		if (!user) {
			throw new ApiError('User not found.', 404)
		}
		return user
	}

	return staleUser
}

export default apiHandler(async function handler(req, res) {
	const inventory = await getUserData({
		user: req.user ?? ''
	})

	res.status(200).json(inventory)
}, true)
