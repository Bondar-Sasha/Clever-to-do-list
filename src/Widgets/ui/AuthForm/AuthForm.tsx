import {FC} from 'react'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {Alert, Button, TextField} from '@mui/material'

import {PasswordInput} from '@/Entities'

export interface AuthFormData {
  email: string
  password: string
}
interface AuthFormProps {
  onSubmitLabel: string
  onSubmit: (formData: AuthFormData) => Promise<void>
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

const initialValues: AuthFormData = {
  email: '',
  password: '',
}

const AuthForm: FC<AuthFormProps> = ({onSubmit, onSubmitLabel}) => {
  return (
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
                marginBottom: '12px',
              }}
            />
            <Field
              as={PasswordInput}
              label="password"
              name="password"
              variant="outlined"
              className="mb-3"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{borderRadius: '20px', height: '40px'}}
            >
              {onSubmitLabel}
            </Button>
          </Form>
        </>
      )}
    </Formik>
  )
}

export default AuthForm
