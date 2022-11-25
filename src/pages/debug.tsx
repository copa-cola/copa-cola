import React, { useCallback, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { CreateTradeParams } from './api/trades'

// import { Container } from './styles';

const Debug: React.FC = () => {
	const [data, setData] = useState({} as Record<any, any>)

	const handleClick = useCallback(() => {
		const data: CreateTradeParams = {
			itemsOffer: [
				{
					id: 'db107841-7c2b-4b1e-8e59-38279289868e',
					quantity: 1,
				},
			],

			itemsWants: [
				{
					id: '2afbd3d3-8d6c-4ef8-a073-6ba8cbb1fdaa',
					quantity: 1,
				},
			],
		}

		fetch('/api/trades', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(data => setData(data))
	}, [])

	return (
		<div>
			<button type="button" onClick={handleClick}>
				teste
			</button>

			<div>
				data:
				<pre>{JSON.stringify(data)}</pre>
			</div>
		</div>
	)
}

export default Debug
