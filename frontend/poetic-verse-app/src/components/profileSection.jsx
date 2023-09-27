import { useState, useEffect, createRef } from 'react';
import { Icon, Avatar } from '../components/navbar';
import '../styles/Profile.css';
import '../styles/userpage.css';
import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils';
import { getRelativeTime } from '../utils';
import { Loader } from './loader';
import { PoemObject } from './poem';

const DeleteIcon = (props) => {
  const [submit, setSubmitting] = useState(false)
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
  return (<Icon path='recycle-bin' className='delete-icon' onClick={del}/> )
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
          <p className='poem_body'>{props.body}</p>
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
        <div className="Profile-container">

          <div className="profile-sidebar">
            <div className="profile-content">
              <div className="">
                <Avatar source={props.profile_picture} className='profile-img'/>
              </div>
              <div className="profile-body">
                <b>{`${props.first_name} ${props.last_name}`}</b>&nbsp;&nbsp;
                <small className="verse">{props.rank}</small>
                <aside>
                    <div className='user-age'>
                    <Icon path='time-round'/>
                    <p>Been a member since {getRelativeTime(props.created_at)} ago</p>
                    </div>
                    <div className='user-bio'>
                      <p><span className='quote'>&quot;</span>{props.bio}</p>
                      <span className='quote q1'>&quot;</span>
                    </div>
                    
                </aside>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export class UserPoems extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pages: [],
        loading: false,
        page: 0,
        prev: 0,
        next: 0,
        age: 'newest',
        prevY: 0,
      };
      this.url = props.url;
      this.author = props.author;
      this.main = props.main;
      this.myId = props.myId
      this.loadingRef = createRef();
    }
  
    componentDidMount() {
      this.getPoems(this.state.page, this.state.age);
    
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      };
      this.observer = new IntersectionObserver(this.handleObserver.bind(this), options);
      this.observer.observe(this.loadingRef.current);
    }
    componentDidUpdate(prevProps) {
   const queryParams = new URLSearchParams(window.location.search);
    this.author = queryParams.get('id');
      if (prevProps.author !== this.props.author) {
        this.setState({
          pages: [],
          loading: false,
          page: 0,
          prev: 0,
          next: 0,
          age: 'newest',
          prevY: 0,
        });
        this.getPoems(this.state.page, this.state.age);
      }
    }
    removeItem = (itemId) => {
      const updatedItems = this.state.pages.filter((item) => item.id !== itemId);
      this.setState({ pages: updatedItems });
    };
    getPoems(page, age) {
      if (this.state.loading) return;
  
      this.setState({ loading: true });
  
      api(true).get(`/poems?_age=${age}&curr=${page}&page_size=3&author_id=${this.author}`)
        .then((res) => {
          this.setState({pages: [...this.state.pages, ...res.data.pages]});
          this.setState({prev: res.data.prev})
          this.setState({next: res.data.next})
          this.setState({loading: false})
        })
        .catch((error) => {
          console.error(error);
          this.setState({ loading: false });
        });
    }
  
    handleObserver(entities) {
      const y = entities[0].boundingClientRect.y;
      if (this.state.prevY > y && this.state.prev > 1) {
        this.getPoems(this.state.prev, 'oldest');
      }
      this.setState({ prevY: y });
    }
  
    render() {
      // Additional CSS
      const loadingCSS = {
        height: '50px',
        margin: '30px',
      };
  
      // To change the loading icon behavior
      const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' };
      console.log(this.state.pages)
      return (
          <ul>
            <div style={{ minHeight: '800px' }}>
              {this.state.pages.map((at) => {
               return (
               <li key={at.id} className='part'>
                { this.myId == this.author ?
                  <DeleteIcon type='poem' id={at.id} removeItem={this.removeItem}/>:
                  <></>
                }
                        <PoemObject {...at}/>
               </li>
               )
             })}
            </div>
            <div ref={this.loadingRef} style={loadingCSS}>
              <div style={loadingTextCSS}>
              <Loader/>
              </div>
            </div>
          </ul>
      );
    }
  }
  
export function UserLikes ({user_id, ...props}) {
    const [items, setItems] = useState([])
    console.log(user_id)
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
            <div style={{ minHeight: '800px' }}>
              {items.map((at) => {
               return (
               <li key={at.id}>
                        
                        <PoemObject {...at}/>
               </li>
               )
             })}
            </div>
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
      <div style={{ minHeight: '800px' }}>
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
      </div>
    </ul>
  )
}
