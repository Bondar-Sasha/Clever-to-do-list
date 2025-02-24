import {FC, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MdExpandLess} from 'react-icons/md'
import * as Yup from 'yup'
import {useAuthState} from 'react-firebase-hooks/auth'
import {doc, updateDoc, collection, setDoc} from 'firebase/firestore'
import {Alert, Button, TextField} from '@mui/material'

import {auth, db, formatDate, Params, useCertainTask} from '@/Shared'
import {DownloadMask, NotFoundMask} from '@/Widgets'
import {Field, Form, Formik, FormikHelpers} from 'formik'

export interface TaskFormData {
  title: string
  description: string
}

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
  description: Yup.string(),
})

const initialValues: TaskFormData = {
  title: '',
  description: '',
}

const TaskManagement: FC = () => {
  const navigate = useNavigate()

  const [user] = useAuthState(auth)
  const [fetching, setFetching] = useState<boolean>(false)
  const params = useParams<Params>()
  const {data: task, isFetching} = useCertainTask({taskId: params.taskId})

  if (!params?.date) {
    return <NotFoundMask label="Task management" />
  }

  const dateForChecking = new Date(params.date)

  if (isNaN(dateForChecking.getTime())) {
    return <NotFoundMask label="Task management" />
  }
  if (isFetching) {
    return <DownloadMask />
  }
  if (!task && params.taskId) {
    return <NotFoundMask label="Task management" />
  }

  const onSubmit = async (
    taskData: TaskFormData,
    {resetForm}: FormikHelpers<TaskFormData>
  ) => {
    try {
      setFetching(true)
      if (task) {
        await updateDoc(doc(db, 'task', task.id), {...taskData})
      } else {
        const newRef = doc(collection(db, 'task'))
        await setDoc(newRef, {
          ...taskData,
          id: newRef.id,
          isDone: false,
          user: user!.uid,
          date: formatDate(dateForChecking),
        })
        resetForm()
      }
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
            navigate('/', {state: formatDate(dateForChecking), replace: true})
          }}
        />
        <h1 className="text-3xl font-bold">
          {task ? 'Edit the task' : 'Create a task'}
        </h1>
      </header>
      <div className="stretching flex items-center flex-col">
        <Formik
          initialValues={task ?? initialValues}
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
                  loading={fetching}
                  sx={{borderRadius: '20px', height: '40px'}}
                >
                  {task ? 'commit changes' : 'create the task'}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TaskManagement
