import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const { isAuthenticated, user } = useAuth0();
  const userId = user?.sub;

  const [markers, setMarkers] = useState([]);

  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await getAccessTokenSilently();
      console.log(token)
      setToken(token);
    }
    fetchToken();
  }, [getAccessTokenSilently]);
  
  useEffect(() => {
    if (!token) return;
  
    axios.get('https://api-g.lgbusiness.net/production/api/v1/events', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}` 
      }
    })
    .then(response => {
      setData(response.data.instances);
      setMarkers(response.data.instances.map(instance => ({
        lat: instance.latitude,
        lng: instance.longitude,
        name: instance.name
      })));
    });
  }, [token]);
  

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = data.slice(startIndex, endIndex);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  function handleQuantityChange(event, instance) {
    const quantity = parseInt(event.target.value);
    buyInstance(instance, quantity);
  }

  function buyInstance(instance, q) {
    
    fetch('https://api-g.lgbusiness.net/production/api/v1/events/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "groupId": 9,
        "eventId": instance._id,
        "userId": userId,
        "depositToken": "asdn12390acsd324",
        "quantity": q,
        "seller": 0
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Quantity</th>
            <th>Compra Aqui</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map(instance => (
            <tr key={instance._id}>
              <td>{instance._id}</td>
              <td>{instance.createdAt}</td>
              <td>{instance.updatedAt}</td>
              <td>{instance.name}</td>
              <td>{instance.date}</td>
              <td>{instance.price}</td>
              <td>{instance.quantity}</td>
              <td>{instance.location}</td>
              <td>{instance.latitude}</td>
              <td>{instance.longitude}</td>
              <td>
                <select onChange={(event) => handleQuantityChange(event, instance)}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </td>
              <td>
                {instance.quantity > 0 && (
                  <a href="#" onClick={() => buyInstance(instance)}>
                    Compra ahora
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      


      <div>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </div>

      
    </>
  );
}

export default App;


