import {deleteDoc, doc} from 'firebase/firestore'

import {db} from '../../config/firebase'

interface DeleteTaskArgs {
  taskId: string
}

export async function deleteTask({taskId}: DeleteTaskArgs): Promise<void> {
  const taskRef = doc(db, 'task', taskId)
  await deleteDoc(taskRef)
}
