import React from 'react'
import Profile from '../routes/Profile'
import '../styles/VerifyUser.css'

const VerifyUser = () => {
  return (
    <>
    <Profile />
    <div className="parent-container">
        <h3>Verify User</h3>
        <div className="field">
            <div className='verify-content'>
            <h5>In the realm of poetic expression, 
                where words take flight and verses are woven
                 into masterpieces, we extend our warmest welcome 
                 to you, our cherished member of "Poetic Verse." 
                 To unlock the full spectrum of poetic possibilities and 
                 ensure the security of your poetic haven, we invite you to
                  embark on the enchanting journey of email verification.</h5>
            </div>
        </div>

        <div className="field">
        <b>Why Verify Your account?</b>
        <div className='verify-content'>
            <h5>Verification is the key that unlocks 
                the door to the full "Poetic Verse" experience. 
                By confirming your email address, you breathe life 
                into your poetic presence, securing your account and 
                ensuring that your verses are heard and cherished by your fellow poets.</h5>
            </div>
            <div className='marg'> 
            <b>Email Address</b>
            <form action="">
            <input type= 'email' className="input-field" />
          </form>
            </div>
        </div>

        <div className='push'>
        <button className='btn'>Verify</button>
        </div>

      </div>
    </>
  )
}

export default VerifyUser