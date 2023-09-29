import * as ReactDOM from 'react-dom/client'
import './styles/all.css'
import './styles/feed.css';
import './styles/build.css'
import './styles/loader.css'
import Index from './routes/root.jsx'
import Feed from './routes/feed.jsx';
import {ErrorPage, ComingSoon, LoggedOut} from './routes/error-page.jsx';
import { Auth, Login, Signup, Preferences} from './routes/auth'; 
import Create from './routes/Create';
import { Poem } from './components/poem';
import { Search } from './routes/explore'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProfileSection } from './routes/user'
import { PoemSection, CommentRepliesSection } from './components/poemCsection'
import Profile from './routes/Profile';
import UserInfo from './components/UserInfo'
import VerifyUser from './components/VerifyUser'
import { VerifyUserToken, ResetPassword, RequestReset} from './components/security'
import PasswordReset from './components/PasswordReset'
import ChangeEmail from './components/ChangeEmail'
import { UserProvider, checkAuth } from './utils'
import { Navigate } from 'react-router-dom';

export function AuthGuarded({ isAuth, children }) {
  console.log(isAuth)
  if (!isAuth) {
    return <Navigate to="/auth/login" />
  } else {
    return children
  };
}
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
        element: <ComingSoon/>
      }, 
      {
        path: "messages",
        element: <ComingSoon/>
      },
      {
        path: "ranking",
        element: <ComingSoon/>
      },
      {
        path: "poem",
        element: <PoemSection/>
      },
      {
        path: "loggedout",
        element: <LoggedOut/>
      },
      {
        path: "poet",
        element: <ProfileSection/>
      },
      {
        path: "comment",
        element: <CommentRepliesSection/>
      },
      {
        path: 'create',
        element: <AuthGuarded isAuth={checkAuth()}><Create/></AuthGuarded>
      },
      {
        path: 'explore',
        element: <Search/>
      },
      {
        path: 'settings',
                  
        element: <AuthGuarded isAuth={checkAuth()}><Profile /></AuthGuarded>,
        children: [
          {
            path: 'userinfo',
            element: <AuthGuarded isAuth={checkAuth()}><UserInfo /></AuthGuarded>
          },
          {
            path: 'resetpassword',
            element: <AuthGuarded isAuth={checkAuth()}><PasswordReset /></AuthGuarded>
          },
          {
            path: 'changeEmail',
            element: <AuthGuarded isAuth={checkAuth()}><ChangeEmail /></AuthGuarded>
          },
          {
            path: 'verifyUser',
            element: <AuthGuarded isAuth={checkAuth()}><VerifyUser /></AuthGuarded>
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
      },
      {
        path: `verify/:token`,
        element: <VerifyUserToken/>
      },
      {
        path: 'request_reset',
        element: <RequestReset/>
      },
      {
        path: 'password_reset/:token',
        element: <ResetPassword/>
      },

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
