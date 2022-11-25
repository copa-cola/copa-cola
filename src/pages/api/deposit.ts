import { prisma } from "../../lib/prismadb"
import ApiError from "../../utils/ApiError"
import { apiHandler } from "../../utils/apiHandler"

export default apiHandler(async (req, res) => {

	if (!req.user) {
		throw new ApiError('User not found.', 404)
	}

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      balance: req.user.balance + 10000
    }
  })

	res.status(200).json(updatedUser)
}, true)