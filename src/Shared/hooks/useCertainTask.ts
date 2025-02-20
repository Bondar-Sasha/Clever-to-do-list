import {doc} from 'firebase/firestore'
import {useDocument} from 'react-firebase-hooks/firestore'

import {db} from '../config/firebase'
import {TaskResponse} from '../types'

interface UseCertainTask {
  taskId?: string
}

export const useCertainTask = ({
  taskId,
}: UseCertainTask): [TaskResponse | null, boolean] => {
  const [data, isFetching] = useDocument(
    taskId ? doc(db, 'task', taskId) : null
  )

  if (!data?.exists()) {
    return [null, isFetching]
  }

  return [{...(data.data() as TaskResponse), id: data.id}, isFetching]
}
