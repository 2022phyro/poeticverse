import { Icon } from '../components/navbar';
import '../styles/Profile.css';
import { useUserContext } from '../utils';
import { useState, useEffect } from 'react';
import { ProfileInfo, UserPoems, UserLikes } from '../components/profileSection';
import { api } from '../utils';
export function ProfileSection() {
    const { state } = useUserContext()
    const [active, setActive] = useState('poems')
    const [userDetails, setUuser] = useState({})
    const queryParams = new URLSearchParams(location.search);
    const authorId = queryParams.get('id'); // Replace 'parameterName' with the name of your query parameter
    const handleTabPoem = () => {
        setActive('poems')
    }
    const handleTabLike = () => {
        setActive('likes')
    }
    const handleTabComm = () => {
        setActive('comm')
    }
    useEffect(() => {  
        api().get(`/user?user_id=${authorId}`)
          .then((res) => {
            const myData = res.data;
            setUuser(myData);
          })
          .catch((err) => console.error(err));
      }, []);
    return (
        <>
          <div className="title">
            <h3>{userDetails.pen_name}</h3>
          </div>
          <div className='user-body'>
          <img className='top-img' src='/background-user.jpeg'/>
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
          <div className='tab-body'>
            <div style={{display: active == 'likes'? 'flex': 'none'}}>
                <UserLikes user_id={authorId}/>
            </div>
            <div style={{display: active == 'comm'? 'flex': 'none'}}>
                <UserLikes user_id={authorId}/>
            </div>
            <div style={{display: active == 'poems'? 'flex': 'none'}}>
                <UserPoems author={authorId}/>
            </div>
          </div>

          </div>
            <ProfileInfo {...userDetails}/>
        </>
    )
}
