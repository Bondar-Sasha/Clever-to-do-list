import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore'

import {db} from '../../config/firebase'
import {IDate, TaskWithIsDoneFlag} from '../../types'

interface GetTasksArgs {
  startDate: IDate
  endDate: IDate
  userId: string
}

export async function getTasks({
  userId,
  startDate,
  endDate,
}: GetTasksArgs): Record<IDate, TaskWithIsDoneFlag> | null {
  const userRef = doc(db, 'user', userId)

  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    return null
  }

  const taskQuerySnapshot = await getDocs(
    query(
      collection(db, 'task'),
      where('userRef', '==', userRef),
      where('date', '>=', new Date(startDate)),
      where('date', '<=', new Date(endDate))
    )
  )

  if (taskQuerySnapshot.empty) {
    return null
  }

  console.log(taskQuerySnapshot.docs)
}
