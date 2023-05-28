import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
            <Link to='/profile'>Profile</Link>
          </li>

          <li>
            <Link to='/map'>Map</Link>
          </li>

        {!isAuthenticated && (
          <li>
            <button onClick={loginWithRedirect}>Log in</button>
          </li>
        )}
        {isAuthenticated && (
          
          <li>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log out
            </button>
            
          </li>
        
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
