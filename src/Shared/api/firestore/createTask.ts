import {addDoc, collection, doc, setDoc, getDoc} from 'firebase/firestore'

import {db} from '../../config/firebase'
import {IDate, Task} from '../../types'

interface CreateTaskArgs {
  date: IDate
  userId: string
  task: Task
}

export async function createTask({
  userId,
  task,
  date,
}: CreateTaskArgs): Promise<void> {
  const userRef = doc(db, 'user', userId)
  const dateRef = doc(db, 'date', date)

  const [userDoc, dateDoc] = await Promise.all([
    getDoc(userRef),
    getDoc(dateRef),
  ])

  if (!userDoc.exists()) {
    await setDoc(userRef, {userId})
  }

  if (!dateDoc.exists()) {
    await setDoc(dateRef, {date})
  }

  await addDoc(collection(db, 'task'), {
    ...task,
    isDone: false,
    userRef: userRef,
    dateRef: dateRef,
  })
}
