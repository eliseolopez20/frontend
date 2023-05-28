import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import Home from './home';
import Events from './events';
import Loading from './loading';
import Navbar from './navbar';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './profile';
import Map from './map';

function App() {
  const { isLoading, error, user } = useAuth0();
  

  return (
    <>
      {error && <p>Authentication Error</p>}
      {!error && isLoading && <p>loading</p>}
      {!error && !isLoading && (
        <>
          <LoginButton />
          <LogoutButton />
        </>
      )}
      
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
        </Routes>
        
      </Router>
    </>
  );
}

export default App;
