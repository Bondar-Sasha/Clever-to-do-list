import {FC, useState} from 'react'
import {signOut} from 'firebase/auth'
import {Link} from 'react-router-dom'
import {TbLogout2} from 'react-icons/tb'
import {FirebaseError} from 'firebase/app'
import {toast} from 'react-toastify'

import {auth, useUserCredentials} from '@/Shared'

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
    <div className="w-3/4 stretching">
      <header className="flex justify-between items-center">
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
        <div>
          {generateDates(monthState).map((item) => {
            return <div>{item.day}</div>
          })}
        </div>
      </main>
    </div>
  )
}

export default HomePage
