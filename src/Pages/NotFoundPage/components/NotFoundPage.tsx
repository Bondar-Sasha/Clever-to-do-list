import {FC} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

const NotFoundPage: FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className="flex items-center mb-3 mt-3 self-start">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        />
        <h1 className="text-3xl font-bold">Not Found</h1>
      </header>
      <main className="stretching flex-center text-2xl bg bg-gray-200 font-bold">
        404 Not Found
      </main>
    </>
  )
}

export default NotFoundPage
