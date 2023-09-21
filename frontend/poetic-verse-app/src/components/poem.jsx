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
      page: 0,
      prev: 0,
      next: 0,
      age: 'newest',
      prevY: 0,
    };
    this.url = props.url;
    this.method = props.method;
    this.data = props.data;
    this.auth = props.auth;
    this.main = props.main;
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

    apiRequest(`/${this.url}?_age=${age}&curr=${page}&page_size=3`, this.method, this.data, this.auth)
      .then((res) => {
        this.setState({pages: [...this.state.pages, ...res.data.pages]});
        this.setState({prev: res.data.prev})
        this.setState({next: res.data.next})
        this.setState({loading: false})
        console.log("this.state.pages.length")
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
      <div className="poem">
        {
          this.main ?  <div className="title">
          <h3>Home</h3>
          <Icon path={'home-3'}/>
        </div> : <></>
        }

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
            <div style={loadingTextCSS}>
            <Loader/>
            </div>
          </div>
        </ul>
      </div>
    );
  }
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
