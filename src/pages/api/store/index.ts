import { prisma } from '../../../lib/prismadb'
import { apiHandler } from '../../../utils/apiHandler'

export const getStoreItems = async () => {
	return (
		await prisma.storeItem.findMany({
			include: {
				item: true
			},
			orderBy: {
				item: {
					type: 'asc'
				}
			}
		})
	).sort((a, b) => a.quantity - b.quantity)
}

export default apiHandler(async function handler(req, res) {
	const storeItems = await getStoreItems()

	res.status(200).json(storeItems)
})
