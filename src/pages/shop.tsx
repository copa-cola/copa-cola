import Image from 'next/image'
import { Header } from '../components/header'
import { useShop } from '../hooks/useShop'
import { formatbalance } from '../utils'

type Props = {
	balance: number
}

export default function _({ balance }: Props) {
	const { items } = useShop()

	return (
		<>
			<Header balance={balance} />

			<main>
				<section className="grid grid-cols-4 font-poppins font-medium max-w-[760px] gap-y-6 mx-auto mt-10">
					{items.map(({ name, price, image }) => (
						<div
							key={name}
							className="
                    w-[168px] h-[300px] border border-[#868686] rounded p-3 pr-0 text-[#727272]"
						>
							<Image src={image} alt="" width={150} height={200} unoptimized />

							<p>1 Pacote de figurinhas</p>
							<strong className="text-lg">{formatbalance(price)}</strong>
						</div>
					))}
				</section>
			</main>
		</>
	)
}

export async function getServerSideProps() {
	return {
		props: {
			balance: 123.09,
		},
	}
}
