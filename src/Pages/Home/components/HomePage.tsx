import {FC, useState} from 'react'
import {signOut} from 'firebase/auth'
import {Link} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {FirebaseError} from 'firebase/app'
import {toast} from 'react-toastify'

import styles from '../styles/home.module.css'
import {auth, useUserCredentials} from '@/Shared'

const dayStylesMap: {[key: string]: string} = {
  Sun: 'text-theme bg-white border-2 border-theme',
  cur: 'bg-blueGray-900 text-white border-none',
}

function generateDates(monthsCount: number) {
  const datesCache = []
  const currentDate = new Date()

  currentDate.setDate(1)

  const totalMonths = monthsCount > 1 ? monthsCount : 1

  for (let monthOffset = 0; monthOffset < totalMonths; monthOffset++) {
    const month = currentDate.getMonth() + monthOffset
    const year = currentDate.getFullYear() + Math.floor(month / 12)
    const effectiveMonth = month % 12

    const lastDayOfMonth = new Date(year, effectiveMonth + 1, 0).getDate()

    for (
      let day = monthOffset === 0 ? new Date().getDate() : 1;
      day <= lastDayOfMonth;
      day++
    ) {
      const date = new Date(year, effectiveMonth, day)
      const dayOfWeek = date.toLocaleString('en-US', {weekday: 'short'})
      datesCache.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: day,
        weekday: dayOfWeek,
      })
    }
  }

  return datesCache
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
  const {user} = useUserCredentials()
  // if (user)
  //   createTask({
  //     userId: user.uid,
  //     task: {title: 'test', description: 'test'},
  //     date: {year: 2022, month: 1, day: 1},
  //   })
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
        <div className={`flex ${styles.days_container}`}>
          {generateDates(monthState).map(({weekday, ...dayInf}, index) => {
            return (
              <div
                className="flex flex-col items-center"
                key={JSON.stringify(dayInf)}
              >
                <div
                  className={`box-border flex flex-col items-center w-20 h-20 rounded-2xl mr-4 p-3 cursor-pointer font-bold border-2 ${dayStylesMap[index === 0 ? 'cur' : weekday]}`}
                >
                  <span className="text-xl">{weekday}</span>
                  <span className="text-lg">{dayInf.day}</span>
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
