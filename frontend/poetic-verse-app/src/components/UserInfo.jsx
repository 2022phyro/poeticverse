import Profile from '../routes/Profile'
import '../styles/UserInfo.css'
import { useNavigate } from 'react-router-dom'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { api } from '../utils'
import { useState } from 'react'
function UserInfo () {
    const navigate = useNavigate()
    const [apiError, setApiError] = useState(null);
    return (

    <>
    <Profile />
    <div className="parent-container">
        <h3>User Information</h3>
          <Formik
              initialValues={{first_name: "", last_name: "", pen_name: "", bio: ""}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={(e, { setSubmitting } ) => {
                const data = {};

                for (const key in e) {
                  if (e[key].trim() !== '') {
                    data[key] = e[key];
                  }
                }
            
                if (Object.keys(e).length === 0) {
                  // No non-empty values to send, do not submit the form
                  setSubmitting(false);
                  return;
                }
                console.log('Data', data, 'e', e);
                api(true).patch('/user', data)
                  .then(() => {
                      setSubmitting(false)
                      setApiError(null)
                      navigate('/feed/profile')
                  })
                  .catch((error) => {
                    const errorMessage = error.response.data.message;
                    console.error(error.response.data)
                    setApiError(errorMessage)
                  })
              }}
              >
              <Form>
                  <label htmlFor='f_name' className='field'>First name</label>
                  <Field id='f_name' type='text' name='first_name' placeholder='Your first name' className='input-field'/>
                  <ErrorMessage name='f_name' className='loginerr' component='div'/>
                
                  <label htmlFor='last_name'  className='field'>Last name</label>
                  <Field id='last_name' type='text' name='last_name' placeholder='Your last name' className='input-field'/>
                  <ErrorMessage name='last_name' className='loginerr' component='div'/>

                  <label htmlFor='pen_name'  className='field'>Pen name</label>
                  <Field id='pen_name' type='text' name='pen_name' placeholder='Your pen name' className='input-field'/>
                  <ErrorMessage name='pen_name' className='loginerr' component='div'/>

                  <label htmlFor='bio'  className='field'>Bio</label>
                  <Field id='bio' as='textarea' className='input-field-1' name='bio' placeholder='Change your bio'/>
                  <ErrorMessage name='pen_name' className='loginerr' component='div'/>
                  <button type="submit" className="btn">
                    Save
                  </button>
                  {apiError && <p className="login-err">{apiError}</p>}
              </Form>
              </Formik>
    </div>
    </>
  )
}
export default UserInfo;
