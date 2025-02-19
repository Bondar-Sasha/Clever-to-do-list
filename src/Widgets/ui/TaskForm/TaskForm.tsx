import {FC} from 'react'
import {Field, Form, Formik, FormikHelpers} from 'formik'
import * as Yup from 'yup'
import {Alert, Button, TextField} from '@mui/material'

export interface TaskFormData {
  title: string
  description: string
}
interface TaskFormProps {
  values?: TaskFormData
  onSubmitLabel: string
  onSubmit: (
    formData: TaskFormData,
    helpers: FormikHelpers<TaskFormData>
  ) => Promise<void>
  isFetching?: boolean
}

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
  description: Yup.string(),
})

const initialValues: TaskFormData = {
  title: '',
  description: '',
}

const TaskForm: FC<TaskFormProps> = ({
  onSubmit,
  onSubmitLabel,
  values,
  isFetching = false,
}) => {
  return (
    <Formik
      initialValues={values ?? initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({errors}) => (
        <>
          <div className="absolute w-full top-16">
            {errors.title && (
              <Alert severity="error" className="mb-2">
                {errors.title}
              </Alert>
            )}
          </div>

          <Form className={`text-ordinary-text flex flex-col w-full`}>
            <Field
              as={TextField}
              label="task title"
              name="title"
              variant="outlined"
              sx={{
                marginBottom: '12px',
              }}
            />
            <Field
              as={TextField}
              label="task description"
              name="description"
              variant="outlined"
              className="mb-3"
              sx={{
                marginBottom: '12px',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              loading={isFetching}
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

export default TaskForm
