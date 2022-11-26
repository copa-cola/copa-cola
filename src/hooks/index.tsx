import React from 'react'
import { AuthProvider } from './auth'

const AppProvider = ({ children }: React.PropsWithChildren) => <AuthProvider>{children}</AuthProvider>

export default AppProvider
