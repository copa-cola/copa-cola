import Image from 'next/image'
import { Sticker } from '../components/sticker'
import { fluid, fluidText } from '../utils'
import { useCountry } from '../hooks/useCountry'
import { GetServerSideProps } from 'next'
import { prisma } from '../lib/prismadb'
import { AlbumSticker, getAlbum } from './api/album'
import { userFromReq } from '../utils/userFromReq'
import { useCallback, useMemo, useState } from 'react'
import { Country } from '@prisma/client'

type AlbumCountry = Country & { stickers: AlbumSticker[] }

type Props = {
	countries: AlbumCountry[]
}

export default function _({ countries }: Props) {
	const [currentPage, setCurrentPage] = useState(0)

	const pageData = useMemo(() => countries[currentPage], [countries, currentPage])

	const { stickers } = pageData

	const { name, abbreviation, flag, color } = useCountry(pageData.name.toLowerCase())

	const handlePreviousPage = useCallback(() => {
		setCurrentPage(old => old - 1)
	}, [])

	const handleNextPage = useCallback(() => {
		setCurrentPage(old => old + 1)
	}, [])

	return (
		<div className="flex flex-col" style={{ backgroundColor: color }}>
			<div className="flex justify-center w-screen">
				<button type="button" disabled={!currentPage} onClick={handlePreviousPage}>
					{'<'}
				</button>
				<button
					type="button"
					disabled={currentPage === countries.length - 1}
					onClick={handleNextPage}
				>
					{'>'}
				</button>
			</div>

			<div className="flex justify-center w-screen divide-x-2 font-poppins">
				<div className="grid grid-cols-2 place-items-center w-full max-w-[1920px] gap-6 min-h-screen p-20">
					{/* figurinha superior esquerdo página da esquerda */}
					<div className="w-[clamp(194px,100%,255px)] min-w-[194px]">
						<Image
							src={flag}
							alt="Bandeira do País"
							width={194 * 4}
							height={436}
							className="border-[12px] border-white w-full h-1/2 shadow-xl"
							blurDataURL={flag}
							placeholder="blur"
						/>

						<div className="text-white flex flex-col max-w-[196px] w-[80%] mx-auto -mt-2">
							<span
								className="uppercase font-medium self-center"
								style={{ ...fluidText(40, 60, 425, 1920) }}
							>
								{name}
							</span>
							<span className="uppercase font-medium text-2xl self-end -translate-y-5">
								{name}
							</span>
							<span className="uppercase font-medium text-4xl -translate-y-8">{name}</span>
							<span className="uppercase font-medium text-3xl self-end -translate-y-10">
								{name}
							</span>
						</div>
					</div>

					{/* figurinha superior direito página da esquerda */}
					<div
						className="w-[clamp(180px,_100%,_255px)] border-[12px] border-white"
						style={{ height: fluid(200, 350, 425, 1920) }}
					>
						<Sticker data={stickers[0]} />
					</div>

					{/* figurinha inferior esquerdo página da esquerda */}
					<div
						className="w-[clamp(180px,_100%,_255px)] border-[12px] border-white"
						style={{ height: fluid(200, 350, 425, 1920) }}
					>
						<Sticker data={stickers[1]} />
					</div>

					{/* figurinha inferior direito página da esquerda */}
					<div
						className="w-[clamp(180px,_100%,_255px)] border-[12px] border-white"
						style={{ height: fluid(200, 350, 425, 1920) }}
					>
						<Sticker data={stickers[2]} />
					</div>
				</div>

				<div className="grid grid-cols-2 place-items-center w-full max-w-[1920px] gap-6 min-h-screen p-20 text-white">
					{/* figurinha superior esquerdo página da direita */}
					<div
						className="w-[clamp(180px,_100%,_255px)] border-[12px] border-white place-self-center"
						style={{ height: fluid(200, 350, 425, 1920) }}
					>
						<Sticker data={stickers[3]} />
					</div>

					<div
						className="rotate-90 text-7xl flex items-center"
						style={{ ...fluidText(50, 90, 425, 1920) }}
					>
						TuriStar
					</div>

					<div
						className="uppercase justify-self-center place-self-end leading-relaxed"
						style={{ ...fluidText(120, 154, 425, 1920) }}
					>
						{abbreviation}
					</div>

					{/* figurinha inferior direito página da direita */}
					<div
						className="w-[clamp(180px,_100%,_255px)] border-[12px] border-white"
						style={{ height: fluid(200, 350, 425, 1920) }}
					>
						<Sticker data={stickers[4]} />
					</div>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async context => {
	const user = await userFromReq(context)
	const album = await getAlbum({ user })

	const countries = album.reduce((acc, sticker) => {
		const country = acc.find(accItem => accItem.id === sticker.country.id)

		if (country) {
			country.stickers.push(sticker)

			return acc
		}

		return [...acc, { ...sticker.country, stickers: [sticker] }] as AlbumCountry[]
	}, [] as AlbumCountry[])

	return {
		props: {
			album: JSON.parse(JSON.stringify(album)),
			countries: JSON.parse(JSON.stringify(countries)),
		},
	}
}
