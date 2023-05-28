function App() {
  const { getAccessTokenSilently } = useAuth0();

  async function findtoken() {
    const token = await getAccessTokenSilently();
    
  }

  useEffect(() => {
    axios.get('https://api.lgbusiness.net/api/v1/events/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
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
  }, []);
}