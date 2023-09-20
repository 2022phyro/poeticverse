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
    const [liked, setLiked] = useState(lik)
    const [path, setPath] = useState(lik ? 'bookmark-full': 'bookmark')

    const handleLike = () => {
        apiRequest(`/poem/like?id=${id}`, 'GET', null, true )
        .then ((res) => {
            setLiked(res.liked);
            setPath(res.liked ? 'bookmark-full': 'bookmark' )
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
        <p onClick={handleLike}> {/* Add an onClick handler to trigger the like action */}
          <Icon className='poem_info' path={path} />
          <span>{like_count}</span>
        </p>
      );
}
