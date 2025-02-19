import {FC, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MdExpandLess} from 'react-icons/md'
import {useAuthState} from 'react-firebase-hooks/auth'
import {addDoc, collection} from 'firebase/firestore'
import {FormikHelpers} from 'formik'

import {auth, db, formatDate, Params} from '@/Shared'
import {NotFoundMask, TaskForm, TaskFormData} from '@/Widgets'

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

  const onSubmit = async (
    taskData: TaskFormData,
    {resetForm}: FormikHelpers<TaskFormData>
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
        <TaskForm
          onSubmit={onSubmit}
          onSubmitLabel="create the task"
          isFetching={fetching}
        />
      </div>
    </div>
  )
}

export default CreateTaskPage
