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
    const [results, setResults] = useState([]);
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
                setResults(res.data.pages)
            })
            .catch((err) => {
                console.error(err)
            })
        } else if (mode === 'author') {
            api().get(`searchuser?search_string=${query}&curr=0`)
            .then((res) => {
                setLoading(false)
                setResults(res.data.pages)
            })
            .catch((err) => {
                console.error(err)
            })
        }
        console.log("yay", results)
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
          <label className="switch">
            <input type="checkbox" onChange={handleCheckboxChange} />
            <span className="slider"></span>
          </label>
          <div className="search-bar">
            <input
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <Icon path='compass-navigator'/>
            </button>
          </div>
        </div>
        {loading ? (
          <Loader/>
        ) : 
        (
        <ul>
            {results.map((at) => {
                return (
                    <li key={at.id}>
                        {mode === 'poem' ? (
                            <PoemObject touser={true} {...at}/>
                        ) : (
                        <article>
                            <Avatar source={at.profile_picture} id={at.id}/>
                            <div>
                                <span>{at.first_name}</span> <span>{at.last_name}</span>
                            </div>
                            <p>{at.pen_name}</p>
                            <p>{at.rank}</p>
                        </article>
                            )

                        }
                    </li>
                )
            })}
        </ul>
        )}
      </div>
    );
  }
