import {addDoc, collection, doc, setDoc, getDoc} from 'firebase/firestore'

import {db} from '../../config/firebase'

interface Date {
  year: number
  month: number
  day: number
}

interface Task {
  title: string
  description: string
}

interface CreateTaskArgs {
  date: Date
  userId: string
  task: Task
}

export async function createTask({
  userId,
  task,
  date,
}: CreateTaskArgs): Promise<void> {
  const userRef = doc(db, 'user', userId)
  const dateRef = doc(db, 'date', JSON.stringify(date))

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
