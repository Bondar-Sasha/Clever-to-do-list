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
import {useUserCredentials} from '@/Shared'

const AppRoutes: FC = () => {
  const {user} = useUserCredentials()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create_task"
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
          path="/tasks/:taskId"
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
