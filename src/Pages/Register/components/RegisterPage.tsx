import {FC} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {FirebaseError} from 'firebase/app'

import {auth} from '@/Shared'
import {AuthForm, AuthFormData} from '@/Widgets'

const onSubmit = async ({email, password}: AuthFormData) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    const firebaseError = error as FirebaseError
    toast(firebaseError.message, {type: 'error'})
  }
}
const RegisterPage: FC = () => {
  const navigate = useNavigate()

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
        <AuthForm onSubmit={onSubmit} onSubmitLabel="Sign up" />
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
