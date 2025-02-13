import {getAuth} from 'firebase/auth'

import firebase from '../config/firebase'

export const auth = getAuth(firebase)
