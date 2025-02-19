import {FC, useEffect} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {Link, useNavigate} from 'react-router-dom'
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {toast} from 'react-toastify'

import {auth} from '@/Shared'
import {AuthForm, AuthFormData} from '@/Widgets'

const LoginPage: FC = () => {
  const navigate = useNavigate()

  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth)

  const onSubmit = async ({email, password}: AuthFormData) => {
    signInWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    if (error) {
      toast(error.message, {type: 'error'})
    }
  }, [error])

  return (
    <div className="relative w-3/5">
      <header className="flex items-center mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        />
        <h1 className="text-3xl font-bold">Log in</h1>
      </header>
      <main>
        <AuthForm
          onSubmit={onSubmit}
          onSubmitLabel="Log in"
          isFetching={loading}
        />
        <div className="mt-4 flex justify-between w-full">
          <span>I do not have an account</span>
          <Link to="/auth/registration" className="text-theme hover:underline">
            sign up
          </Link>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
