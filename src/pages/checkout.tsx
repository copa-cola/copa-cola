import { Header } from '../components/header'

type Props = {
	balance: number
}

export default function _({ balance }: Props) {
	function cpfMask(e: any) {
		const v = e.value

		if (isNaN(v[v.length - 1])) {
			// impede entrar outro caractere que não seja número
			e.value = v.substring(0, v.length - 1)
			return
		}

		e.setAttribute('maxlength', '14')
		if (v.length == 3 || v.length == 7) e.value += '.'
		if (v.length == 11) e.value += '-'
	}

	return (
		<section className="max-w-[600px] mx-auto mt-40">
			<form
				className="font-medium font-poppins"
				method="POST"
				action="/api/deposit"
				onSubmit={e => {
					e.preventDefault()
					location.reload()
				}}
			>
				<div className="grid grid-cols-2 gap-6">
					<div>
						<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
							Nome
						</label>
						<input
							type="text"
							name="name"
							id="name"
							required
							className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 text-black"
						/>
					</div>

					<div>
						<label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900">
							CPF
						</label>
						<input
							type="text"
							name="cpf"
							id="cpf"
							onInput={e => cpfMask(e.target)}
							required
							className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 text-black"
						/>
					</div>

					<div>
						<label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-gray-900">
							Data de nascimento
						</label>
						<input
							type="date"
							name="birthdate"
							id="birthdate"
							required
							className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 text-black"
						/>
					</div>

					<div className="space-y-4">
						<label htmlFor="payment" className="block mb-2 text-sm font-medium text-gray-900">
							Forma de pagamento:
						</label>

						<div className="flex items-center">
							<input
								id="credit-card"
								type="radio"
								name="radio"
								value="credit-card"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
							/>
							<label htmlFor="credit-card" className="ml-2 text-sm font-medium text-gray-900">
								Cartão de crédito
							</label>
						</div>
						<div className="flex items-center">
							<input
								checked
								id="pix"
								type="radio"
								name="radio"
								value="pix"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-"
							/>
							<label htmlFor="pix" className="ml-2 text-sm font-medium text-gray-900">
								Pix
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="deposit"
								type="radio"
								name="radio"
								value="deposit"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
							/>
							<label htmlFor="deposit" className="ml-2 text-sm font-medium text-gray-900">
								Depósito
							</label>
						</div>
					</div>
				</div>

				<button
					type="submit"
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full mt-4"
				>
					Comprar
				</button>
			</form>
		</section>
	)
}

export async function getServerSideProps() {
	return {
		props: {
			balance: 123.09,
		},
	}
}
