import Image from 'next/image'

type Props = {
	urlImage: string
	className?: string
}

export function Ad({ urlImage, className = '' }: Props) {
	return <Image src={urlImage} alt="Ad" width={1220} height={189} className={className} />
}
