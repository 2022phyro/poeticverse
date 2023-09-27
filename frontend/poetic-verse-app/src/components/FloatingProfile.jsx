import React, { useState } from 'react'
import '../styles/floatingProfile.css'
import { Icon } from './navbar'
import { Link } from 'react-router-dom'

const FloatingProfile = ({ handleDelete }) => {

    const [floater, setFloater] = useState(false);

    const handleFloater = () => {
        setFloater(!floater)
    }
  return (
    <>
    {floater && <div className='floater-content' onClick={handleFloater}>

        <Link to = '/feed/settings/userinfo'>
        <div className="list">
            <Icon path = 'user-info' className='inf'/>
        </div>
        </Link>
        <Link to = '/feed/settings/resetpassword'>
        <div className="list">
            <Icon path = 'lock' width = '24'/>
        </div>
        </Link>
        <Link to = '/feed/settings/verifyUser'>
        <div className="list">
            <Icon path = 'verify' className='inf'/>
        </div>
        </Link>
        <Link to = '/feed/settings/changeEmail'>
        <div className="list">
            <Icon path = 'email' className='inf'/>
        </div>
        </Link>

        <div className="list" onClick={handleDelete}>
            <Icon path = 'trash' className='inf'/>
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
