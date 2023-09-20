import axios from 'axios'
import * as Yup from 'yup';
// import { } from 'public'

export const inst = axios.create({
    baseURL: 'http://127.0.0.1:5000/v1', // Set your base URL here
    headers: {
    //   'Authorization': 'Bearer YourAuthToken', // Add your authentication token here
      'Content-Type': 'application/json', // Set your desired content type
    },
  });

export const apiRequest = async (url, method = 'GET', requestData = null, auth=false) => {
  return await inst({
    method: method,
      url: url,
      headers: {
        'Authorization': auth?  localStorage.getItem(myData)['a_token'] : null
      },
      data: requestData, // Optional request data (for POST, PUT, etc.)
    });
};

export const passwordValidationSchema = Yup.string()
  .min(5, 'Password must be at least 5 characters')
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    'Password must contain at least one uppercase letter, one lowercase letter and one number'
  )
  .required('Password is required');

export const penNameValidationSchema = Yup.string()
  .required('Pen Name is required');

export const nameValidationSchema = Yup.string()
  .matches(/^[a-zA-Z'-]+$/, 'Invalid characters in the name')
  .required('Required');

export function CheckBox({ id, label, value, onChange }) {
  return (
    <label>
      <input type='checkbox' checked={value} id={id} onChange={() => onChange(id)} />
      {label}
    </label>
  );
}
export function getRelativeTime(datetimeString) {
  const now = new Date();
  const date = new Date(datetimeString);

  const elapsedMilliseconds = now - date;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedMonths = Math.floor(elapsedDays / 30); // Approximate months

  if (elapsedMonths > 0) {
    return `${elapsedMonths} ${elapsedMonths === 1 ? 'month' : 'months'}`;
  } else if (elapsedDays > 0) {
    return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'}`;
  } else if (elapsedHours > 0) {
    return `${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'}`;
  } else if (elapsedMinutes > 0) {
    return `${elapsedMinutes} ${elapsedMinutes === 1 ? 'min' : 'mins'}`;
  } else {
    return `${elapsedSeconds} ${elapsedSeconds === 1 ? 'sec' : 'secs'}`;
  }
}
