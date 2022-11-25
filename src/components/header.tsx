import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { formatbalance } from '../utils'

type Props = {
	balance: number
}

export function Header({ balance }: Props) {
	const { data: session, status } = useSession()

	const isAuthenticated = status === 'authenticated'

	return (
		<header className="w-screen font-poppins shadow-md">
			<div className="w-full h-8 bg-[#42D9D7]"></div>

			<div className="flex py-1.5 items-center font-semibold text-sm w-[min(1220px,95%)] mx-auto bg-[#FDFDFD]">
				<nav className="mx-auto text-[#4B3695]">
					<ul className="flex">
						<li>
							<Link href="/" className="hover:text-[#98C776] transition-colors py-3.5 px-5">
								Início
							</Link>
						</li>
						<li>
							<Link
								href="/album"
								className="hover:text-[#98C776] transition-colors py-3.5 px-5"
							>
								Album
							</Link>
						</li>
						<li>
							<Link href="/shop" className="hover:text-[#98C776] transition-colors py-3.5 px-5">
								Loja
							</Link>
						</li>
						<li>
							<Link
								href="/checkout"
								className="hover:text-[#98C776] transition-colors py-3.5 px-5"
							>
								Comprar
							</Link>
						</li>
					</ul>
				</nav>

				<div className="flex items-center space-x-4">
					<Image
						src={isAuthenticated ? session?.user?.image ?? '' : '/icons/not-logged.png'}
						alt=""
						width={32}
						height={32}
						className="rounded-full"
						style={{ filter: 'drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25))' }}
					/>

					<span className="font-inter font-normal">{formatbalance(balance)}</span>
					<button>
						<Link href="/checkout">
							<Image src="/icons/plus.svg" alt="" width={10} height={10} />
						</Link>
					</button>
					{isAuthenticated ? null : (
						<button
							className="bg-[#3771B0] text-white rounded p-2"
							onClick={() => signIn('google')}
						>
							Entrar | Cadastrar
						</button>
					)}
				</div>
			</div>
		</header>
	)
}
