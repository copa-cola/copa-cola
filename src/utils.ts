function fluid(minPX: number, maxPX: number, minVW: number, maxVW: number) {
	const xx = minVW / 100
	const yy = (100 * (maxPX - minPX)) / (maxVW - minVW)
	const zz = minPX / 16

	return `clamp(${minPX}px, calc(${zz}rem + ((1vw - ${xx}px) * ${yy})), ${maxPX}px)`
}

function fluidText(minPX: number, maxPX: number, minVW: number, maxVW: number) {
	return {
		fontSize: fluid(minPX, maxPX, minVW, maxVW),
		minHeight: '0vw',
	}
}

function formatbalance(balance: number) {
	return new Intl.NumberFormat('pt-br', {
		style: 'currency',
		currency: 'BRL',
	}).format(balance)
}

export { fluid, fluidText, formatbalance }
