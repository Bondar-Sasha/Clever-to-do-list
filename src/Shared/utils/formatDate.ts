import {format} from 'date-fns'

import {IDate} from '../types'

export const formatDate = (date: Date): IDate => {
  return format(date, 'yyyy-MM-dd') as IDate
}
