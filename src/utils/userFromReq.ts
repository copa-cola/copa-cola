import { getSession, GetSessionParams } from 'next-auth/react'
import { prisma } from '../lib/prismadb'
import ApiError from './ApiError'

export const userFromReq = async (req: GetSessionParams) => {
	const session = await getSession(req)

	if (!session) {
		throw new ApiError('You must be logged to do that.', 403)
	}

	const user = await prisma.user.findFirst({
		where: {
			email: session.user?.email ?? '',
		},
	})

	if (!user) {
		throw new ApiError('You must be logged to do that.', 403)
	}
  
  return user
}
