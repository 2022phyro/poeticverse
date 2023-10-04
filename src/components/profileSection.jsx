import { useState, useEffect, useRef } from 'react';
import { Icon, Avatar } from '../components/navbar';
import '../styles/Profile.css';
import '../styles/userpage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { api, usePopup } from '../utils';
import { getRelativeTime } from '../utils';
import { Loader } from './loader';
import { PoemObject } from './poem';

const DeleteIcon = (props) => {
  const [submit, setSubmitting] = useState(false)
  const openPopUp = usePopup()
  const handleDel = () => {
    const message = `Are you sure you want to delete this ${props.type}. Note the action is irreversible`
    openPopUp(message, 'Delete', del)
  }
  const x = []
  const del = () => {
    const url = props.type == 'poem' ? `/${props.type}?poem_id=${props.id}` : `/${props.type}?id=${props.id}`
    console.log(url)
    if (!submit) {
      setSubmitting(true)
      api(true)
      .delete(url)
      .then(() => {
        setSubmitting(false)
        props.removeItem(props.id)
      })
      .catch ((err) => {
        console.error(err)
        setSubmitting(false)
      })
    }
  }
  return (<Icon path='recycle-bin' className='delete-icon' onClick={handleDel}/> )
}

function CommentTab (props) {
  const navig = useNavigate()
  const toParent = (event) => {
    event.stopPropagation();
    navig(`/feed/${props.parent}?id=${props.parent_id}`)
  }
  const toComment = (event) => {
    event.stopPropagation();
    navig(`/feed/comment?id=${props.id}`)
  }
  return (
    <>
    <article className="poem-object" onClick={toParent} >
      <div className="others">
        <Avatar source={props.parent_author_avatar} id={props.parent_author_id}/>
        <h3>{props.parent_author_pen_name}</h3>
        <p className="rank">{props.parent_author_rank}</p>
      </div>
      <p className='poem_body'>{props.parent_body}</p>
        <article className='comment-object' onClick={toComment}>
          <p className=''>{props.body}</p>
          <div className="likesComment">
            <p><Icon className='poem_info' path='comment'/><span>{props.comment_count}</span></p>
          </div>
        </article>
      </article>
    </>

  )
}
export function ProfileInfo (props) {
  return (
      <>
          <div className='user-cred'>
          <img src='/background-user.jpeg' className='side-img'/>
            <div className="image-placeholder">
              <Avatar source={props.profile_picture} className='avatar-img'/>
            </div>
            <div className="name-rank-duration">
              <h2 >{`${props.first_name} ${props.last_name}`}</h2>
              <small>{props.rank}</small>
              <aside>
                  <div className='duration'>
                  <Icon path='time-round'/>
                  <p>Since {getRelativeTime(props.created_at)} ago</p>
                  </div>
                  <div className='user-bio'>
                  <span className='quote'>&quot;</span>
                    <p>{props.bio}</p>
                    <span className='q2'>&quot;</span>
                  </div>
                  
              </aside>
            </div>
          </div>
      </>
  );
};

  export function UserPoems(props) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [initial, setInit] = useState(false);
    const [prevY, setPrevY] = useState(0);
    const [author_id, setAId] = useState(props.author_id || null)  
    const url = props.url;
    const auth = props.auth;
    const main = props.main;
    const loadingRef = useRef(null);
    const myId = props.myId
    const { id: author } = useParams();

    const removeItem = (itemId) => {
      const updatedItems = pages.filter((item) => item.id !== itemId);
      setPages(updatedItems);
    };
    useEffect(() => {
      if (props.author_id != author_id) {
        setInit(false)
        setAId(props.author_id)
      }
      if (!initial) {
        getPoems(0, 'oldest');
        setInit(true)
      }
      }, [initial, props.author_id, author_id])
      useEffect(() => {
        const loadingRefCurrent = loadingRef.current; // Create a variable to hold the current reference
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        };
        
        const handleObserver = (entities) => {
          const y = entities[0].boundingClientRect.y;
          if (prevY > y && prev > 1) {
            getPoems(prev, 'oldest');
          }
          setPrevY(y);
        };
    
        const observer = new IntersectionObserver(handleObserver, options);
        observer.observe(loadingRefCurrent);
    
        return () => {
          // Clean up the observer when the component unmounts
          observer.unobserve(loadingRefCurrent); // Use the variable here
        };
      }, [prevY, prev]);
    
  
    const getPoems = (page, age) => {
      if (loading) return;
      setLoading(true);
      const search = author_id ?`${url}?_age=${age}&curr=${page}&page_size=3&author_id=${author_id}` :
      `/${url}?_age=${age}&curr=${page}&page_size=3`
      api(true)
        .get(search)
        .then((res) => {
          setPages([...pages, ...res.data.pages]);
          setPrev(res.data.prev);
          setNext(res.data.next);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
  
    // Additional CSS
    const loadingCSS = {
      height: '100px',
      margin: '30px',
    };
  
    // To change the loading icon behavior
    const loadingTextCSS = { display: loading ? 'block' : 'none' };
  
    return (
      <div className="poem">
        {main ? (
          <div className="title">
            <h3>Home</h3>
            <Icon path='home-3'/>
          </div>
        ) : (
          <></>
        )}
  
        <ul>
            {pages.map((at) => (
              <li key={at.id}>
                { myId == author_id ?
                  <DeleteIcon type='poem' id={at.id} removeItem={removeItem}/>:
                  <></>
                }
                <PoemObject {...at} touser={true}/>
              </li>
            ))}
          <div ref={loadingRef} style={loadingCSS}>
            <div style={loadingTextCSS}>
              <Loader/>
            </div>
          </div>
        </ul>
      </div>
    );
  }
export function UserLikes ({user_id, ...props}) {
    const [items, setItems] = useState([])
    useEffect(()=> {
        api(true)
        .get(`/user/${user_id}/favorite_poems`)
        .then((res) => {
            setItems(res.data)
        })
        .catch((err) => {
            console.error(err)
        })
    }, [user_id])
    return (
        <ul>
            {items.map((at) => {
               return (
               <li key={at.id}>
                        
                        <PoemObject {...at}/>
               </li>
               )
             })}
        </ul>  
    )
}
export function UserComments({user_id, myId,...props}) {
  const [items, setItems] = useState([]);
  const removeItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };
  useEffect(()=> {
    api()
    .get(`/user/${user_id}/comments`)
    .then((res) => {
      setItems(res.data)
    })
    .catch((err) => {
      console.error(err);
    })
  }, [user_id])
  return (
    <ul>
        {items.map((at) => {
          return (
          <li key={at.id} className='part'>
            { myId == user_id ? 
                  <DeleteIcon type='comment' id={at.id} removeItem={removeItem}/>:
                  <></>
            }
            <CommentTab {...at}/>
          </li>
          )
        })}
    </ul>
  )
}
