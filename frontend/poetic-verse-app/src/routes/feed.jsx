import '../styles/feed.css';
import { Outlet } from 'react-router-dom';
import { Nav } from '../components/navbar';
import { PopUp } from '../components/loader';


function Feed() {
    return (
      <div className='body' id='body'>
        
        <Nav/>
        <div className="f-main">
          <main className='mainfeed'>
            <Outlet/>
          </main>
        </div>
        <PopUp/>
      </div>
    )
}

export default Feed
