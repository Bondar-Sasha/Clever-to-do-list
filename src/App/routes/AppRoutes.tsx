import {FC} from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import {useAuthState} from 'react-firebase-hooks/auth'

import {
  HomePage,
  LoginPage,
  RegisterPage,
  CreateTaskPage,
  EditTaskPage,
  NotFoundPage,
} from '@/Pages'
import SecureRoute from './secure routes/SecureRoute'
import {auth} from '@/Shared'

const AppRoutes: FC = () => {
  const [user] = useAuthState(auth)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create_task/:date"
          element={
            <SecureRoute redirectTo="/" isRedirection={!user}>
              <CreateTaskPage />
            </SecureRoute>
          }
        />
        <Route
          path="/edit_task/:taskId"
          element={
            <SecureRoute redirectTo="/" isRedirection={!user}>
              <EditTaskPage />
            </SecureRoute>
          }
        />

        <Route
          path="/auth/registration"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!user}>
              <RegisterPage />
            </SecureRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!user}>
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
