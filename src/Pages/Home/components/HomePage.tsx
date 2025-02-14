import {FC} from 'react'
import {signOut} from 'firebase/auth'
import {Link} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'

import {auth, useUserCredentials} from '@/Shared'

const so = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
const HomePage: FC = () => {
  const {user} = useUserCredentials()
  return (
    <div className="w-3/4 stretching">
      <header className="flex justify-between items-center p-3 ">
        <h1 className="text-3xl font-bold">Home</h1>
        {user ? (
          <TbLogout2
            className="cursor-pointer text-theme text-2xl"
            onClick={so}
          />
        ) : (
          <Link to="/auth/login" className="text-theme hover:underline">
            log in
          </Link>
        )}
      </header>
      <main></main>
    </div>
  )
}

export default HomePage
