import mock from '../../public/mock.json'

export function useCountry(countryName: string) {
	const { name, abbreviation, color } = mock.countries.find(i => i.name === countryName)!

	return {
		name,
		abbreviation,
		color,
		flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${abbreviation.slice(0, -1)}.svg`,
	}
}
