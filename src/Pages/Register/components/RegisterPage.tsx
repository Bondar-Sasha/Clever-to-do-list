import {FC} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {Link, useNavigate} from 'react-router-dom'
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {toast} from 'react-toastify'

import {auth} from '@/Shared'
import {AuthForm, AuthFormData} from '@/Widgets'

const RegisterPage: FC = () => {
  const navigate = useNavigate()

  const [signUp, , loading, error] = useCreateUserWithEmailAndPassword(auth)

  if (error) {
    toast(error.message, {type: 'error'})
  }

  const onSubmit = async ({email, password}: AuthFormData) => {
    signUp(email, password)
  }
  return (
    <div className="relative w-3/5">
      <header className="flex items-center mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        />
        <h1 className="text-3xl font-bold">Sign up</h1>
      </header>
      <main>
        <AuthForm
          onSubmit={onSubmit}
          onSubmitLabel="Sign up"
          isFetching={loading}
        />
        <div className="mt-4 flex justify-between w-full">
          <span>I already have an account</span>
          <Link to="/auth/login" className="text-theme hover:underline">
            log in
          </Link>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
