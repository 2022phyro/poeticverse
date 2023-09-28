import Profile from '../routes/Profile'
import '../styles/UserInfo.css'
import { useNavigate } from 'react-router-dom'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { api } from '../utils'
import { useState } from 'react'
import { useUserContext } from '../utils'
function UserInfo() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const { state } = useUserContext();

  return (
    <div className="parent-container">
      <h3>User Information</h3>
      <Formik
        initialValues={{
          first_name: state.profile.first_name || 'John', // Use 'John' as the default value
          last_name: state.profile.last_name || '',
          pen_name: state.profile.pen_name || '',
          bio: state.profile.bio || ''
        }}
        onSubmit={(values, { setSubmitting }) => {
          const data = {};

          for (const key in values) {
            if (values[key].trim() !== '') {
              data[key] = values[key];
            }
          }

          if (Object.keys(data).length === 0) {
            // No non-empty values to send, do not submit the form
            setSubmitting(false);
            return;
          }

          console.log('Data', data);
          api(true).patch('/user', data)
          .then(() => {
              setSubmitting(false)
              setApiError(null)
              navigate(`/feed/poet?id=${state.profile.id}`)
          })
          .catch((error) => {
            const errorMessage = error.response.data.message;
            console.error(error.response.data)
            setApiError(errorMessage)
          })
      }}
      >
        <Form>
          <label htmlFor="first_name" className="field">
            First name
          </label>
          <Field
            id="first_name"
            type="text"
            name="first_name"
            className="input-field"
          />
          <ErrorMessage name="first_name" className="loginerr" component="div" />

          <label htmlFor="last_name" className="field">
            Last name
          </label>
          <Field
            id="last_name"
            type="text"
            name="last_name"
            className="input-field"
          />
          <ErrorMessage name="last_name" className="loginerr" component="div" />

          <label htmlFor="pen_name" className="field">
            Pen name
          </label>
          <Field
            id="pen_name"
            type="text"
            name="pen_name"
            className="input-field"
          />
          <ErrorMessage name="pen_name" className="loginerr" component="div" />

          <label htmlFor="bio" className="field">
            Bio
          </label>
          <Field
            id="bio"
            as="textarea"
            className="input-field-1"
            name="bio"
          />
          <ErrorMessage name="bio" className="loginerr" component="div" />
          <button type="submit" className="btn">
            Save
          </button>
          {apiError && <p className="login-err">{apiError}</p>}
        </Form>
      </Formik>
    </div>
  );
}
export default UserInfo;
