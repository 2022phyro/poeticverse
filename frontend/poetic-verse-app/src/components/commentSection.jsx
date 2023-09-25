import {useState, useEffect } from 'react';
import { api } from '../utils';
import { Icon, Avatar } from "./navbar";
import { useNavigate, useLocation } from 'react-router-dom';
import { Bookmark } from "./loader";
import { getRelativeTime } from '../utils';

export const CommentObject = (props) => {
  const navig = useNavigate()
  const toComment = (event) => {
    event.stopPropagation();  
    navig(`/feed/comment?id=${props.id}`);
  }
  return (
    <article className="comment-object" onClick={toComment}>
    <div className="others">
      <Avatar source={props.author_pen_name} id={props.author_id} />
      <h3>{props.author_pen_name}</h3>
      <p className="rank">{props.author_rank}<span><i className="fa-solid fa-circle"></i>{getRelativeTime(props.created_when)}</span></p>
    </div>
    <p className='poem_body'>{props.body}</p>
    <div className="likesComment">
      <p><Icon className='poem_info' path='comment'/><span>{props.comment_count}</span></p>
    </div>
  </article>
  )
}
function CommentSection({ id, type, ...props }) {
  const [comments, setCmm] = useState([]);
  const [newcmm, setLoad] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const url = type === 'poem' ? '/poem/comments' : '/comment/comments';
  const data = type === 'poem' ? { poem_id: id } : { parent_id: id };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bodyValue = formData.get('body').trim();

    if (bodyValue) {
      data['body'] = bodyValue;
      console.log('Form Data:', data);
      api(true)
        .post('/comment', data)
        .then(() => {
          setLoad(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    // Update the 'id' and 'newcmm' when the 'id' in the search params changes
    const newId = searchParams.get('id');
    if (newId !== id) {
      setCmm([]);
      data['poem_id'] = newId;
      setLoad(true);
    }
  }, [id]);

  useEffect(() => {
    if (newcmm) {
      api()
        .get(`${url}?id=${id}`)
        .then((res) => {
          setCmm(res.data);
          setLoad(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [newcmm, id, url]);

  return (
    <>
      <ul className="comment-section">
        {comments.map((pro, index) => {
          return (
            <li key={index}>
              <CommentObject {...pro} />
            </li>
          );
        })}
      </ul>
      <div className='create-comment'>
        <form onSubmit={handleSubmit}>
          <textarea type='text' required name='body' />
          <button type='submit' className='submit-button'>
            <Icon path='paper-airplane' className='submit-comment' />
          </button>
        </form>
      </div>
    </>
  );
}
export default CommentSection
