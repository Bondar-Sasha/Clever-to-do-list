import {FC, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {toast} from 'react-toastify'
import {useAuthState, useSignOut} from 'react-firebase-hooks/auth'

import styles from '../styles/home.module.css'
import {auth, IDate, formatDate, useTasks} from '@/Shared'
import {Button} from '@mui/material'

const getDayStyles = (isPickedDay: boolean) => {
  const dayStylesMap = {
    sunday: 'text-theme bg-white border-2 border-theme',
    picked: 'bg-blueGray-900 text-white',
    ordinary: 'bg-white border-2 border-gray-400',
  }
  return (isSunday: boolean) => {
    if (isPickedDay) {
      return dayStylesMap.picked
    }
    if (isSunday) {
      return dayStylesMap.sunday
    }
    return dayStylesMap.ordinary
  }
}

function generateDates(monthsCount: number): IDate[] {
  const currentDate = new Date()
  const dates: IDate[] = []

  for (let monthOffset = 0; monthOffset < monthsCount; monthOffset++) {
    const year =
      currentDate.getFullYear() +
      Math.floor((currentDate.getMonth() + monthOffset) / 12)
    const effectiveMonth = (currentDate.getMonth() + monthOffset) % 12
    const lastDayOfMonth = new Date(year, effectiveMonth + 1, 0).getDate()
    const startDay = monthOffset === 0 ? currentDate.getDate() : 1

    for (let day = startDay; day <= lastDayOfMonth; day++) {
      const dateString: IDate = formatDate(new Date(year, effectiveMonth, day))
      dates.push(dateString)
    }
  }

  return dates
}

const HomePage: FC = () => {
  const navigate = useNavigate()
  const [signOut] = useSignOut(auth)
  const [user, , signOutError] = useAuthState(auth)

  const [monthState] = useState<number>(1)
  const days = generateDates(monthState)
  const [pickedDay, setPickedDay] = useState<IDate>(days[0])

  const {data} = useTasks({
    userId: user!.uid,
    currentDate: new Date(pickedDay),
  })
  // console.log(isFetching)
  // if (isFetching) {
  //   return <div>data f</div>
  // }

  if (!user) {
    return (
      <>
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Home</h1>
          <Link to="/auth/login" className="text-theme hover:underline">
            log in
          </Link>
        </header>
        <main className="flex-center h-64">
          <span className="text-xl">Log in to see the tasks</span>
        </main>
      </>
    )
  }

  if (signOutError) {
    toast(signOutError.message, {type: 'error'})
  }

  const tasksForDay = data?.[pickedDay]
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Home</h1>
        <TbLogout2
          className="cursor-pointer text-theme text-2xl"
          onClick={signOut}
        />
      </header>
      <main>
        <div className={`flex ${styles.daysContainer}`}>
          {days.map((dateItem) => {
            const preparedDate = new Date(dateItem)

            const dayNumber = preparedDate.getDate()
            const dayName = preparedDate.toLocaleString('en-US', {
              weekday: 'short',
            })

            return (
              <div className="flex flex-col items-center" key={dateItem}>
                <div
                  onClick={() => {
                    setPickedDay(dateItem)
                  }}
                  className={`${styles.dayDefault} ${getDayStyles(dateItem === pickedDay)(preparedDate.getDay() === 0)}`}
                >
                  <span className="text-xl">{dayName}</span>
                  <span className="text-lg">{dayNumber}</span>
                </div>
                <div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col min-h-64 items-center justify-center">
          {tasksForDay ? (
            Object.keys(tasksForDay).map((item) => {
              const task = tasksForDay[item]
              return <div key={item}>{task.title}</div>
            })
          ) : (
            <span className="text-xl">There are no tasks for today</span>
          )}
        </div>
        <Button
          variant="outlined"
          sx={{width: '100%', height: '40px'}}
          onClick={() => {
            navigate(`/create_task/${pickedDay}`)
          }}
        >
          Add task
        </Button>
      </main>
    </>
  )
}

export default HomePage
