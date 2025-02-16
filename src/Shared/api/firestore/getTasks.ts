import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore'

import {db} from '../../config/firebase'
import {IDate, TaskResponse, TaskWithIsDoneFlag} from '../../types'
import {formatDate} from '../../utils'

interface GetTasksArgs {
  currentDate: Date
  userId: string
}

export type PreparedTaskResponse = Record<
  IDate,
  Record<string, TaskWithIsDoneFlag>
> | null

function getMonthStartAndEnd(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  return [formatDate(startOfMonth), formatDate(endOfMonth)]
}

export async function getTasks({
  userId,
  currentDate,
}: GetTasksArgs): Promise<PreparedTaskResponse> {
  const userRef = doc(db, 'user', userId)

  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    return null
  }
  const dateRestrictions = getMonthStartAndEnd(currentDate)
  const dateQuerySnapshot = await getDocs(
    query(
      collection(db, 'date'),
      where('date', '>=', dateRestrictions[0]),
      where('date', '<=', dateRestrictions[1])
    )
  )

  if (dateQuerySnapshot.empty) {
    return null
  }

  const dateRefs = dateQuerySnapshot.docs.map((docs) => {
    return doc(db, 'date', docs.id)
  })

  const taskQuerySnapshot = await getDocs(
    query(
      collection(db, 'task'),
      where('userRef', '==', userRef),
      where('dateRef', 'in', dateRefs)
    )
  )

  if (taskQuerySnapshot.empty) {
    return null
  }

  const preparedResponse: PreparedTaskResponse = {}

  taskQuerySnapshot.forEach((doc) => {
    const taskData = doc.data() as TaskResponse
    const taskDate = taskData.dateRef.id as IDate

    if (!preparedResponse[taskDate]) {
      preparedResponse[taskDate] = {}
    }

    preparedResponse[taskDate][doc.id] = {
      description: taskData.description,
      title: taskData.title,
      isDone: taskData.isDone,
    }
  })

  return preparedResponse
}
