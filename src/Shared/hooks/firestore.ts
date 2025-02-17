import {collection, query, where, doc} from 'firebase/firestore'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'

import {db} from '../config/firebase'
import {IDate, TaskResponse, TaskWithIsDoneFlag} from '../types'
import {formatDate} from '../'
import {useEffect, useState} from 'react'

interface GetTasksArgs {
  currentDate: Date
  userId: string
}

export type PreparedTaskResponse = {
  isFetching: boolean
  data: Record<IDate, Record<string, TaskWithIsDoneFlag>> | null
}

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
}: GetTasksArgs): PreparedTaskResponse {
  const [fetching, setFetching] = useState<boolean>(false)
  const [userDoc, loadingUser] = useDocument(doc(db, 'user', userId))

  const dateRestrictions = getMonthStartAndEnd(currentDate)

  const [dateQuerySnapshot, loadingDates] = useCollection(
    query(
      collection(db, 'date'),
      where('date', '>=', dateRestrictions[0]),
      where('date', '<=', dateRestrictions[1])
    )
  )

  const dateRefs = dateQuerySnapshot?.docs.map((doc) => doc.ref) || ['']

  const [taskQuerySnapshot, loadingTasks] = useCollection(
    query(
      collection(db, 'task'),
      where('userRef', '==', userDoc?.ref || ''),
      where('dateRef', 'in', dateRefs)
    )
  )
  useEffect(() => {
    setFetching(loadingUser || loadingDates || loadingTasks)
  }, [loadingDates, loadingTasks, loadingUser])

  if (!userDoc || !dateQuerySnapshot || !taskQuerySnapshot) {
    return {isFetching: false, data: null}
  }
  const preparedResponse: PreparedTaskResponse = {
    isFetching: fetching,
    data: {},
  }

  taskQuerySnapshot.forEach((doc) => {
    const taskData = doc.data() as TaskResponse
    const taskDate = taskData.dateRef.id as IDate
    if (preparedResponse.data) {
      if (!preparedResponse.data[taskDate]) {
        preparedResponse.data[taskDate] = {}
      }

      preparedResponse.data[taskDate][doc.id] = {
        description: taskData.description,
        title: taskData.title,
        isDone: taskData.isDone,
      }
    }
  })

  return preparedResponse
}
