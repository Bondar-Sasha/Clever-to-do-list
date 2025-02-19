import {FC} from 'react'
import {CgSpinner} from 'react-icons/cg'

const DownloadMask: FC = () => {
  return (
    <div className="stretching flex-center bg-gray-100">
      <CgSpinner className="animate-spin text-theme text-3xl" />
    </div>
  )
}

export default DownloadMask
