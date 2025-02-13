import {FC} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'
import 'normalize.css'

import '../styles/index.css'
import {AppRoutes} from '../routes'

const App: FC = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        theme="light"
        position="bottom-right"
        autoClose={1500}
        pauseOnHover
      />
    </>
  )
}

export default App
