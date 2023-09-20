import '../styles/feed.css';
import { Outlet, Link } from 'react-router-dom';
import { Nav } from '../components/navbar';
import { Poem, Discover } from '../components/poem';


// function SeeMoreText({ title, linestoShow, text }) {
//   const [expanded, setExpanded] = useState(false);
//   const [ val, setView ] = useState('...See more');
//   const truncatedText = text.split(/\n|\n\r/).slice(0, linestoShow).join('\n');

//   const toggleExpansion = () => {
//     setExpanded(!expanded);
//     val == 'Hide' ? setView('...See more') : setView('Hide')
//   };
//   return (
//     <>
//       <h4>{title}</h4>
//       <p className={expanded ? 'expanded' : 'collapsed'}>
//         {expanded ? text : truncatedText}
//       </p>
//       {text.split(/\n|\n\r/).length > linestoShow && !expanded && (
//         <button onClick={toggleExpansion} className="see-more-button">
//           {val}
//         </button>
//       )}
//     </>
//   )

// }

function Feed() {
    return (
        <div className='body' id='body'>
    <Nav/>
    <div className="f-main">
      <main className='mainfeed'>
        <Outlet/>
        {/* <Discover/> */}
      </main>
    </div>

        </div>
    )
}

export default Feed
