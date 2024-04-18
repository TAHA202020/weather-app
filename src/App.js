import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import "./style.css"
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import InfoCard from "./InfoCard";
function App() {
  const mapref=useRef()
  const [showSuggestions,setShowSuggestions]=useState(false)
  const [Suggestions,setSuggestions]=useState([])
  const [controller,setController] =useState(null)
  const [showCard,setShowCard]= useState(false)
  const [center,setCenter]=useState([51.505, -0.09])
  const getWeather=(cords)=>
  {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${cords[0]},${cords[1]}`)
    .then(response=>response.json())
    .then(data=>
      {
        setShowCard(data)
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
    mapref.current.setView(cords)
    setCenter(cords)
    getWeather(cords)
  }
  
  return (<div style={{width:"100vw",height:"100vh",overflow:"hidden"}}>
    <div className="input-container">
      <div className="input">
        <input placeholder="Enter city" onFocus={()=>{setShowSuggestions(true)}} onBlur={()=>{setShowSuggestions(false)}} onChange={(e)=>getSuggestions(e)}/>
        {(showSuggestions && Suggestions.map((value)=><div key={value.id} className="suggestions" onMouseDown={()=>{
          setShowCard(false)
          CenterandGetWeather([value.lat,value.lon])
        }}>{value.display_name}</div>)
        )}
      </div>
    </div>
    <MapContainer center={center} zoom={13} style={{height:"100%",width:"100%",zIndex:"0"}} maxZoom={15} minZoom={12}>
      <ChangeView ref={mapref} setCenter={getWeather} HideInfoCard={setShowCard}/>
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
    </MapContainer>
    {showCard && <InfoCard data={showCard}/>}
    </div>
  );
}
const ChangeView=forwardRef(({ setCenter ,HideInfoCard},ref)=> {
  const map = useMap();
  useImperativeHandle(ref, () => ({
    setView:(coords, zoom) => {
      map.setView(coords, zoom);
    }
  }));
  const events=useMapEvents({moveend:()=>{
    setCenter([map.getCenter().lat,map.getCenter().lng])
  },dragstart:()=>HideInfoCard(false)})
  return null;
})

export default App;
