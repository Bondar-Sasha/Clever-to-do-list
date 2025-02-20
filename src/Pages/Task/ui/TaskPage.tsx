import {FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MdExpandLess} from 'react-icons/md'
import {FaPenAlt} from 'react-icons/fa'

import {formatDate, Params, useCertainTask} from '@/Shared'
import {DownloadMask, NotFoundMask} from '@/Widgets'

const TaskPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams<Params>()

  const [task, taskFetching] = useCertainTask({taskId: params?.taskId})

  const notFoundUI = (
    <div>
      <header className="flex items-center justify-between mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/', {
              state: null,
              replace: true,
            })
          }}
        />
        <h1 className="text-3xl font-bold grow">Task</h1>
      </header>
      <NotFoundMask label="There is no such task" />
    </div>
  )

  if (!params?.taskId) {
    return notFoundUI
  }

  if (taskFetching) {
    return <DownloadMask />
  }
  if (!task) {
    return notFoundUI
  }

  return (
    <>
      <header className="flex items-center justify-between mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/', {
              state: formatDate(new Date(task.date)),
              replace: true,
            })
          }}
        />
        <h1 className="text-3xl font-bold grow">Task</h1>
        <FaPenAlt
          className="text-theme cursor-pointer text-xl"
          onClick={() => navigate(`/task_management/${task.id}`)}
        />
      </header>
      <div className="stretching flex items-center flex-col">
        <h1 className="mb-3 text-3xl">{task.title}</h1>
        <span>{task.description}</span>
      </div>
    </>
  )
}

export default TaskPage
