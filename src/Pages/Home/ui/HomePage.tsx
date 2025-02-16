import {FC, useState} from 'react'
import {signOut} from 'firebase/auth'
import {Link} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {FirebaseError} from 'firebase/app'
import {toast} from 'react-toastify'

import styles from '../styles/home.module.css'
import {auth, useUserCredentials, IDate, createTask, getTasks} from '@/Shared'

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
      const dateString: IDate =
        `${year}-${String(effectiveMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` as IDate
      dates.push(dateString)
    }
  }

  return dates
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    const firebaseError = error as FirebaseError
    toast(firebaseError.message, {type: 'error'})
  }
}
const HomePage: FC = () => {
  const [monthState] = useState<number>(1)
  const days = generateDates(monthState)
  const [pickedDay, setPickedDay] = useState<IDate>(days[0])
  const {user} = useUserCredentials()

  if (user) {
    createTask({
      userId: user.uid,
      task: {title: 'test', description: 'test'},
      date: pickedDay,
    })
    getTasks({startDate: pickedDay, endDate: pickedDay, userId: user.uid})
  }

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Home</h1>
        {user ? (
          <TbLogout2
            className="cursor-pointer text-theme text-2xl"
            onClick={handleSignOut}
          />
        ) : (
          <Link to="/auth/login" className="text-theme hover:underline">
            log in
          </Link>
        )}
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
      </main>
    </>
  )
}

export default HomePage
