import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";

function Profile() {
  const [tableData, setTableData] = useState([]);
  
  const { isAuthenticated, user } = useAuth0();
  const userId = user?.sub;


  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    fetchToken();
  }, [getAccessTokenSilently]);
  
  useEffect(() => {
    if (!token) return; // Return early if the token is null
    axios.get(`https://api-g.lgbusiness.net/production/api/v1/events/purchase`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Replace with your actual bearer token
      },
      params: {
        'user_id': userId
      }
    })
      .then(response => setTableData(response.data.instances));
  }, [token]);
  
  function downloadTicket(item) {
    const pdf = new jsPDF();
    // Agrega el contenido del ticket al PDF
    pdf.text('PDF de compra', 10, 10)
    pdf.text(`ID Compra: ${item._id}`, 10, 20);
    pdf.text(`Event ID: ${item.eventId}`, 10, 30);
    pdf.text(`Cantidad: ${item.quantity}`, 10, 40);
    pdf.text(`Status: ${item.status}`, 10, 50);

    pdf.save(`ticket_${item._id}.pdf`);
  }
  


  return (
    <div>
        
      {isAuthenticated && (
        <>
        <h1>Bienvenido, {user.name}!!</h1>
        <p>id usuario {userId} </p>
        <h2>Mis compras</h2>
        <table>
            <thead>
              <tr>
                <th>ID Compra</th>
                <th>Event ID</th>
                <th>Cantidad</th>
                <th>Status</th>
                <th>Descargar ticket</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 && tableData.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.eventId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.status}</td>
                  <td><button onClick={() => downloadTicket(item)}>Descargar</button></td>
                </tr>
              ))}
            </tbody>
        </table>
        </>
      )} 

      {!isAuthenticated && (
        <h1>Por favor ingresa para ver tus compras</h1>
      )}
      
    </div>
  );

              }
export default Profile;