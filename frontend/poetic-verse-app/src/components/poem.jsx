import { useEffect, useState } from "react";
import React, { Component } from "react";
import { inst, getRelativeTime, apiRequest } from '../utils';
import { Icon, Avatar } from "./navbar";
import { Loader } from "./loader";

export class Poem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      loading: false,
      page: 4,
      prev: 0,
      next: 0,
      age: 'newest',
      prevY: 0,
    };
    this.url = props.url;
    this.method = props.method;
    this.data = props.data;
    this.loadingRef = React.createRef();
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

    apiRequest(`/${this.url}?_age=${age}&curr=${page}&page_size=10`, this.method, this.data)
      .then((res) => {
        this.setState((prevState) => ({
          pages: age == 'newest'?[...res.data.pages, ...prevState.pages]: [...prevState.pages, ...res.data.pages],
          prev: res.data.prev,
          next: res.data.next,
          loading: false,
        }));
        console.log(this.state.pages)

      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  }

  handleObserver(entities) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y && this.state.prev > 0) {
      this.getPoems(this.state.prev, 'oldest');
    }
    if (y < 0 && this.state.next !== null && y < this.state.prevY) {
      // Scrolled to the top
      this.getPoems(this.state.next, 'newest');
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
      <div className="poem">
        <div className="title">
          <h3>Home</h3>
          <Icon path={'home-3'}/>
        </div>
        <ul>
          <div style={{ minHeight: '800px' }}>
            {this.state.pages.map((at) => {
             return (
             <li key={at.id}>
               <article className="poem">
                 <div className="others">
                   <Avatar source={at.author_avatar}/>
                   <h3>{at.author_pen_name}</h3>
                   <p className="rank">{at.author_rank}<span><i className="fa-solid fa-circle"></i>{getRelativeTime(at.created_when)}</span></p>
                 </div>
                 <h4>{at.title}</h4>
                 <p className='poem_body'>{at.body}</p>
                 <div className="likesComment">
                   <p><Icon className='poem_info'  path='comment'/><span>{at.comment_count}</span></p>
                   <p><Icon className='poem_info'  path='bookmark'/><span>{at.like_count}</span></p>
                 </div>
               </article>
             </li>
             )
           })}
          </div>
          <div ref={this.loadingRef} style={loadingCSS}>
            <Loader/>
          </div>
        </ul>
      </div>
    );
  }
}


export function Posem() {
    const [ articles, setArticle ] = useState([])
   useEffect(() => {
     inst.get('/poems?_age=newest&curr=0&page_size=10')
       .then((response) => {
         const po = response.data.pages;
         console.log(response.data)
         setArticle(po); // Update the state with the received data
       })
       .catch((error) => {
         console.error(error);
       });
     }, []);
     return (
       <ul className="poem">
         {
           
         }
       </ul>
     )
   }

export function Discover() {
    const [ articles, setArticle ] = useState([])
    useEffect(() => {
      inst.get('/explorepoems')
        .then((response) => {
          const po = response.data;
          setArticle(po); // Update the state with the received data
        })
        .catch((error) => {
          console.error(error);
        });
      }, []);
    return (
      <div className='discover'>
        <ul>
            {articles.map((at) => {
                return (
                  <li key={at.id}>
                    <h3>{at.author_pen_name}</h3>
                    <h4>{at.author_rank}</h4>
                    <p>{at.title}</p>
                  </li>
                )
            })}
        </ul>
      </div>
    )
}
