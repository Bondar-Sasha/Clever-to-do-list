import {FC} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'
import {createTheme, ThemeProvider} from '@mui/material'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'normalize.css'

import {AppRoutes} from '../routes'
import '../styles/index.css'
import {useUserCredentials} from '@/Shared'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ed6e47',
      dark: '#ed6e47',
    },
  },
})

const App: FC = () => {
  const {isFetching} = useUserCredentials()
  return isFetching ? (
    <div className="text-xl">Loading...</div>
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
