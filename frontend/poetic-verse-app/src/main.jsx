import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './styles/all.css'
import Index from './routes/root.jsx'
import Feed from './routes/feed.jsx';
import ErrorPage from './routes/error-page.jsx';
import { Auth, Login, Signup, Preferences } from './routes/auth';
import { Poem, Discover } from './components/poem';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
        element: <Poem url='poems' method='GET' />
      },
      {
        path: "discover",
        element: <Discover/>
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
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
