import {FC} from 'react'
import {Outlet} from 'react-router-dom'

const LayoutPage: FC = () => {
  return (
    <>
      <header className=""></header>
      <main className={`w-full flex-center flex-grow`}>
        <Outlet />
      </main>
      <footer className=""></footer>
    </>
  )
}

export default LayoutPage
