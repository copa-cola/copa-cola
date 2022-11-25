import { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../lib/prismadb'

import ApiError from './ApiError'

interface RequestWithUser extends NextApiRequest {
	user?: User
}

export const apiHandler = (
	handler: (req: RequestWithUser, res: NextApiResponse) => void | Promise<void>,
	ensureAuthenticated?: boolean
) => {
	return async (req: RequestWithUser, res: NextApiResponse) => {
		try {
			if (!ensureAuthenticated) {
				await handler(req, res)
			}

			const session = await getSession({ req })

			if (!session) {
				throw new ApiError('You must be logged to do that.', 403)
			}

			const user = await prisma.user.findFirst({
				where: {
					email: session.user?.email ?? ''
				}
			})

      if (!user) {
				throw new ApiError('You must be logged to do that.', 403)
      }

			await handler({ ...req, user } as RequestWithUser, res)
		} catch (err) {
			if (err instanceof ApiError) {
				return res.status(err.statusCode).json({
					status: 'error',
					message: err.message
				})
			}

			console.error(err)

			return res.status(500).json({
				status: 'error',
				message: 'Internal server error'
			})
		}
	}
}
