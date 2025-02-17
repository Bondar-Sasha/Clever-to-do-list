import {FC} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'
import {CgSpinner} from 'react-icons/cg'
import {createTheme, ThemeProvider} from '@mui/material'
import {useAuthState} from 'react-firebase-hooks/auth'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'normalize.css'

import {AppRoutes} from '../routes'
import '../styles/index.css'
import {auth} from '@/Shared'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ed6e47',
      dark: '#ed6e47',
    },
  },
})

const App: FC = () => {
  const [, fetching] = useAuthState(auth)

  return fetching ? (
    <div className="stretching flex-center bg-gray-100">
      <CgSpinner className="animate-spin text-theme text-3xl" />
    </div>
  ) : (
    <ThemeProvider theme={theme}>
      <AppRoutes />
      <ToastContainer
        theme="light"
        position="bottom-right"
        autoClose={1500}
        pauseOnHover
      />
    </ThemeProvider>
  )
}

export default App
