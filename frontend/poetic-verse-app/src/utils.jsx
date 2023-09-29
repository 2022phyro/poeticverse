/**
 * utils - a file to hold all of the functions that are not necessary components that
 * i may ned elsewhere throughout the code
 */
import axios from 'axios'
import * as Yup from 'yup';
import { createContext, useContext, useReducer, useState } from 'react';

export const api = (auth) => {
  const inst = axios.create({
    baseURL: 'https://poeticverse-api-5f5c40033c5c.herokuapp.com/v1/',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    if (auth) {
      const myData = JSON.parse(localStorage.getItem('myData'))
      if (myData && myData.atoken) {
        inst.defaults.headers.common['Authorization'] = `Bearer ${myData.atoken}`;
      }
    }
    return inst
}

const UserContext = createContext();

export const initialState = {
  profile: {},
  rank: {},
  isLoggedIn: false,
  authToken: '',
  popUp: {
    popupContent: "",
    popupActive: false,
    success: 'OK',
    successCommand: null,
    decision: false
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
// Reducer for switching up the functions
export const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_RANK':
      return { ...state, rank: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };
    case 'SET_POP_UP':
      return { ...state, popUp: action.payload }
    default:
      return state;
  }
};
// Create a custom hook for managing the popup state

  export function usePopup() {
    const { dispatch } = useUserContext()
    const openPopUp = (popupContent, success = 'OK', successCommand = null) => {
      const open = {
        popupActive: true,
        success: success,
        successCommand: successCommand,
        popupContent: popupContent,
        decision: successCommand ? true : false
      };
      
      dispatch({ type: 'SET_POP_UP', payload: open });
    };
  
    return openPopUp;
  }



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

export const checkAuth = () => {
  const auth = localStorage.getItem('myData');

  if (auth) {
    const myData = JSON.parse(auth);
    if (myData && myData.atoken) {
      return true
    }
  }
  return false
}
