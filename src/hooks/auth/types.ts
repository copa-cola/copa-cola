import { User } from '@prisma/client'
import { KeyedMutator } from 'swr'

export interface AuthContextData {
	user: User | null
	isValidating: boolean
  mutate: KeyedMutator<any>
}
