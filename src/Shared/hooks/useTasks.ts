import {collection, query, where} from 'firebase/firestore'
import {useCollection} from 'react-firebase-hooks/firestore'

import {db} from '../config/firebase'
import {IDate, TaskResponse} from '../types'
import {formatDate} from '../utils'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../api'

type UseTasksResponse =
  | [Record<IDate, TaskResponse[]>, boolean]
  | [null, boolean]

function getMonthStartAndEnd(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  return [formatDate(startOfMonth), formatDate(endOfMonth)]
}

export function useTasks(): UseTasksResponse {
  const dateRestrictions = getMonthStartAndEnd(new Date())
  const [user, userFetching] = useAuthState(auth)

  const [data, isFetching] = useCollection(
    user?.uid
      ? query(
          collection(db, 'task'),
          where('user', '==', user.uid),
          where('date', '>=', dateRestrictions[0]),
          where('date', '<=', dateRestrictions[1])
        )
      : null
  )
  if (!data) {
    return [null, isFetching || userFetching]
  }
  const preparedResponse: UseTasksResponse[0] = data.docs.reduce(
    (acc, doc) => {
      const taskResponse = doc.data() as Omit<TaskResponse, 'id'>
      const taskDate = taskResponse.date

      if (!acc[taskDate]) {
        acc[taskDate] = []
      }

      acc[taskDate].push({...taskResponse, id: doc.id})
      return acc
    },
    {} as Record<IDate, TaskResponse[]>
  )

  return [preparedResponse, isFetching || userFetching] as UseTasksResponse
}
