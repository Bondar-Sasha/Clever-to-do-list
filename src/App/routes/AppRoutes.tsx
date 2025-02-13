import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'

import {
  LayoutPage,
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
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<HomePage />} />
          <Route
            path="create_task"
            element={
              <SecureRoute redirectTo="/create_task" isRedirection={!userId}>
                <CreateTaskPage />
              </SecureRoute>
            }
          />
          <Route
            path="edit_task"
            element={
              <SecureRoute redirectTo="/edit_task" isRedirection={!userId}>
                <EditTaskPage />
              </SecureRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/auth"
          element={
            <SecureRoute isRedirection={!!userId} redirectTo="/">
              <LayoutPage />
            </SecureRoute>
          }
        >
          <Route index element={<Navigate to="/" replace />} />
          <Route path="registration" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
