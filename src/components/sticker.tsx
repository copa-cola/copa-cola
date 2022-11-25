import Image from 'next/image'
import { useCountry } from '../hooks/useCountry'

type Props = {
	countryName: string
}

export function Sticker({ countryName }: Props) {
	const { flag, abbreviation } = useCountry(countryName)

	return (
		<div className="relative w-full h-full font-poppins font-medium">
			<Image src="/sticker/background.png" alt="" className="absolute" fill />

			<div className="absolute top-0 left-0 p-4 flex flex-col items-center">
				<Image src="/sticker/cubo.png" alt="" width={40} height={40} />
				<span className="text-white text-sm">2022</span>
			</div>

			<div className="absolute top-0 right-0 p-4 flex flex-col items-center">
				<span className="text-white uppercase">{abbreviation}</span>
				<Image src={flag} alt="" width={60} height={45} className="border-[3px] border-white" />
			</div>

			<div className="w-full h-full relative top-[calc(100%-200px-55px)] mx-auto">
				<Image
					src="/sticker/Obelisco.png"
					alt=""
					fill
					className="!w-[80%] !h-[170px] !relative mx-auto"
					style={{
						filter: 'drop-shadow(3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 -3px 0 white)  drop-shadow(3px 0 0 #dc3256) drop-shadow(0 -2px 0 #dc3256)',
					}}
				/>

				<div className="bg-white w-full text-center border-b-[6px] border-[#bd2a47] text-[#bd2a47] text-[32px] leading-tight font-semibold">
					Maradona
				</div>

				<div className="bg-[#bd2a47] text-white text-2xl text-center w-[60%] mx-auto font-semibold leading-none pb-1">
					1960
				</div>
			</div>
		</div>
	)
}
