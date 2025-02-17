import {FC} from 'react'
import {useParams} from 'react-router-dom'

import {createTask, formatDate, Params, useUserCredentials} from '@/Shared'

const CreateTaskPage: FC = () => {
  // const navigate = useNavigate()
  const params = useParams<Params>()
  const {user} = useUserCredentials()

  if (!params?.date) {
    return <div className="stretching flex items-center flex-col"></div>
  }

  const dateForChecking = new Date(params.date)

  if (!(dateForChecking instanceof Date && !isNaN(dateForChecking.getTime()))) {
    return <div className="stretching flex items-center flex-col"></div>
  }

  const formattedDate = formatDate(dateForChecking)

  return (
    <div
      className="stretching flex items-center flex-col"
      onClick={() =>
        createTask({
          date: formattedDate,
          userId: user?.uid ?? 'dsfsd',
          task: {title: 'New Task', description: 'New Description'},
        })
      }
    >
      Formatted Date: {formattedDate}
    </div>
  )
}

export default CreateTaskPage
