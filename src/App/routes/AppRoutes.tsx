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

const AppRoutes: FC = () => {
  const userId = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create_task"
          element={
            <SecureRoute redirectTo="/" isRedirection={!userId}>
              <CreateTaskPage />
            </SecureRoute>
          }
        />
        <Route
          path="/edit_task"
          element={
            <SecureRoute redirectTo="/" isRedirection={!userId}>
              <EditTaskPage />
            </SecureRoute>
          }
        />

        <Route
          path="/auth/registration"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!userId}>
              <RegisterPage />
            </SecureRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <SecureRoute redirectTo="/" isRedirection={!!userId}>
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
