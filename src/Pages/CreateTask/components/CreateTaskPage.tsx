import {FC, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Field, Form, Formik, FormikHelpers} from 'formik'
import {Alert, Button, TextField} from '@mui/material'
import {MdExpandLess} from 'react-icons/md'
import * as Yup from 'yup'
import {useAuthState} from 'react-firebase-hooks/auth'
import {addDoc, collection} from 'firebase/firestore'

import {auth, db, formatDate, Params} from '@/Shared'
import {NotFoundMask} from '@/Widgets'

interface AddTaskData {
  title: string
  description: string
}

const CreateTaskPage: FC = () => {
  const navigate = useNavigate()
  const [fetching, setFetching] = useState<boolean>(false)
  const params = useParams<Params>()
  const [user] = useAuthState(auth)

  if (!user) {
    return <NotFoundMask label="You need to be authorized" />
  }

  if (!params?.date) {
    return <NotFoundMask label="There is no such page" />
  }

  const dateForChecking = new Date(params.date)

  if (isNaN(dateForChecking.getTime())) {
    return <NotFoundMask label="There is no such page" />
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('title is required'),
    description: Yup.string(),
  })

  const initialValues: AddTaskData = {
    title: '',
    description: '',
  }

  const onSubmit = async (
    taskData: AddTaskData,
    {resetForm}: FormikHelpers<AddTaskData>
  ) => {
    try {
      setFetching(true)
      await addDoc(collection(db, 'task'), {
        ...taskData,
        isDone: false,
        user: user.uid,
        date: formatDate(dateForChecking),
      })
      resetForm()
      setFetching(false)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="relative">
      <header className="flex items-center mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        />
        <h1 className="text-3xl font-bold">Add a task</h1>
      </header>
      <div className="stretching flex items-center flex-col">
        <Formik
          initialValues={initialValues}
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
                  label="title"
                  name="title"
                  variant="outlined"
                  sx={{
                    marginBottom: '12px',
                  }}
                />
                <Field
                  as={TextField}
                  label="description"
                  name="description"
                  variant="outlined"
                  sx={{
                    marginBottom: '12px',
                  }}
                />
                <Button
                  loading={fetching}
                  type="submit"
                  variant="contained"
                  sx={{borderRadius: '20px', height: '40px'}}
                >
                  add the task
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CreateTaskPage
