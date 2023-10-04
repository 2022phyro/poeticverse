import { useEffect, useState, useRef } from "react";
import React, { Component } from "react";
import {getRelativeTime, api } from '../utils';
import { useNavigate } from "react-router-dom";
import { Icon, Avatar } from "./navbar";
import { Loader, Bookmark } from "./loader";

export function PoemObject(props) {
  const navig = useNavigate()
  const toComment = (event) => {
    event.stopPropagation();
    navig(`/feed/poem?id=${props.id}`)
  }
  return (
    <article className="poem-object" onClick={toComment} >
      <div className="others">
        <Avatar source={props.author_avatar} id={props.author_id}/>
        <h3>{props.author_pen_name}</h3>
        <p className="rank">{props.author_rank}<span><i className="fa-solid fa-circle"></i>{getRelativeTime(props.created_when)}</span></p>
      </div>
      <h4>{props.title}</h4>
      <p className='poem_body'>{props.body}</p>
      <div className="likesComment">
        <p><Icon className='poem_info'  path='comment'/><span>{props.comment_count}</span></p>
        <Bookmark id={props.id} lik={props.liked} like_count={props.like_count}/>
      </div>
    </article>
  )}

export function Poem(props) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(0);
  const [initial, setInit] = useState(false);
  const [prevY, setPrevY] = useState(0);

  const url = props.url;
  const auth = props.auth;
  const main = props.main;
  const author_id = props.author_id ? props.author_id : null
  const loadingRef = useRef(null);

  useEffect(() => {
    if (!initial) {
      getPoems(0, 'oldest');
      setInit(true)
    }
    }, [initial])
  
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
    api(auth)
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
        </div>
      ) : (
        <></>
      )}

      <ul>
        <div style={{ minHeight: '800px' }}>
          {pages.map((at) => (
            <li key={at.id}>
              <PoemObject {...at} touser={true}/>
            </li>
          ))}
        </div>
        <div ref={loadingRef} style={loadingCSS}>
          <div style={loadingTextCSS}>
            <Loader/>
          </div>
        </div>
      </ul>
    </div>
  );
}

export function Discover() {
    const [ articles, setArticle ] = useState([])
    useEffect(() => {
      api().get('/explorepoems')
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
