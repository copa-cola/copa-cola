import useSWR from 'swr'
import React, { createContext, useContext } from 'react'

import type { AuthContextData } from './types'
import { api } from '../../services/api'

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const { data, isValidating, error, mutate } = useSWR('/profile', url =>
		api.get(url).then(res => res.data)
	)

	return (
		<AuthContext.Provider
			value={{
				user: data,
				mutate,
				isValidating,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

function useAuth(): AuthContextData {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider')
	}

	return context
}

export { AuthProvider, useAuth }
