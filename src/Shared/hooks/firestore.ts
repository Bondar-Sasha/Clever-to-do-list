import {useEffect, useState} from 'react'

import {useUserCredentials} from './firebase'
import {getTasks, PreparedTaskResponse} from '../api'
import {IDate} from '../types'

export const useGetTasks = (pickedDay: IDate) => {
  const {user} = useUserCredentials()
  const [tasks, setTasks] = useState<PreparedTaskResponse | null>(null)
  const [fetching, setFetching] = useState<boolean>(false)

  useEffect(() => {
    if (!user) {
      return
    }

    const handleGetTasks = async () => {
      setFetching(true)
      const tasks = await getTasks({
        currentDate: new Date(pickedDay),
        userId: user.uid,
      })
      setTasks(tasks)
      setFetching(false)
    }

    handleGetTasks()
  }, [pickedDay, user])
  return {data: tasks, isFetching: fetching}
}
