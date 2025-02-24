import {FC, useEffect, useRef, useState} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {useAuthState, useSignOut} from 'react-firebase-hooks/auth'
import {FaPenAlt} from 'react-icons/fa'
import {doc, updateDoc} from 'firebase/firestore'
import {Button, Checkbox} from '@mui/material'

import styles from '../styles/home.module.css'
import {auth, db, formatDate, generateDates, IDate, useTasks} from '@/Shared'
import {DownloadMask} from '@/Widgets'

const thisDay = formatDate(new Date())

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

const HomePage: FC = () => {
  const {state} = useLocation()

  const navigate = useNavigate()
  const [signOut] = useSignOut(auth)
  const [user] = useAuthState(auth)

  const days = generateDates(thisDay, 1)
  const [pickedDay, setPickedDay] = useState<IDate>(thisDay)
  const pickedDayRef = useRef<HTMLDivElement | null>(null)

  const {data, isFetching} = useTasks()

  useEffect(() => {
    if (!state) {
      return
    }
    setPickedDay(state)
  }, [state])

  useEffect(() => {
    if (!pickedDayRef.current) {
      return
    }

    pickedDayRef.current.scrollIntoView({
      behavior: 'instant',
      inline: 'center',
    })
  }, [isFetching])

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

  if (isFetching) {
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
                ref={dateItem === pickedDay ? pickedDayRef : null}
                className="flex flex-col items-center mr-4"
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
                  className="text-xl mx-3 hover:underline text-ellipsis overflow-hidden w-4/5 whitespace-nowrap"
                  onClick={() => navigate(`/tasks/${id}`)}
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
            <div className="stretching flex-center">
              <span className="text-2xl">There are no tasks for this day</span>
            </div>
          )}
        </div>
        <Button
          variant="outlined"
          sx={{width: '100%', height: '40px'}}
          onClick={() => {
            navigate(`/create_task/${pickedDay}/`)
          }}
        >
          Add task
        </Button>
      </main>
    </>
  )
}

export default HomePage
