import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "./loader";
import { api, passwordValidationSchema } from "../utils"
import { Icon } from "./navbar";
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik';

export function ResetPassword(){
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { token } = useParams();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigator = useNavigate()
  const toggleShowPassword = (field) => {
    switch (field) {
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
    password: '',
    confirm_password: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = 'New Password is required';
    }
    if (!values.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (values.password !== values.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    return errors;
  };
  const handleSubmit = (e, { setSubmitting }) => {
    const data = {password: e.password}
    console.log(data, token)
    api().post(`/reset/${token}`, data)
    .then(() => {
      navigator('/auth/login')
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
      <h1>Reset Password</h1>
      <p className='reset-msg'>Enter the new password you would like to access your account width
        After submitting if successful you will be redirected to login with
        your new credentials
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          password: passwordValidationSchema,
          confirm_password: passwordValidationSchema,
        })}
        validate={validate}
        onSubmit={handleSubmit}
      >
        <Form>
           <label className="field">
            New Password
            <div className="pwd-label">
              <Field
                type={showNewPassword ? 'text' : 'password'}
                className="input-field"
                name="password"
              />
              <Icon
              path={showNewPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('newPassword')}
              />
            </div>
            <ErrorMessage name="password" className="loginerr" component="div" />
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
            Reset
          </button>
          {apiError && <p className="login-err">{apiError}</p>}
        </Form>
      </Formik>
    </div>
  );
}

export function VerifyUserToken() {
  const { token } = useParams();
  const [_t, setToken] = useState(token)
  const [isLoading, setIsLoading] = useState(true);
  const [errm, setError] = useState('')
  const nav = useNavigate()

  const handleV = () => {
    setIsLoading(true)
    api().get(`/verify/${_t}`)
    .then(() => {
      setError('')
      nav('/auth/login')
    })
    .catch((err) => {
      if (err && err.response &&err.response.data) {
        setError(err.response.data.message)
      }
    })
    .finally(() => {
      setIsLoading(false)
    })
  }
  useEffect(() => {
    setToken(_t)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [token]);

  return (
    <div>
      {isLoading ? (
        <Loader/>
      ) : (
        <div className='verify-acc'>
          <h1>Click here to verify your account</h1>
          <div className="redirect-buttons">
          <button onClick={handleV}>Verify</button>
          </div>
          <div className='loginerr verror'>{errm}</div>
        </div>
      )}
    </div>
  );
}

export function RequestReset() {
  const [result, setRes] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [errm, setError] = useState('')

  const handleV = (e) => {
    setIsLoading(true)
    const value = new FormData(e.target)
    const data = {email:value.get('email'), tochange: 'password'}
    console.log(data)
    api().post(`/request_reset`, data)
    .then(() => {
      setError('')
      setRes('Request successful, check your email and follow from there. You can now close this page')
    })
    .catch((err) => {
      if (err && err.response &&err.response.data) {
        setError(err.response.data.message)
        setRes('')
      }
    })
    .finally(() => {
      setIsLoading(false)
    })
  }
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader/>
      ) : (
        <div >
          <h1>Get a reset link</h1>
          <p>Get a reset link you can use to safely reset your password
            if you have forgotten it</p>
            <form onSubmit={handleV}>
              <input type="email" name='email' required/>
             <button type="submit" className="btn">Request</button>              
            </form>
          <div className='loginerr'>{errm}</div>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}
