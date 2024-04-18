import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import "./style.css"
import { useState } from "react";
function App() {
  const [showSuggestions,setShowSuggestions]=useState(false)
  const [Suggestions,setSuggestions]=useState([])
  const [center , setCenter]=useState([51.505, -0.09])
  const [controller,setController] =useState(null)
  const getWeather=(cords)=>
  {
    fetch(`https://api.weatherapi.com/v1/current.json?key=11f36e9c37d0482b811164438241704&q=${cords[0]},${cords[1]}`)
    .then(response=>response.json())
    .then(data=>
      {
        console.log(data)
      })
  }
  const getSuggestions=(e)=>
  {
    if (controller) {
      controller.abort();
  }
  let newController = new AbortController();
  setController(newController)
    fetch(`https://nominatim.openstreetmap.org/search?q=${e.target.value}&format=json&limit=4`,{signal:newController.signal})
    .then(res=> res.json())
    .then(data=>{setSuggestions(data)})
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error fetching suggestions:', error);
      }
    });
  }
  const CenterandGetWeather=(cords)=>
  {
    setCenter(cords)
    getWeather(cords)
  }
  
  return (<div style={{width:"100vw",height:"100vh",overflow:"hidden"}}>
    <div className="input-container">
      <div className="input">
        <input placeholder="Enter city" onFocus={()=>{setShowSuggestions(true)}} onBlur={()=>{setShowSuggestions(false)}} onChange={(e)=>getSuggestions(e)}/>
        {(showSuggestions && Suggestions.map((value)=><div key={value.id} className="suggestions" onMouseDown={()=>{
          CenterandGetWeather([value.lat,value.lon])
        }}>{value.display_name}</div>)
        )}
      </div>
    </div>
    <MapContainer center={[51.505, -0.09]} style={{height:"100%",width:"100%",zIndex:"0"}} maxZoom={15} minZoom={12}>
      <ChangeView center={center} setCenter={CenterandGetWeather}/>
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
    </MapContainer>
    </div>
  );
}
function ChangeView({ center , setCenter }) {
  const map = useMap();
  const events=useMapEvents({dragend:(e)=>{
    setCenter([map.getCenter().lat,map.getCenter().lng],map.getZoom())
  }})
  map.setView(center,13);
  return null;
}

export default App;
