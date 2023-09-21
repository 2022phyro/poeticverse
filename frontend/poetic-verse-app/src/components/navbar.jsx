import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Icon({ path, className, ...props }) {
  const route = '/icon/' + path + '.svg'
  return (
    <img className={`icon ${className}`} src={route} {...props}/>
  )
}
export function Avatar({ source }) {
  const [img, setImg] = useState('/person.png');
  

  useEffect(() => {
    if (source !== null) {
      setImg(source);
    }
  }, [source]);

  const handleImageError = () => {
    setImg('/person.png');
  };

  return (
    <img
      src={img}
      className='p_photo'
      alt='Avatar'
      onError={handleImageError} // Add error handler
    />
  );
}
export function Nav() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [menuVisible, setMenuVisible] = useState(false);
  const [Toggle, setToggle] = useState(false);
  const [Logout, setLogout] = useState(false);

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
  const handleLogout = () => {
    setLogout(!Logout)
  }
  const logoutLocation = useNavigate();

  const handleUserLogout = () => {
    //delete account logic
    logoutLocation() //replace with the actual route
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

  // Conditionally apply CSS classes based on screen width
  const hiddenClass = screenWidth <= 950 ? '' : 'hidden';
  const containClass = screenWidth <= 630 ? 'close-nav' : screenWidth <= 950 ? 'mid-nav': "";
    return (
      <>
     
        <header className='home-header'>
        <Icon path={'menu-circle-with-dots'} className={`hamburger ${hiddenClass}`} onClick={toggleMenu}/>
        <img src='/PV.png' className='logo'/>
        </header>

        <div className='contain'style={menuStyle}>
        <nav className="nav" style={{...navStyle}}>
        {Logout &&  
      <div className="overlay-3">
                    <div className="log">
                    <div className="logout-header">
                      <h2>LogOut</h2>
                      <button className="close-button" onClick={handleLogout}>
                        <span>&times;</span>
                      </button>
                      <Icon width='60' className='logout-icon' path= 'logout' />
                      <p>You will have to Log In Again. Are You Sure?</p>
                    </div>
                    <div className="delete-acc-footer">
                      <button className="delete-acc-button-1" onClick={handleLogout}>
                        No
                      </button>&nbsp;&nbsp;
                      <button className="delete-acc-button-2">
                        Yes
                      </button>
                    </div>
                    </div>
                  </div>}
          <ul> 
            <Link to={`/feed/home`}><li className='active'><Icon className='hint' path='home-3'/><span>Home</span></li></Link>
            <Link to={`/feed/explore`}><li><Icon className='hint'  path='compass-navigator'/><span>Explore</span></li></Link>
            <Link to={`/notifications`}><li><Icon className='hint' path='notification'/><span>Notifications</span></li></Link>
            <Link to={`/messages`}><li><Icon className='hint'  path='message'/><span>Messages</span></li></Link>
            <Link to={`/bookmarks`}><li><Icon className='hint'  path='bookmark'/><span>Bookmarks</span></li></Link>
            <Link to={`/ranking`}><li><Icon className='hint'  path='rank'/><span>Ranking</span></li></Link>
            <Link to={`/about`}><li><Icon className='hint'  path='about-us'/><span>About us</span></li></Link>
            <Link to={`/feed/discover`}><li className={hiddenClass}><Icon className='hint'  path='ai-discover'/><span>Discover</span></li></Link>
            <Link to={`/feed/create`}><li className="create"><Icon className='hint'  path='create'/><span>Create</span></li></Link>
          </ul>
          
          {Toggle && <div className='toggle-settings' onClick={handleToggle}>
            <Link to = '/feed/settings'>
            <div className="settings">
              settings<Icon path= 'settings' />
            </div>
            </Link>
          
            <div className="logout" onClick={handleLogout}>
              LogOut<Icon path= 'logout' />
            </div>
            </div>}
          <div className="me" onClick={handleToggle}>
            <Avatar source={null}/>
            <div className="b_info">
              <div>
                <p>PhyroKel</p>
              <p>Enchanted Muse</p>
              </div>
              <Icon path= 'menu-circle-with-dots' />
            </div>
          </div>
        </nav>
        <div className={containClass} onClick={toggleMenu}></div>
        </div>
      </>


    )
}
