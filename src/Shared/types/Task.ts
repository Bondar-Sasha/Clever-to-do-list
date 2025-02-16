export interface Task {
  title: string
  description: string
}
export interface TaskWithIsDoneFlag extends Task {
  isDone: boolean
}

export type IDate = `${number}-${number}-${number}`
