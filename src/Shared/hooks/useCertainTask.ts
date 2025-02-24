import {query, where, collection} from 'firebase/firestore'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

import {db} from '../config/firebase'
import {TaskResponse} from '../types'
import {auth} from '../api'

interface UseCertainTask {
  taskId?: string
}

interface UseCertainTaskResponse {
  data: TaskResponse | null
  isFetching: boolean
}

export const useCertainTask = ({
  taskId,
}: UseCertainTask): UseCertainTaskResponse => {
  const [user] = useAuthState(auth)

  const [data, isFetching] = useCollectionData(
    taskId && user?.uid
      ? query(
          collection(db, 'task'),
          where('id', '==', taskId),
          where('user', '==', user.uid)
        )
      : null
  )

  return {data: data?.[0] as TaskResponse, isFetching}
}
