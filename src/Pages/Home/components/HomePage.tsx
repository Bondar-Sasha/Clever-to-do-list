import {FC} from 'react'
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

import {auth} from '@/Shared'

async function func() {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    'sashabond',
    '151'
  )
  console.log(userCredential)
}
onAuthStateChanged(auth, (user) => {
  console.log(user)
})

const HomePage: FC = () => {
  return (
    <div className="stretching flex items-center flex-col">
      <button onClick={func}>click</button>
    </div>
  )
}

export default HomePage
