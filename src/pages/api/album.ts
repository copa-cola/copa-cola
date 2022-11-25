import { prisma } from '../../lib/prismadb'
import ApiError from '../../utils/ApiError'
import { apiHandler } from '../../utils/apiHandler'

export default apiHandler(async (req, res) => {
	if (!req.user) {
		throw new ApiError('User not found.', 404)
	}

	const album = await prisma.inventory.findMany({
    where: {
      userId: req.user.id,
      item: {
        type: 'STICKER'
      }
    },
    include: {
      item: {
        include: {
          country: true
        }
      }
    },
    orderBy: {
      item: {
        number: 'asc'
      }
    }
	})

	res.status(200).json(album)
}, true)
