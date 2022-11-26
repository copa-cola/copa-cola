import Image from 'next/image'
import { useCountry } from '../hooks/useCountry'
import { AlbumSticker } from '../pages/api/album'

type Props = {
	data: AlbumSticker
}

export function Sticker({ data }: Props) {
	const { flag } = useCountry(data.country.name.toLowerCase())
	const { isSticked, name, bottomText, country, image } = data

	return (
		<div className="relative w-full h-full font-poppins font-medium">
			{isSticked ? (
				<>
					<Image src="/sticker/background.png" alt="" className="absolute" fill />

					<div className="absolute top-0 left-0 p-4 flex flex-col items-center">
						<Image src="/sticker/cubo.png" alt="" width={40} height={40} />
						<span className="text-white text-sm">2022</span>
					</div>

					<div className="absolute top-0 right-0 p-4 flex flex-col items-center">
						<span className="text-white uppercase">{data.country.abbreviation}</span>
						<Image
							src={flag}
							alt=""
							width={60}
							height={45}
							className="border-[3px] border-white"
						/>
					</div>

					<div className="w-[110%] -left-[5%] h-full relative top-[calc(100%-200px-55px)] mx-auto">
						<Image
							src={image}
							alt=""
							fill
							className="!w-[80%] !h-[170px] !relative mx-auto"
							style={{
								filter: 'drop-shadow(3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 -3px 0 white)  drop-shadow(3px 0 0 #dc3256) drop-shadow(0 -2px 0 #dc3256)',
							}}
						/>

						<div className="bg-white w-full text-center border-b-[6px] border-[#bd2a47] text-[#bd2a47] text-[32px] leading-tight font-semibold">
							{name}
						</div>

						<div className="bg-[#bd2a47] text-white text-2xl text-center w-[60%] mx-auto font-semibold leading-none pb-1">
							{bottomText}
						</div>
					</div>
				</>
			) : (
				<div
					className="w-full h-full bg-black/50 flex flex-col space-y-4 text-center px-2 relative"
					style={{
						background:
							'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 40%, rgba(255,255,255,0) 100%)',
					}}
				>
					<span className="text-3xl font-semibold mt-4 text-black">{name}</span>

					<Image
						src={image}
						alt=""
						fill
						className="!w-[80%] !h-[170px] !top-[calc(100%-170px-16px)] mx-auto"
						style={{ filter: 'brightness(0)' }}
					/>
				</div>
			)}
		</div>
	)
}
