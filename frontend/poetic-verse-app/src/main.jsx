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
import { Search } from './routes/explore'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { PoemSection } from './components/poemCsection'
import CommentSection from './components/commentSection'
import Profile from './routes/Profile';
import UserInfo from './components/UserInfo'
import PasswordReset from './components/PasswordReset'
import ChangeEmail from './components/ChangeEmail'
import VerifyUser from './components/VerifyUser'
import { UserProvider } from './utils'
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
        path: "poem",
        element: <PoemSection/>
      },
      {
        path: "comment",
        element: <CommentSection/>
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
        element: <Profile />,
        children: [
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
  <UserProvider>
        <RouterProvider router={router} />
  </UserProvider>
)
