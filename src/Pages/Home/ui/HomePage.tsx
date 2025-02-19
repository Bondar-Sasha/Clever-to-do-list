import {FC, useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {useAuthState, useSignOut} from 'react-firebase-hooks/auth'
import {FaPenAlt} from 'react-icons/fa'

import styles from '../styles/home.module.css'
import {auth, db, formatDate, IDate, useTasks} from '@/Shared'
import {Button, Checkbox} from '@mui/material'
import {DownloadMask, NotFoundMask} from '@/Widgets'
import {doc, updateDoc} from 'firebase/firestore'

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

const generateDates = (currentDate: Date, month: number): IDate[] => {
  const dates: IDate[] = []
  currentDate.setDate(1)

  for (let i = 0; i < month; i++) {
    const newMonthDate = new Date(currentDate)
    newMonthDate.setMonth(currentDate.getMonth() + i)
    const daysInMonth = new Date(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth() + 1,
      0
    ).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const newDate = new Date(newMonthDate)
      newDate.setDate(day)
      const dateWithoutTime = formatDate(newDate)
      dates.push(dateWithoutTime)
    }
  }

  return dates
}

const thisDay = formatDate(new Date())

const HomePage: FC = () => {
  const navigate = useNavigate()
  const [signOut] = useSignOut(auth)
  const [user] = useAuthState(auth)

  const days = generateDates(new Date(thisDay), 1)
  const [pickedDay, setPickedDay] = useState<IDate>(thisDay)
  const pickedDayRef = useRef<HTMLDivElement | null>(null)

  const [data, dataFetching] = useTasks()

  useEffect(() => {
    if (!pickedDayRef.current) {
      return
    }
    pickedDayRef.current.scrollIntoView({
      behavior: 'instant',
      inline: 'center',
    })
  }, [dataFetching])

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

  if (dataFetching) {
    return <DownloadMask />
  }

  const pickedDayData = data?.[pickedDay]
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
            const formalDateForm = new Date(dateItem)
            const dayName = formalDateForm.toLocaleString('en-US', {
              weekday: 'short',
            })

            let isDoneTask = false
            let isUnDoneTask = false

            if (data?.[dateItem]) {
              isDoneTask = !!data[dateItem].find((item) => item.isDone === true)
              isUnDoneTask = !!data[dateItem].find(
                (item) => item.isDone === false
              )
            }

            return (
              <div
                className="flex flex-col items-center mr-4"
                ref={dateItem === pickedDay ? pickedDayRef : undefined}
                key={dateItem}
              >
                <div
                  onClick={() => {
                    setPickedDay(dateItem)
                  }}
                  className={`${styles.dayDefault} ${getDayStyles(dateItem === pickedDay)(formalDateForm.getDay() === 0)}`}
                >
                  <span className="text-xl">{dayName}</span>
                  <span className="text-lg">{formalDateForm.getDate()}</span>
                </div>
                <div className="flex justify-around w-6 h-2">
                  {isDoneTask && (
                    <div className="w-2 h-full rounded-full bg-theme"></div>
                  )}
                  {isUnDoneTask && (
                    <div className="w-2 h-full rounded-full bg-gray-400"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col h-64 min-h-fit items-center mt-5 mb-5">
          {pickedDayData ? (
            pickedDayData.map(({title, id, isDone, date}) => (
              <div
                key={id}
                className="flex items-center justify-between w-full min-h-16 mb-3 cursor-pointer hover:bg-gray-100 pr-3"
              >
                <Checkbox
                  onClick={() => {
                    updateDoc(doc(db, 'task', id), {
                      isDone: !isDone,
                    })
                  }}
                  checked={isDone}
                  size="large"
                  sx={{
                    '&.Mui-checked': {
                      color: '#ed6e47',
                    },
                  }}
                />
                <div
                  className="text-xl mx-3 hover:underline"
                  onClick={() => navigate(`/tasks/${date}/${id}`)}
                >
                  {title}
                </div>
                <FaPenAlt
                  className="text-theme cursor-pointer text-xl"
                  onClick={() => navigate(`/edit_task/${date}/${id}`)}
                />
              </div>
            ))
          ) : (
            <NotFoundMask label="There are no tasks for this day" />
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
