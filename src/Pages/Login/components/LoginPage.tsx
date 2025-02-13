import {FC} from 'react'
import {FaLessThan} from 'react-icons/fa6'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {Link} from 'react-router-dom'

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
  console.log(email, password)
}
const LoginPage: FC = () => {
  return (
    <>
      <header className="flex">
        <FaLessThan className="mr-3" />
        <h1 className="text-3xl font-bold">Log in</h1>
      </header>
      <main>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className={`text-ordinary-text flex flex-col w-full`}>
              <Field as={TextField} placeholder="email" name="email" />
              <Field as={TextField} placeholder="password" name="email" />

              <Button
                type="submit"
                variant="contained"
                sx={{borderRadius: '25px', height: '50px'}}
              >
                Log in
              </Button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex justify-between w-full">
          <span>I do not have an account</span>
          <Link to="/auth/registration" className="text-theme hover:underline">
            sing up
          </Link>
        </div>
      </main>
      <footer></footer>
    </>
  )
}

export default LoginPage
