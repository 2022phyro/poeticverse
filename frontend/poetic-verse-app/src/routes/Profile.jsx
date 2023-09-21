import React from 'react'
import { Icon } from '../components/navbar'
import '../styles/Profile.css'

const Profile = () => {
  return (
    <>
    <div className="divider"></div>
    <div className="Profile-container">
    <div className="title">
            <h3>Profile</h3>
            <Icon className = 'create-icon' path = 'create' />
        </div>
        
        <div className="profile-sidebar">            
            <div className="profile-content">
                <div className="profile-img">
                <Icon className = 'edit-icon' path = 'create' />
                </div>
                <div className="profile-body">
                    <b>AFAM SOMETHING</b>&nbsp;&nbsp;<small className='verse'>Verse Apprentice</small>
                    <div className="list-group">
                        <div className="list-item-1">
                        <Icon className = 'create-icon' path = 'user-info' />
                        <b>User Information</b>                            
                        </div>
                        <div className="list-item">
                        <Icon className = 'create-icon' path = 'lock' />
                        <b>Password Reset</b>                            
                        </div>
                        <div className="list-item">
                        <Icon className = 'create-icon' path = 'email' />
                        <b>Change Email</b>                            
                        </div>
                        <div className="list-item">
                        <Icon className = 'create-icon' width = '20' path = 'verify' />
                        <b>Verify user</b>                            
                        </div>
                        <div className="list-item">
                        <Icon className = 'create-icon' path = 'trash' />
                        <b>Delete Account</b>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Profile