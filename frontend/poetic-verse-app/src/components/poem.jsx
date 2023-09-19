import { useEffect, useState } from "react";
import { inst, getRelativeTime } from '../utils';
import { Icon, Avatar } from "./navbar";
import { formatDistanceToNow } from 'date-fns';


export function Poem() {
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
           articles.map((at) => {
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
           })
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
