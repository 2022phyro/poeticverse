import React from 'react'
import Profile from '../routes/Profile'
import '../styles/ChangeEmail.css'

const ChangeEmail = () => {
  return (
    <>
     <Profile />
      <div className="parent-container">
        <h3>Change Email</h3>
        <div className="field">
          <b>Email Address</b>
          <form action="">
            <input type= 'email' className="input-field" />
          </form>
        </div>

        <div className="field">
          <b>New Email Address</b>
          <form action="">
            <input type= 'email' className="input-field" />
          </form>
        </div>
      
        <div className="field">
          <b>Confirm Email Address</b>
          <form action="">
            <input type= 'email' className="input-field" />
          </form>
        </div>

        <div className='push'>
        <button className='btn'>save</button>
        </div>
      </div>
    </>
  )
}

export default ChangeEmail