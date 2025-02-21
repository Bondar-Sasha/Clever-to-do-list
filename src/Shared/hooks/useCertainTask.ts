import {doc} from 'firebase/firestore'
import {useDocument} from 'react-firebase-hooks/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

import {db} from '../config/firebase'
import {TaskResponse} from '../types'
import {auth} from '../api'

interface UseCertainTask {
  taskId?: string
}

export const useCertainTask = ({
  taskId,
}: UseCertainTask): [TaskResponse | null, boolean] => {
  const [user] = useAuthState(auth)

  const [data, isFetching] = useDocument(
    taskId ? doc(db, 'task', taskId) : null
  )

  if (!data?.exists() || data.data().userId !== user?.uid) {
    return [null, isFetching]
  }

  return [{...(data.data() as TaskResponse), id: data.id}, isFetching]
}
