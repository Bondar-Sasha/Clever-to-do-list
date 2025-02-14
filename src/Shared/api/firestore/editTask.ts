import {doc, updateDoc} from 'firebase/firestore'

import {db} from '../../config/firebase'

interface Task {
  title: string
  description: string
  isDone: boolean
}

interface EditTaskArgs {
  taskId: string
  task: Partial<Task>
}

export async function editTasks({taskId, task}: EditTaskArgs): Promise<void> {
  const taskRef = doc(db, 'task', taskId)
  await updateDoc(taskRef, task)
}
