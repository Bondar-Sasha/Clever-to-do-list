import {FC, useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'
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
import {DownloadMask} from '@/Widgets'

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

  useEffect(() => {
    window.history.replaceState({}, '')
  }, [])

  return fetching ? (
    <DownloadMask />
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
