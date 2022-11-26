type Props = {
	name: string
	position: number
	email: string
}

export function CongratulationsModal({ name, position, email }: Props) {
	const isFirst10 = position <= 10

	return (
		<div className="fixed w-screen h-screen top-0 left-0 bg-gray-900/80 grid place-items-center">
			<div className="flex flex-col items-center justify-center w-[min(500px,95%)] rounded shadow-md bg-gray-300 p-4 font-poppins font-medium text-gray-900 text-center gap-y-3">
				<span className="text-2xl font-semibold">Parabéns {name}, você completou o álbum!</span>

				{isFirst10 ? <span>Você foi um das 10 primeiras pessoas a completar o álbum 😮</span> : null}

				<span>Enviei as instruções de como você pode resgatar seu prêmio pelo seu email:</span>
				<span className="text-lg font-semibold">{email}</span>

				<button
					type="button"
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full mt-4"
				>
					Ok
				</button>
			</div>
		</div>
	)
}
