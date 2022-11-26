import { StoreItem } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Header } from '../components/header'
import { useAuth } from '../hooks/auth'
import { useShop } from '../hooks/useShop'
import { api } from '../services/api'
import { formatbalance } from '../utils'
import { getStoreItems } from './api/store'

type Props = {
	balance: number
	storeItems: StoreItem[]
}

export default function _({ balance, storeItems }: Props) {
	const { user, mutate } = useAuth()

	const router = useRouter()

	const handleBuy = useCallback(
		async (storeItemId: string) => {
			if (!user) {
				signIn('google', { callbackUrl: '/shop' })
				return
			}

			const response = await api.post(`/store/buy/${storeItemId}`)

			mutate()

			router.push('/inventory')
		},
		[mutate, user, router]
	)

	return (
		<section className="grid grid-cols-4 font-poppins font-medium max-w-[760px] gap-y-6 mx-auto mt-10">
			{storeItems.map(({ name, price, image, id }) => (
				<div
					onClick={() => handleBuy(id)}
					key={name}
					className="w-[168px] h-[300px] border border-[#868686] rounded p-3 pr-0 text-[#727272] cursor-pointer"
				>
					<Image
						src={`/${image}` ?? '/pacote-figurinha.png'}
						alt={name}
						width={150}
						height={200}
						unoptimized
					/>

					<p>{name}</p>
					<strong className="text-lg">{formatbalance(price)}</strong>
				</div>
			))}
		</section>
	)
}

export async function getServerSideProps(req: GetServerSidePropsContext) {
	const storeItems = await getStoreItems()

	return {
		props: {
			balance: 12309,
			storeItems: JSON.parse(JSON.stringify(storeItems)),
		},
	}
}
