import {collection, query, where} from 'firebase/firestore'
import {useCollectionOnce} from 'react-firebase-hooks/firestore'

import {db} from '../config/firebase'
import {IDate, TaskResponse} from '../types'
import {formatDate} from '../utils'

interface GetTasksArgs {
  currentDate: Date
  userId?: string
}
type UseTasksResponse = [Record<IDate, TaskResponse[]>, boolean] | [null, false]

function getMonthStartAndEnd(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  return [formatDate(startOfMonth), formatDate(endOfMonth)]
}

export function useTasks({
  userId,
  currentDate,
}: GetTasksArgs): UseTasksResponse {
  const dateRestrictions = getMonthStartAndEnd(currentDate)

  const [data, isFetching] = useCollectionOnce(
    userId
      ? query(
          collection(db, 'task'),
          where('user', '==', userId),
          where('date', '>=', dateRestrictions[0]),
          where('date', '<=', dateRestrictions[1])
        )
      : null
  )
  if (!data) {
    return [null, false]
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

  return [preparedResponse, isFetching] as UseTasksResponse
}
