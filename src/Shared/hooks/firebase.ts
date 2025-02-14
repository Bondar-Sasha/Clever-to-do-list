import {User} from 'firebase/auth'
import {useState, useEffect} from 'react'
import {auth} from '../api'

export const useUserCredentials = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setIsFetching(false)
    })

    setIsFetching(true)

    return () => {
      unsubscribe()
    }
  }, [])

  return {user, isFetching}
}
