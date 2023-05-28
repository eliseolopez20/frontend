import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useAuth0 } from "@auth0/auth0-react";

function Map() {

  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);

  
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  
  const icon = new Icon({
    iconUrl: require("./img/marker.png"),
    iconSize: [25, 25]
  });

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

return (
  <>
  <MapContainer center={[-33.455275555427804	, -70.6605295633026]} zoom={10} style={{ height: '100vh', width: '100%'}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
       attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'/>
      {markers.map(marker => (
        <Marker key={marker.name} position={[marker.lat, marker.lng]} icon={icon}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  </>
)



}

export default Map;

