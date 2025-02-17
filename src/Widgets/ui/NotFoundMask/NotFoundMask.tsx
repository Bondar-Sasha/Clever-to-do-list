import {FC} from 'react'

interface NotFoundMaskProps {
  label: string
}

const NotFoundMask: FC<NotFoundMaskProps> = ({label}) => {
  return (
    <div className="stretching flex-center">
      <span className="text-2xl">{label}</span>
    </div>
  )
}

export default NotFoundMask
