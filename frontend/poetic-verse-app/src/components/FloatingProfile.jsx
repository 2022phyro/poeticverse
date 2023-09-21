import React, { useState } from 'react'
import '../styles/floatingProfile.css'
import { Icon } from './navbar'
import { Link } from 'react-router-dom'

const FloatingProfile = ({ handleDeleteAccount, handleButtonClick, getButtonBackgroundColor, handleDelete }) => {

    const [floater, setFloater] = useState(false);

    const handleFloater = () => {
        setFloater(!floater)
    }
  return (
    <>
    {floater && <div className='floater-content'>
        <div className="list-item">
            User Information
        </div>
        </div>}
    <div className="floatingProfile" onClick={handleFloater}>
        <div className="floater">
        <Icon path= 'bookmark' />
        </div>
    </div>
    </>
  )
}

export default FloatingProfile