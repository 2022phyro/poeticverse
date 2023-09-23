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
    const [count, setCount] = useState(like_count)
    const [path, setPath] = useState(lik ? 'bookmark-full': 'bookmark')

    const handleLike = (event) => {
        event.stopPropagation();
        apiRequest(`/poem/like?poem_id=${id}`, 'GET', null, true )
        .then ((res) => {
            setPath(res.data.liked ? 'bookmark-full' : 'bookmark');
            setCount(res.data.liked ? count + 1 : count - 1)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
        <p onClick={handleLike} {...props}> {/* Add an onClick handler to trigger the like action */}
          <Icon className='poem_info' path={path} />
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
