import React, { useCallback } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";

// import { Container } from './styles';

const Login: React.FC = () => {
	const handleClick = useCallback(() => {
    signIn('google')
  }, [])

  const { data } = useSession()

	return (
		<div>
			<button type="button" onClick={handleClick}>
				login
			</button>

      <div>data:
        <pre>
          {JSON.stringify(data?.user)}
        </pre>
      </div>
		</div>
	)
}

export default Login
