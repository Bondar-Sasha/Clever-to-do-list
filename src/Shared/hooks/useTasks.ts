import {collection, query, where} from 'firebase/firestore'
import {endOfMonth, startOfMonth} from 'date-fns'
import {useCollection} from 'react-firebase-hooks/firestore'

import {db} from '../config/firebase'
import {IDate, TaskResponse} from '../types'
import {formatDate} from '../utils'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../api'

interface UseTasksResponse {
  data: Record<IDate, TaskResponse[]> | null | undefined
  isFetching: boolean
}

function getMonthStartAndEnd(date: Date) {
  const startOfMonthDate = startOfMonth(date)
  const endOfMonthDate = endOfMonth(date)

  return [formatDate(startOfMonthDate), formatDate(endOfMonthDate)]
}

export const useTasks = (): UseTasksResponse => {
  const dateRestrictions = getMonthStartAndEnd(new Date())
  const [user] = useAuthState(auth)

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
    return {data: null, isFetching}
  }
  const preparedResponse: UseTasksResponse['data'] = data.docs.reduce(
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

  return {data: preparedResponse, isFetching}
}
