import { useState } from 'react'
import '../styles/explore.css'
import { Icon } from '../components/navbar'
import { api } from '../utils'
import { Loader } from '../components/loader'
import { PoemObject } from '../components/poem'
import { Avatar } from '../components/navbar'


export function Search() {
    const [mode, setMode] = useState('poem');
    const [query, setQuery] = useState('');
    const [useResults, setUesults] = useState([]);
    const [poemResults, setPesults] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleCheckboxChange = () => {
      setMode(mode === 'poem' ? 'author' : 'poem');
    };
  
    const placeholder = mode === 'poem' ? 'Search by poem' : 'Search by author';
  
    const handleSearch = () => {
      if (query.trim() !== '') {
        // Make an API request here based on the query and mode
        // You can use axios or fetch for the API request
        // For example, with axios:
        setLoading(true);
        if (mode === 'poem') {
            api().get(`searchpoem?search_string=${query}&curr=0`)
            .then((res) => {
                setLoading(false)
                setPesults(res.data.pages)
            })
            .catch((err) => {
                console.error(err)
            })
        } else if (mode === 'author') {
            api().get(`searchuser?search_string=${query}&curr=0`)
            .then((res) => {
                setLoading(false)
                setUesults(res.data.pages)
            })
            .catch((err) => {
                console.error(err)
            })
        }
      }
    };
  
    // useEffect(() => {
    //   // Automatically trigger the search when the query changes
    //   handleSearch();
    // }, [query, mode]);
  
    return (
      <div>
        <div className="title">
          <h3>Search</h3>

          <div className="search-bar">
          <label className="switch">
            <input type="checkbox" onChange={handleCheckboxChange} />
            <span className="slider"></span>
          </label>
            <input
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Icon path='compass-navigator' onClick={() => handleSearch()}/>
          </div>
        </div>
        {loading ? (
          <Loader/>
        ) : 
        (
        <ul>
          {mode == 'poem' ? (
            poemResults.map((at) => {
              return (
                <li key={at.id}>
                  <PoemObject touser={true} {...at}/>
                </li>
              )
            })
          ): (
            useResults.map((at) => {
            return (
              <li key={at.id}>
                <article className='search-user-result'>
                <Avatar source={at.profile_picture} id={at.id}/>
                <p className='user-names'>
                    {`${at.first_name} ${at.last_name}`}
                </p>
                <p className='user-pen'>{at.pen_name}</p>
                <p className="user-rank">{at.rank}</p>
                </article>
              </li>
              )
            }))
          }
        </ul>
        )}
      </div>
    );
  }
