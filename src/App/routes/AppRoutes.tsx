import {FC} from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
// import {onAuthStateChanged} from 'firebase/auth'

import {
  HomePage,
  LoginPage,
  RegisterPage,
  CreateTaskPage,
  EditTaskPage,
  NotFoundPage,
} from '@/Pages'
import SecureRoute from './secure routes/SecureRoute'
// import {auth} from '@/Shared'

const AppRoutes: FC = () => {
  // const [isAuth, setIsAuth] = useState<boolean>(false)

  // onAuthStateChanged(auth, (user) => {
  //   // setIsAuth(!!user)
  // })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create_task"
          element={
            <SecureRoute redirectTo="/" isRedirection={!isAuth}>
              <CreateTaskPage />
            </SecureRoute>
          }
        />
        <Route
          path="/edit_task"
          element={
            <SecureRoute redirectTo="/" isRedirection={!isAuth}>
              <EditTaskPage />
            </SecureRoute>
          }
        />

        <Route
          path="/auth/registration"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!isAuth}>
              <RegisterPage />
            </SecureRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!isAuth}>
              <LoginPage />
            </SecureRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
