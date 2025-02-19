import {FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MdExpandLess} from 'react-icons/md'
import {FaPenAlt} from 'react-icons/fa'

import {formatDate, Params, useTasks} from '@/Shared'
import {DownloadMask, NotFoundMask} from '@/Widgets'

const TaskPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams<Params>()

  const [data, tasksFetching] = useTasks()

  if (!params?.taskId || !params?.date) {
    return <NotFoundMask label="There is no such page" />
  }

  const dateForChecking = new Date(params.date)

  if (isNaN(dateForChecking.getTime())) {
    return <NotFoundMask label="There is no such page" />
  }

  if (tasksFetching) {
    return <DownloadMask />
  }
  const task = data?.[formatDate(dateForChecking)]?.find(
    (item) => item.id === params.taskId
  )
  return (
    <div className="relative">
      <header className="flex items-center justify-between mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        />
        <h1 className="text-3xl font-bold grow">Task</h1>
        {task && (
          <FaPenAlt
            className="text-theme cursor-pointer text-xl"
            onClick={() => navigate(`/edit_task/${task.date}/${task.id}`)}
          />
        )}
      </header>
      <div className="stretching flex items-center flex-col">
        {task ? (
          <>
            <h1 className="mb-3 text-3xl">{task.title}</h1>
            <span>{task.description}</span>
          </>
        ) : (
          <NotFoundMask label="There is no such page" />
        )}
      </div>
    </div>
  )
}

export default TaskPage
