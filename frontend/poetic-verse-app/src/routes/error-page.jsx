import { useRouteError, useNavigate } from "react-router-dom";

export  function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="misc-wrapper">
      <div id="error-page"className="coming-soon">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          {error.statusText || error.message}
        </p>
      </div>
    </div>
  );
}
export function ComingSoon() {
  return (
    <div className="misc-wrapper">
      <div className="coming-soon">
          <h2>Coming Soon</h2>
          <p>Who knows how you stumbled upon this page. We can only begin to imagin your
              disdain and disappointment on not having the ability to see what's being prepared
              Rest assured for these features are coming soon
          </p>
      </div>
    </div>
  )
}
export function LoggedOut() {
  const nav = useNavigate()
  return (
    <div className="misc-wrapper">
      <div className="coming-soon">
        <h2>Logged Out</h2>
        <p>You seem to be unable to access a particular feature. This may be because
          you are not logged in or your login has expired. You can continue to browse at
          your own risk or login or signup to close the door on this page
        </p>
      </div>
        <div className="redirect-buttons">
          <button onClick={() => nav('/feed/home')}>Go back home</button>
          <button onClick={() => nav('/auth/login')}>Login</button>
        </div>
    </div>

  )
}
