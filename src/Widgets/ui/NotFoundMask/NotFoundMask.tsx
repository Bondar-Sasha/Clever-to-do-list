import {FC} from 'react'
import {MdExpandLess} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

interface NotFoundMaskProps {
  label: string
}

const NotFoundMask: FC<NotFoundMaskProps> = ({label}) => {
  const navigate = useNavigate()

  return (
    <div>
      <header className="flex items-center justify-between mb-48">
        <MdExpandLess
          className="mr-4 -rotate-90 text-2xl cursor-pointer"
          onClick={() => {
            navigate('/', {
              state: null,
              replace: true,
            })
          }}
        />
        <h1 className="text-3xl font-bold grow">{label}</h1>
      </header>
      <div className="stretching flex-center">
        <span className="text-2xl">There is no such page</span>
      </div>
    </div>
  )
}

export default NotFoundMask
