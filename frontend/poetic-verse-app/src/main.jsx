import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './styles/all.css'
import './styles/loader.css'
import Index from './routes/root.jsx'
import Feed from './routes/feed.jsx';
import ErrorPage from './routes/error-page.jsx';
import { Auth, Login, Signup, Preferences} from './routes/auth'; 
import Create from './routes/Create';
import { Poem, Discover } from './components/poem';
import { Search } from './components/explore'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Profile from './routes/Profile';
import UserInfo from './components/UserInfo'
import PasswordReset from './components/PasswordReset'
import ChangeEmail from './components/ChangeEmail'
import VerifyUser from './components/VerifyUser'
const router = createBrowserRouter([
  {
    path:"/",
    element: <Index/>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/feed',
    element: <Feed/>,
    children: [
      {
        path: "home",
        element: <Poem url='personify' method='GET' auth={true} main={true} />
      },
      {
        path: "discover",
        element: <Discover/>
      },
      {
        path: 'create',
        element: <Create/>
      },
      {
        path: 'explore',
        element: <Search/>
      },
      {
        path: 'settings',
        element: <Profile />
      },
      {
        path: 'userinfo',
        element: <UserInfo />
      },
      {
        path: 'resetpassword',
        element: <PasswordReset />
      },
      {
        path: 'changeEmail',
        element: <ChangeEmail />
      },
      {
        path: 'verifyUser',
        element: <VerifyUser />
      }
    ]
  },
  {
    path: '/auth',
    element: <Auth/>,
    children: [
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "signup",
        element: <Signup/>
      },
      {
        path: "preferences",
        element: <Preferences/>
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(

  // <React.StrictMode>
  // </React.StrictMode>
    <RouterProvider router={router} />
)
