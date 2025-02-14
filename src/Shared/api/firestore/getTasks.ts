import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore'

import {db} from '../../config/firebase'

interface Date {
  year: number
  month: number
}

interface GetTasksArgs {
  date: Date
  userId: string
}

interface Task {
  title: string
  description: string
  isDone: boolean
}

export async function getTasks({userId, date}: GetTasksArgs) {
  const userRef = doc(db, 'user', userId)

  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    return null
  }

  const taskQuerySnapshot = await getDocs(
    query(
      collection(db, 'task'),
      where('userRef', '==', userRef),
      where('month', '==', date.month),
      where('year', '==', date.year)
    )
  )

  if (taskQuerySnapshot.empty) {
    return null
  }

  const tasks = taskQuerySnapshot.docs.map(({id, data}) => ({
    id,
    ...(data() as Task),
  }))
  return tasks
}
