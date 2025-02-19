import {useState} from 'react'
import {BsEye, BsEyeSlash} from 'react-icons/bs'
import {TextField} from '@mui/material'

import styles from './styles/passwordInput.module.css'

const PasswordInput: typeof TextField = ({className = '', ...props}) => {
  const [eyeState, setEye] = useState<boolean>(true)
  const changePasswordVisibility = () => {
    setEye((prev) => !prev)
  }
  return (
    <div className={`relative w-full ${className}`}>
      <TextField
        {...props}
        type={eyeState ? 'password' : 'text'}
        sx={{width: '100%'}}
      />
      {eyeState ? (
        <BsEyeSlash
          onClick={changePasswordVisibility}
          className={`text-theme cursor-pointer text-xl ${styles.eye}`}
        />
      ) : (
        <BsEye
          onClick={changePasswordVisibility}
          className={`text-theme cursor-pointer text-xl ${styles.eye}`}
        />
      )}
    </div>
  )
}

export default PasswordInput
