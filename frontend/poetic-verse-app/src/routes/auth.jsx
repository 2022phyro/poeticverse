import '../styles/auth.css';
import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { inst,
  passwordValidationSchema,
  penNameValidationSchema,
  nameValidationSchema,
  CheckBox } from "../utils";


export function Login() {
  const [apiError, setApiError] = useState(null);

    return (
      <div className="auth">
        <div className='wrapper'>
          <div className="login">
            <h2>Login</h2>
            <Formik
              initialValues={{login: "", password: ""}}
              validationSchema={Yup.object({
                login: Yup.string().required('Required'),
                password: Yup.string().required('Required'),
              })}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={(e, { setSubmitting } ) => {
                // console.log(e)
                // // alert(e)
                setSubmitting(false);
                inst.post('/login', e)
                .then((response) => {
                    const data = response.data
                    console.log(data)   
                    localStorage.setItem('myData', JSON.stringify(data));
                    window.location.href = '/feed'
                    setSubmitting(false)
                    setApiError(null)
                })
                .catch((error) => {
                    console.error(error)
                    setApiError('Invalid email or password')
                })
              }}
            >
            <Form>
                <label htmlFor='login'>Login</label>
                <Field id='login' type='text' name='login' placeholder='Email or Pen Name'/>
                <ErrorMessage name='login' className='loginerr' component='div'/>
                <label htmlFor='lo_pwd'>Password</label>
                <Field id='lo_pwd' type='password' name='password' placeholder='Password'/>
                <ErrorMessage name='password' className='loginerr' component='div'/>
                <button type="submit" className="LoginButton">
                Login
                </button>
                {apiError && <p className="login-err">{apiError}</p>}
            </Form>
            </Formik>
            <Link to={`/auth/signup`}>Don&apos;t have an account? Join here</Link>
            <Link to={`remm`}>Forgot password? Click here</Link>
          </div>
        </div>
      </div>
    )
}

export function Signup() {
  const [apiError, setApiError] = useState(null);

  return (
      <div className="auth">
        <div className='wrapper'>
          <div className="signup">
            <h2>Signup</h2>
            <Formik
              initialValues={{email: "", first_name: "", last_name: "", pen_name: "", password: ""}}
              validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Required'),
                first_name: nameValidationSchema,
                last_name: nameValidationSchema,
                pen_name: penNameValidationSchema,
                password: passwordValidationSchema
              })}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={(e, { setSubmitting } ) => {
                console.log(e)
                // alert(e)
                setSubmitting(false);
                inst.post('/signup', e)
                .then(() => {
                    localStorage.setItem('logininfo', JSON.stringify({ login: e['email'], password: e['password'] }));
                    // alert(response.data)
                    setSubmitting(false)
                    setApiError(null)
                    window.location.href = '/auth/preferences'

                })
                .catch((error) => {
                  const errorMessage = error.response.data.message; // Replace 'message' with the actual property name containing the error message
                  // const statusCode = error.response.status; 
                  // console.error(statusCode)
                  console.error(errorMessage)
                  setApiError(errorMessage)
                })
              }}
            >
            <Form>
                <label htmlFor='l_email'>Email</label>
                <Field type='text' id='s_email' name='email' placeholder='Email' autoComplete="on"/>
                <ErrorMessage name='email' className='loginerr' component='div'/>
                <label htmlFor='s_f_name'>First Name</label>
                <Field type='text' id='s_f_name' name='first_name' placeholder='First Name' autoComplete="on"/>
                <ErrorMessage name='first_name' className='loginerr' component='div'/>
                <label htmlFor='s_l_name'>Last Name</label>
                <Field type='text' id='s_l_name' name='last_name' placeholder='Last Name' autoComplete="on"/>
                <ErrorMessage name='last_name' className='loginerr' component='div'/>
                <label htmlFor='s_p_name'>Pen Name</label>
                <Field type='text' id='s_p_name' name='pen_name' placeholder="What's your pen name?" autoComplete="on"/>
                <ErrorMessage name='pen_name' className='loginerr' component='div'/>
                <label htmlFor="s_passwd">Password</label>
                <Field type='password' id='s+passwd' name='password' placeholder='Password' autoComplete="on"/>
                <ErrorMessage name='password' className='loginerr' component='div'/>
                <button type="submit" className="signupButton">
                Signup
                </button>
                {apiError && <p className="login-err">{apiError}</p>}
                <Link to={`/auth/login`}>Already have an account? Click here</Link>
            </Form>

            </Formik>
          </div>
        </div>   
      </div>
  )
}
export function Preferences() {
  const [tags, setTags] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({});

  const handleCheckBoxChange = (id) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id],
    }));
  };

  const login = () => {
    const e = JSON.parse(localStorage.getItem('logininfo'));
    console.log(e)
    inst.post('/login', e)
      .then((response) => {
          const data = response.data
          localStorage.setItem('myData', JSON.stringify(data));
          localStorage.removeItem('logininfo')
          window.location.href = '/feed'
      })
      .catch((error) => {
          console.error(error)
    })
  }
  const handleDoneClick = () => {
    const selectedTags = Object.keys(checkboxValues).filter((id) => checkboxValues[id]);
    console.log(selectedTags)
    login()
  };
  useEffect(() => {
    inst.get('/tags')
      .then((response) => {
        const po = response.data;
        setTags(po); // Update the state with the received data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // The empty dependency array ensures this effect runs once after the component mounts

  return (
    <div className='preferences'>
      <h2>Choose your preferences</h2>
      <div>
        <ul id='choices'>
          {tags.map((tag) => (
            <li key={tag.id}>
              <CheckBox label={tag.name} id={tag.id} value={checkboxValues[tag.id]} onChange={handleCheckBoxChange} />
            </li>
          ))}
        </ul>
      </div>
      <div className='end'>
        <button onClick={login}>Skip</button>
        <button onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
  
}
export function Auth() {
    return (
    <main className="background">
        <Outlet />
      </main>
    )
}
