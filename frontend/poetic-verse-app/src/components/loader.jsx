import { Icon } from "./navbar"; 
import { api, checkAuth } from "../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const [isauth, setAuth] = useState(checkAuth())
    const navigate = useNavigate()
    const handleLike = (event) => {
      event.stopPropagation();
      if (isauth) {
        api(true).get(`/poem/like?poem_id=${id}`)
          .then((res) => {
            setLiked(res.data.liked); // Update liked state from the response
            setCount(res.data.liked ? count + 1 : count - 1);
          })
          .catch((err) => {
            if (err.status_code == 401) {
              navigate('/feed/loggedout')
            }
            console.error(err);
          });
      } else {
        navigate('/feed/loggedout')
      }
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
