import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from '../store'

interface Task {
  id: string
  title: string
  description: string
  isDone: boolean
}

type InitialState = Record<Task['id'], Task>

const initialState: InitialState = {}
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    editTask: (state, action: PayloadAction<Task>) => {
      state[action.payload.id] = action.payload
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
    addTasks: (state, action: PayloadAction<Task[]>) => {
      action.payload.forEach((task) => {
        state[task.id] = task
      })
    },
  },
})
export const selectorIsAuth = (state: RootState) => state.tasks
export const {editTask, deleteTask, addTasks} = taskSlice.actions
export default taskSlice.reducer
