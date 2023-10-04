import { Icon } from '../components/navbar';
import '../styles/Profile.css';
import { useUserContext } from '../utils';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileInfo, UserPoems, UserLikes, UserComments } from '../components/profileSection';
import { api } from '../utils';
import { Loader } from '../components/loader';
export function ProfileSection() {
    const { state } = useUserContext()
    const [active, setActive] = useState('poems')
    const [userDetails, setUser] = useState({})
    const [search, setSearch] = useState(true)
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // Create a state variable to hold the authorId
    const [authorId, setAuthorId] = useState(queryParams.get('id'));
    const id = state.profile.id;
  
    const handleTabPoem = () => {
      setActive('poems');
    };
  
    const handleTabLike = () => {
      setActive('likes');
    };
  
    const handleTabComm = () => {
      setActive('comm');
    };
  
    useEffect(() => {
      // Update the authorId state whenever it changes from the URL
      const newId = queryParams.get('id')
      if (newId !== authorId) {
        setAuthorId(newId);
        setSearch(true)
      }
      if (search) {
        setLoading(true)
        api()
          .get(`/user?user_id=${authorId}`)
          .then((res) => {
            const myData = res.data;
            setUser(myData);
            setSearch(false)
            setLoading(false)
          })
          .catch((err) => console.error(err));
      }
    }, [search, queryParams, authorId]); 
    return (
        <>
        {loading ? (
          <Loader/>
        ): (<>
                  <div className="title">
            <h3>{userDetails.pen_name}</h3>
          </div>
          <div className='user-body'>
          <img className='top-img' src='/background-user.jpeg'/>
          <ProfileInfo {...userDetails}/>
          <div className='tab-wrapper'>
          <ul className='tabheader'>
            <li 
              className={`tab-option ${active == 'poems' ? 'active-tab': ""}`}
              onClick={handleTabPoem}>
                <Icon path='pencil'/>
                <h3>Posts</h3>
            </li>
            <li 
              className={`tab-option ${active == 'likes' ? 'active-tab': ""}`}
              onClick={handleTabLike}>
                <Icon path='bookmark'/>
                <h3>Bookmarks</h3>
            </li>
            <li 
              className={`tab-option ${active == 'comm' ? 'active-tab': ""}`}
              onClick={handleTabComm}>
                <Icon path='chat-tab'/>
                <h3>Comments</h3>
            </li>
          </ul>            
          </div>

          <div className='tab-body'>
            <div style={{display: active == 'likes'? 'flex': 'none'}}>
                <UserLikes user_id={authorId}/>
            </div>
            <div style={{display: active == 'comm'? 'flex': 'none'}}>
                <UserComments myId={id} user_id={authorId}/>
            </div>
            <div style={{display: active == 'poems'? 'flex': 'none'}}>
                <UserPoems url='poems' myId={id} author_id={authorId}/>
            </div>
          </div>

          </div>
          </>)}

        </>
    )
}
