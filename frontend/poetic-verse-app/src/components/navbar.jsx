import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api, checkAuth, useUserContext, usePopup } from '../utils';
import { PopUp } from './loader';
export function Icon({ path, className, ...props }) {
  const route = '/icon/' + path + '.svg'
  return (
    <img className={`icon ${className}`} src={route} {...props}/>
  )
}
export function Avatar({ source, ...props }) {
  const [img, setImg] = useState('/person.png');
  const navigate = useNavigate()

  useEffect(() => {
    if (source !== null) {
      setImg(source);
    } else {
      setImg('/person.png')
    }
  }, [source]);

  const handleImageError = () => {
    setImg('/person.png');
  };
   const handleClick = (event) => {
    event.stopPropagation()
    if (props.id) {
      navigate(`/feed/poet?id=${props.id}`)
    }
   }
  return (
    <img
      src={img}
      className='p_photo'
      alt='Avatar'
      onError={handleImageError} // Add error handler
      {...props}
      onClick={handleClick}
    />
  );
}
export function Nav() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [menuVisible, setMenuVisible] = useState(false);
  const [Toggle, setToggle] = useState(false);
  const [Logout, setLogout] = useState(false);
  const isauth = checkAuth()
  const { state, dispatch}  = useUserContext()
  const [loadedProfile, setLoadedProfile] = useState(false)
  const navigate = useNavigate()
  const openPopup = usePopup()

  const toggleMenu = () => {
    if (screenWidth <= 630) {
      setMenuVisible(!menuVisible)
    } else {
      setMenuVisible(true)
    }
  }
  const menuStyle = {
    display: menuVisible ||  screenWidth > 630  ? 'flex': 'none'
  }
  const navStyle = {
    transform: menuVisible||  screenWidth > 630  ? 'translateX(0)' : 'translateX(-100%)',
  }
  const handleToggle = () => {
    setToggle(!Toggle)
  }
  const handleUserLogout = () => {
    api(true).post('/logout')
    .then(() => {
      dispatch({ type: 'SET_LOGGED_IN', payload: false });
      localStorage.clear()
      navigate('/')
    })
    .catch((err) => {
      if (err.response.status == 401) {
        dispatch({ type: 'SET_LOGGED_IN', payload: false });
        localStorage.clear()
        navigate('/feed/loggedout')
      }
    })
  }
  const handleLogout = () => {
    openPopup('Are you sure you want to log out', 'Log out', handleUserLogout);
  }

  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    // Make the API request to get the profile data
    if (!loadedProfile && isauth) {
    api(true)
      .get('/profile')
      .then((res) => {
        dispatch({ type: 'SET_PROFILE', payload: res.data });
        dispatch({ type: 'SET_LOGGED_IN', payload: true });
        setLoadedProfile(true)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          dispatch({ type: 'SET_LOGGED_IN', payload: false });
          localStorage.clear()
          navigate('/feed/loggedout')
        console.error('Error fetching profile:', error.response);
        }
      });
    }
  }, [dispatch, loadedProfile, isauth]);
  // Conditionally apply CSS classes based on screen width
  const hiddenClass = screenWidth <= 950 ? '' : 'hidden';
  const containClass = screenWidth <= 630 ? 'close-nav' : screenWidth <= 950 ? 'mid-nav': "";
    return (
      <>
     
        <header className='header'>
        <Icon path={'menu-circle-with-dots'} className={`hamburger ${hiddenClass}`} onClick={toggleMenu}/>
        <img src='/PV.png' className='logo'/>
        </header>

        <div className='contain'style={menuStyle}>
        <header className='header'>
        <Icon path={'menu-circle-with-dots'} className={`hamburger ${hiddenClass}`} onClick={toggleMenu}/>
        <img src='/PV.png' className='logo'/>
        </header>
        <nav className="nav" style={{...navStyle}}>
          <ul> 
            <Link to={`/feed/home`}><li className='active'><Icon className='hint' path='home-3'/><span>Home</span></li></Link>
            <Link to={`/feed/explore`}><li><Icon className='hint'  path='compass-navigator'/><span>Explore</span></li></Link>
            <Link to={`/feed/messages`}><li><Icon className='hint'  path='message'/><span>Messages</span></li></Link>
            <Link to={isauth ? `/feed/poet?id=${state.profile.id}`: `/feed/loggedout`}><li><Icon className='hint'  path='bookmark'/><span>Me</span></li></Link>
            <Link to={`/feed/ranking`}><li><Icon className='hint'  path='rank'/><span>Ranking</span></li></Link>
            <Link to={`/about`}><li><Icon className='hint'  path='about-us'/><span>About us</span></li></Link>
            <Link to={`/feed/discover`}><li><Icon className='hint'  path='notification'/><span>Discover</span></li></Link>
            <Link to={isauth ? `/feed/create`: `/feed/loggedout`}><li className="create"><Icon className='hint'  path='create'/><span>Create</span></li></Link>
          </ul>
          {Toggle && <div className='toggle-settings' onClick={handleToggle}>
            <Link to = {isauth ? `/feed/settings/userinfo`: `/feed/loggedout`}>
            <div className="settings">
              settings<Icon path= 'settings' />
            </div>
            </Link>
          
            <div className="logout" onClick={handleLogout}>
              log out<Icon path= 'logout' />
            </div>
            </div>}
            {
              isauth ? (
                <div className="me" onClick={handleToggle}>
                  <Avatar source={state.profile.profile_picture}/>
                  <div className="b_info">
                    <div>
                      <p>{state.profile.pen_name}</p>
                    <p>{state.profile.rank}</p>
                    </div>
                    <Icon path= 'menu-circle-with-dots' />
                  </div>
                </div>
              ) : <h3>You are not logged in</h3>
            }

        </nav>
        <div className={containClass} onClick={toggleMenu}></div>
        {/* <PopUp /> */}
        </div>
      </>


    )
}
