import {FC} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {Link, useNavigate} from 'react-router-dom'
import Alert from '@mui/material/Alert'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {FirebaseError} from 'firebase/app'
import {auth} from '@/Shared'
import {toast} from 'react-toastify'

interface LoginFormData {
  email: string
  password: string
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required('email is required')
    .matches(
      /^[A-Za-z0-9@._]+$/,
      'email must contain only Latin letters, numbers, and valid email characters'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const initialValues: LoginFormData = {
  email: '',
  password: '',
}
const onSubmit = async ({email, password}: LoginFormData) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    const firebaseError = error as FirebaseError
    toast(firebaseError.message, {type: 'error'})
  }
}
const LoginPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative w-3/5 m-3">
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({errors}) => (
            <>
              <div className="absolute w-full top-16">
                {errors.email && (
                  <Alert severity="error" className="mb-2">
                    {errors.email}
                  </Alert>
                )}
                {errors.password && (
                  <Alert severity="error">{errors.password}</Alert>
                )}
              </div>

              <Form className={`text-ordinary-text flex flex-col w-full`}>
                <Field
                  as={TextField}
                  label="email"
                  name="email"
                  variant="outlined"
                  sx={{
                    marginBottom: '10px',
                  }}
                />
                <Field
                  as={TextField}
                  label="password"
                  name="password"
                  variant="outlined"
                  sx={{
                    marginBottom: '10px',
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{borderRadius: '20px', height: '40px'}}
                >
                  Log in
                </Button>
              </Form>
            </>
          )}
        </Formik>
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
