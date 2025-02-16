import {DocumentReference} from 'firebase/firestore'

export interface Task {
  title: string
  description: string
}
export interface TaskWithIsDoneFlag {
  isDone: boolean
  title: string
  description: string
}

export interface TaskResponse {
  title: string
  description: string
  isDone: boolean
  dateRef: DocumentReference
  userRef: DocumentReference
}

export type IDate = `${number}-${number}-${number}`
