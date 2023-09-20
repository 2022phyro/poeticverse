import '../styles/index.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import iconImage from '../assets/icon.png'; 

function Section1() {
    return (
        <div className='section1'>
            <section>
              <div className="overlay"></div>
              <div className="content">
                <p>Unleash words that resonate, intertwine with fellow souls,
                  and ignite your imagination. Dance under the moonlit sky,
                  where verses bloom like stars. Join us, poets,
                  in this celestial symphony.
                </p>
              </div>
              <ul className='options'>
                <li>EMBARK</li>
                <li>CRAFT</li>
                <li>ENVISAGE</li>
                <li>UNITE</li>
              </ul>
            </section>  
        </div>
    )
}
function Index() {
    return (
        <>
        <nav className="custom-navbar">
      <div className="container">
        <div className="navbar-brand">
          <img
            src={logo} 
            alt="Your Logo"
            height="50"
            width="60"
          />
        </div>
        <div className="custom-search">
          <button className="search-button">
            <a href={iconImage} target="_blank" rel="noopener noreferrer">
              <img src={iconImage} alt="Custom Icon" height="20" width="20" />
            </a>
          </button>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
        <button className="navbar-toggle">
          <span className="navbar-toggle-icon"></span>
        </button>
        <div className="custom-links">
          <a href="#explore">EXPLORE</a>
          <a href="#create">CREATE</a>
          <a href="#envision">ENVISION</a>
          <a href="#connect">CONNECT</a>
          <div className="signup-button-container">
          <li><Link to={`auth/signup`}></Link><button class="hover-button"><span>SIGN UP</span></button>
</li>
</div>
        </div>
      </div>
    </nav>
          <main>
            <Section1/> 
            <section className="section3">
              <article>
                <img src="./disp1.png" alt="moolit sky"/>
                <div className="words">
                  <h2>
                    Under the Moonlit Sky: Pen Your Masterpiece
                  </h2>
                  <p>
                    In the tranquil vista, find inspiration&apos;s embrace,
                    As flowing verses sway with poetic grace.Become the silhouette 
                    beneath the tree&apos;s shade,Where your words soar high, dreams unafraid.
                    Join our poetic realm, let imagination cascade.
                  </p>
                </div>
                
              </article>
              <article>
                <div className="words">
                  <h2>
                    An Animated Book: A Gateway to Expression
                  </h2>
                  <p>
                    Witness the captivating artistry as the animated book opens up,
                    revealing the breathtaking beauty of PoeticVerse.
                      Embrace the magical journey.
                  </p>
                </div>
                <img src="./disp2.png" alt="abstract fish like painting"/>
              </article>
              <div className="dp1">
                <article>
                  <img src="./disp3.png" alt="a strong woman"/>
                  <div className="words">
                    <h2>
                      Empowerment
                    </h2>
                    <p>
                      In the tranquil vista, find inspiration&apos;s embrace,
                      As flowing verses sway with poetic grace.
                      Become the silhouette beneath the tree&apos;s shade,
                      Where your words soar high, dreams unafraid.
                      Join our poetic realm, let imagination cascade.
                    </p>
                  </div>
                </article>
                <article>
                  <img src="./disp4.png" alt="A couple surrounded by flowers"/>
                  <div className="words">
                    <h2>
                      Passion
                    </h2>
                    <p>
                      Amidst the tranquil landscape, let inspiration take hold,
                      Flowing verses like rivers of silver and gold.
                      Be the silhouette under the tree&apos;s gentle sway,
                      Watch your poetry soar to the realms far away.
                      Join us in this poetic dance, where dreams unfold.
                    </p>
                  </div>
                </article>
              </div>
            </section>
          </main>
          <footer></footer>
        </>
      )
}
export default Index;
