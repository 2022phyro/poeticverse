import { useState, useEffect, createRef } from 'react';
import { Icon, Avatar } from '../components/navbar';
import '../styles/Profile.css';
import '../styles/userpage.css';
import { Component } from 'react';
import { api } from '../utils';
import { getRelativeTime } from '../utils';
import { Loader } from './loader';
import { PoemObject } from './poem';
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
                    <div>
                    <Icon path='time-round'/>
                    <p>Been a member since {getRelativeTime(props.created_at)} ago</p>
                    </div>
                
                    <h3>Bio</h3>
                    <p>{props.bio}</p>
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
        height: '100px',
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
               <li key={at.id}>
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
    }, [])
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
