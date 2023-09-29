import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Section1() {
    return (
        <div className='section1'>
            <section>
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
  const nav = useNavigate()

    return (
        <>
        <header className='header start-header'>
          <img
              src={logo} 
              alt="Your Logo"
              height="50"
              width="60"
              className='logo'
          />
        </header>
        <button className='sign-up-button' onClick={() => nav('/auth/signup')}>Signup</button>
          <main>
            <Section1/> 
          </main>
        </>
      )
}
export default Index;
