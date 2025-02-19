import {IDate} from '../types'

export const formatDate = (date: Date): IDate => {
  return date.toISOString().split('T')[0] as IDate
}
