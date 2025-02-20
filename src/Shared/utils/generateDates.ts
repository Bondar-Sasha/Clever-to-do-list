import {startOfMonth, addMonths, eachDayOfInterval} from 'date-fns'

import {IDate} from '../types'
import {formatDate} from './formatDate'

export const generateDates = (currentDate: IDate, month: number): IDate[] => {
  const dates: IDate[] = []
  const startDate = startOfMonth(currentDate)

  for (let i = 0; i < month; i++) {
    const newMonthDate = addMonths(startDate, i)
    const daysInMonth = eachDayOfInterval({
      start: newMonthDate,
      end: new Date(newMonthDate.getFullYear(), newMonthDate.getMonth() + 1, 0),
    })

    daysInMonth.forEach((day) => {
      const dateWithoutTime = formatDate(day)
      dates.push(dateWithoutTime)
    })
  }

  return dates
}
