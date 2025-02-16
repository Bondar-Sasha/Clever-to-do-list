import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {RootState} from '../store'
import {IDate, PreparedTaskResponse} from '@/Shared'

interface Task {
  id: string
  title: string
  description: string
  isDone: boolean
}

interface EditTaskRequest {
  date: IDate
  task: Task
}

interface DeleteTaskRequest {
  taskId: string
  date: IDate
}

type InitialState = PreparedTaskResponse

const initialState: InitialState = {}
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    editTask: (
      state,
      {payload: {date, task}}: PayloadAction<EditTaskRequest>
    ) => {
      state[date][task.id] = {
        title: task.title,
        isDone: task.isDone,
        description: task.description,
      }
    },
    deleteTask: (
      state,
      {payload: {date, taskId}}: PayloadAction<DeleteTaskRequest>
    ) => {
      delete state[date][taskId]
    },
    addTasks: (state, action: PayloadAction<PreparedTaskResponse>) => {
      return {...state, ...action.payload}
    },
  },
})
export const selectorTasks = (state: RootState) => state.tasks
export const {editTask, deleteTask, addTasks} = taskSlice.actions
export default taskSlice.reducer
