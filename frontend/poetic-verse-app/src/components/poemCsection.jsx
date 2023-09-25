import '../styles/comments.css'
import { useState, useEffect, useRef } from "react";
import { api } from "../utils";
import { useLocation } from "react-router-dom";
import { Avatar } from "./navbar";
import { Bookmark, Loader } from "./loader";
import { Icon } from "./navbar";
import { getRelativeTime } from "../utils";
import CommentSection from './commentSection';

export function PoemSection() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);  
    const id = searchParams.get('id');
    const [data, setData] = useState({})
    const isFetching = useRef(true);

    useEffect(() => {
      isFetching.current = true
      setTimeout(() => {
        api(true).get(`/poem?poem_id=${id}`)
        .then((res) => {
            console.log(res.data)
            setData(res.data)
            isFetching.current = false;
            console.log(data.like_count, data.liked)
        })
        .catch((err) => console.error(err))
      }, 2000)
    }, [])
    return (
              <div className='poem-section'>
                {isFetching.current ? 
                <Loader/> : 
                (
                  <>
                  <article className="poem-object">
                  <div className="others">
                    <Avatar source={data.author_avatar} id={data.author_id}/>
                    <h3>{data.author_pen_name}</h3>
                    <p className="rank">{data.author_rank}<span><i className="fa-solid fa-circle"></i>{getRelativeTime(data.created_when)}</span></p>
                  </div>
                  <h4>{data.title}</h4>
                  <p className='poem_body'>{data.body}</p>
                  <div className="likesComment">
                  <p><Icon className='poem_info'  path='comment'/><span>{data.comment_count}</span></p>
                    <Bookmark id={data.id} lik={data.liked} like_count={data.like_count}/>
                    </div>
                  </article>
                  <CommentSection id={data.id} type={'poem'}/>
                  </>
                )}
              </div>
    )
}
export function CommentRepliesSection() {
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);  
  const id = searchParams.get('id');
  const [data, setData] = useState({})
  const isFetching = useRef(true);

  useEffect(() => {
    isFetching.current = true
    setTimeout(() => {
      api()
      .get(`/comment?id=${id}`)
      .then((res) => {
          setData(res.data)
          isFetching.current = false;
      })
      .catch((err) => console.error(err))
    }, 2000)
  }, [id])
  return (
            <div className='poem-section'>
              {isFetching.current ? 
              <Loader/> : 
              (
                <>
                <article className="poem-object">
                <div className="others">
                  <Avatar source={data.author_avatar} id={data.author_id}/>
                  <h3>{data.author_pen_name}</h3>
                  <p className="rank">{data.author_rank}<span><i className="fa-solid fa-circle"></i>{getRelativeTime(data.created_when)}</span></p>
                </div>
                <h4>{data.title}</h4>
                <p className='poem_body'>{data.body}</p>
                <div className="likesComment">
                <p><Icon className='poem_info'  path='comment'/><span>{data.comment_count}</span></p>
                  </div>
                </article>
                <CommentSection id={data.id} type={'comment'}/>
                </>
              )}
            </div>
  )
}
