import { Icon } from "./navbar"; 
import { apiRequest } from "../utils";
import { useState } from "react";

export function Loader() {
    return (
    <div className="loader">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
    </div>
    )
}
export function Bookmark({ id, lik, like_count, ...props }) {
    const [liked, setLiked] = useState(lik);
    const [count, setCount] = useState(like_count);
  
    const handleLike = (event) => {
      event.stopPropagation();
      apiRequest(`/poem/like?poem_id=${id}`, 'GET', null, true)
        .then((res) => {
          setLiked(res.data.liked); // Update liked state from the response
          setCount(res.data.liked ? count + 1 : count - 1);
        })
        .catch((err) => {
          console.error(err);
        });
    };
  
    return (
      <p onClick={handleLike} {...props}>
        <Icon path={liked ? 'bookmark-full' : 'bookmark'} className='poem_info' />
        <span>{count}</span>
      </p>
    );
  }

export function Switch() {
    return (
        <label className="switch">
            <input type="checkbox"></input>
            <span className="slider"></span>
        </label>
    )
}
