import { api } from '../utils'
import '../styles/VerifyUser.css'
import { useState } from 'react'

const VerifyUser = () => {
  const [submit, setSubmit] = useState(false)
  const [errm, setErr] = useState('')
  const [response, setRes] = useState('')
  const handleVerify = () => {
    if (!submit) {
        setSubmit(true)
        api(true).get('/request_verification')
        .then((res) => {
            setRes('Check your email or spam folder for the verification email')
            setErr('')
        })
        .catch(() => {
            setRes('')
            setErr('Error in sending verification email. Please try again later')
        })
        .finally(() => {
            setSubmit(false)
        })
    }
  }
  return (
    <>
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
            </div>
        </div>
        <div className='push'>
            <button className='btn' onClick={handleVerify}>Verify</button>
            <p>{response}</p>
            <p className='loginerr'>{errm}</p>
        </div>
      </div>
    </>
  )
}

export default VerifyUser
