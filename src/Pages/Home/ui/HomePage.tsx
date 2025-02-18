import {FC, useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {toast} from 'react-toastify'
import {useAuthState, useSignOut} from 'react-firebase-hooks/auth'
import {FaPenAlt} from 'react-icons/fa'

import styles from '../styles/home.module.css'
import {auth, formatDate, IDate, useTasks} from '@/Shared'
import {Button, Checkbox} from '@mui/material'

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

function generateDates(currentDate: Date, month: number): IDate[] {
  const dates = []
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
  const [user, , signOutError] = useAuthState(auth)

  const days = generateDates(new Date(thisDay), 1)
  const [pickedDay, setPickedDay] = useState<IDate>(thisDay)
  const pickedDayRef = useRef<HTMLDivElement | null>(null)

  const [data] = useTasks()
  console.log(data)

  useEffect(() => {
    if (!pickedDayRef.current) {
      return
    }
    pickedDayRef.current.scrollIntoView({
      behavior: 'instant',
      inline: 'center',
    })
  }, [])

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
  console.log(data)
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
            const dateFromMs = new Date(dateItem)
            const dayName = dateFromMs.toLocaleString('en-US', {
              weekday: 'short',
            })

            return (
              <div
                className="flex flex-col items-center"
                ref={dateItem === pickedDay ? pickedDayRef : undefined}
                key={dateItem}
              >
                <div
                  onClick={() => {
                    setPickedDay(dateItem)
                  }}
                  className={`${styles.dayDefault} ${getDayStyles(dateItem === pickedDay)(dateFromMs.getDay() === 0)}`}
                >
                  <span className="text-xl">{dayName}</span>
                  <span className="text-lg">{dateFromMs.getDate()}</span>
                </div>
                <div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col min-h-64 items-center  mt-5 mb-5">
          {data && data[pickedDay] ? (
            data[pickedDay].map(({title, id, isDone, date}) => {
              return (
                <div className="flex items-center justify-between w-full min-h-16 mb-3">
                  <div>
                    <Checkbox
                      checked={isDone}
                      size="large"
                      sx={{
                        '&.Mui-checked': {
                          color: '#ed6e47',
                        },
                      }}
                    />
                  </div>
                  <div className="text-xl mr-3 ml-3">{title}</div>
                  <FaPenAlt
                    className="text-theme cursor-pointer text-xl"
                    onClick={() => {
                      navigate(`/edit_task/${date}/${id}`)
                    }}
                  />
                </div>
              )
            })
          ) : (
            <>no tas</>
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
