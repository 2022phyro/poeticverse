import { useState } from 'react';
import '../styles/PasswordReset.css';
import { Icon } from '../components/navbar';
import { api, passwordValidationSchema } from '../utils';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const PasswordReset = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigator = useNavigate()
  const toggleShowPassword = (field) => {
    switch (field) {
      case 'oldPassword':
        setShowOldPassword(!showOldPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const initialValues = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.old_password) {
      errors.old_password = 'Old Password is required';
    }

    if (!values.new_password) {
      errors.new_password = 'New Password is required';
    }

    if (!values.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (values.new_password !== values.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    return errors;
  };
  const handleSubmit = (e, { setSubmitting }) => {
    const data = {...e}
    delete data.confirm_password
    console.log(data)
    // You can submit the form data to your API or perform other actions here
    api(true).post('/change_logged_in_password', data)
    .then(() => {
      navigator('/feed/home')
      setSubmitting(false);
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      console.error(error.response.data)
      setApiError(errorMessage)
  });
  }
  return (
    <div className="parent-container">
      <h3>Reset Password</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          old_password: passwordValidationSchema,
          new_password: passwordValidationSchema,
          confirm_password: passwordValidationSchema,
        })}
        validate={validate}
        onSubmit={handleSubmit}
      >
        <Form>
          <label className="field">
            Old Password
            <div className="pwd-label">
              <Field
                type={showOldPassword ? 'text' : 'password'}
                className="input-field"
                name="old_password"
              />
              <Icon
              path={showOldPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('oldPassword')}
              />
            </div>
            <ErrorMessage name="old_password" className="loginerr" component="div" />
          </label>

          <label className="field">
            New Password
            <div className="pwd-label">
              <Field
                type={showNewPassword ? 'text' : 'password'}
                className="input-field"
                name="new_password"
              />
              <Icon
              path={showNewPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('newPassword')}
              />
            </div>
            <ErrorMessage name="new_password" className="loginerr" component="div" />
          </label>

          <label className="field">
            Confirm Password
            <div className="pwd-label">
              <Field
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field"
                name="confirm_password"
              />
              <Icon
              path={showConfirmPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('confirmPassword')}
              />
              
            </div>
            <ErrorMessage name="confirm_password" className="loginerr" component="div" />
          </label>

          <button type="submit" className="btn">
            Save
          </button>
          {apiError && <p className="login-err">{apiError}</p>}
        </Form>
      </Formik>
    </div>
  );
}


export default PasswordReset;
