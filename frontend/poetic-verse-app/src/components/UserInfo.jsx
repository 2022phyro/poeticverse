import React from 'react'
import Profile from '../routes/Profile'
import '../styles/UserInfo.css'

const UserInfo = () => {
  return (
    <>
    <Profile />
    <div className="parent-container">
        <h3>User Information</h3>
        <div className="field">
            <b>User Name</b>
            <form action="">
                <input type="text" placeholder='John Doe' className='input-field'/>
            </form>
        </div>

        <div className="field">
            <b>Pen Name</b>
            <form action="">
                <input type="text" placeholder='John Doe' className='input-field'/>
            </form>
        </div>

        <div className="field">
            <b>Location</b>
            <form action="">
                <input type='text' placeholder='Los Santos' className='input-field'/>
            </form>

            <div className="field">
            <b>Bio</b>
            <form action="">
                <textarea type="text" placeholder='A professional writer and enthusiast...' className='input-field-1'/>
            </form>
        </div>
        </div>

        <div className='push'>
        <button className='btn'>save</button>
        </div>
    </div>
    </>
  )
}

export default UserInfo