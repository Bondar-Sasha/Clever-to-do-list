import {FC, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MdExpandLess} from 'react-icons/md'
import {doc, updateDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'

import {db, formatDate, Params, useTasks} from '@/Shared'
import {NotFoundMask, TaskForm, TaskFormData} from '@/Widgets'

const EditTaskPage: FC = () => {
  const navigate = useNavigate()
  const [fetching, setFetching] = useState<boolean>(false)
  const params = useParams<Params>()

  const [data, tasksFetching] = useTasks()

  useEffect(() => {
    if (!data && !tasksFetching) {
      toast('error', {type: 'error'})
    }
  }, [data, tasksFetching])

  console.log(data, tasksFetching)
  if (tasksFetching) {
    return <div>loading</div>
  }

  if (!params?.taskId || !params?.date) {
    return <NotFoundMask label="There is no such page" />
  }

  const dateForChecking = new Date(params.date)

  if (isNaN(dateForChecking.getTime())) {
    return <NotFoundMask label="There is no such page" />
  }
  if (!data) {
    return null
  }

  const onSubmit = async (taskData: TaskFormData) => {
    try {
      setFetching(true)
      await updateDoc(doc(db, 'task', params.taskId!), {...taskData})
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
        <h1 className="text-3xl font-bold">Edit the task</h1>
      </header>
      <div className="stretching flex items-center flex-col">
        <TaskForm
          onSubmit={onSubmit}
          onSubmitLabel="commit changes"
          isFetching={fetching}
          values={data[formatDate(dateForChecking)].find(
            (item) => item.id === params.taskId
          )}
        />
      </div>
    </div>
  )
}

export default EditTaskPage
