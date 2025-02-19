export interface TaskRequest {
  title: string
  description: string
  isDone: boolean
}

export type IDate = `${number}-${number}-${number}`

export interface TaskResponse {
  id: string
  title: string
  description: string
  isDone: boolean
  date: IDate
  user: string
}
