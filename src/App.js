import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import "./style.css"
import { useState } from "react";
function App() {
  const [showSuggestions,setShowSuggestions]=useState(false)
  const [Suggestions,setSuggestions]=useState([])
  const [center , setCenter]=useState([51.505, -0.09])
  const [controller,setController] =useState(null)
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

  
  return (<div style={{width:"100vw",height:"100vh",overflow:"hidden"}}>
    <div className="input-container">
      <div className="input">
        <input placeholder="Enter city" onFocus={()=>{setShowSuggestions(true)}} onBlur={()=>{setShowSuggestions(false)}} onChange={(e)=>getSuggestions(e)}/>
        {(showSuggestions && Suggestions.map((value)=><div className="suggestions" onMouseDown={()=>{setCenter([value.lat,value.lon])}}>{value.display_name}</div>)
        )}
      </div>
    </div>
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{height:"100%",width:"100%",zIndex:"0"}} >
      <ChangeView center={center}/>
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
    </MapContainer>
    </div>
  );
}
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center,13);
  return null;
}

export default App;
