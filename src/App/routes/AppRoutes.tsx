import {FC} from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'

import {
  HomePage,
  LoginPage,
  RegisterPage,
  CreateTaskPage,
  EditTaskPage,
  NotFoundPage,
} from '@/Pages'
import SecureRoute from './secure routes/SecureRoute'
import {useUserCredentials} from '@/Shared'

const AppRoutes: FC = () => {
  const {user, isFetching} = useUserCredentials()

  const noUserCondition = !user && !isFetching

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create_task/:date"
          element={
            <SecureRoute redirectTo="/" isRedirection={noUserCondition}>
              <CreateTaskPage />
            </SecureRoute>
          }
        />
        <Route
          path="/edit_task/:taskId"
          element={
            <SecureRoute redirectTo="/" isRedirection={noUserCondition}>
              <EditTaskPage />
            </SecureRoute>
          }
        />

        <Route
          path="/auth/registration"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!user && !isFetching}>
              <RegisterPage />
            </SecureRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!user && !isFetching}>
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
