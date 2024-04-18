import wind from "./images/wind.png";
import humidity from "./images/humidite.png";
import uv from "./images/uv.png";
export default function InoCard(props)
{
    console.log(props)
    return(<div className="info-card">
        <div className="icon-temp">
            <div className="icon-text">
                <img src={props.data.current.condition.icon}/>
                <h3>{props.data.current.condition.text}</h3>
            </div>
            <h1>
                {props.data.current.temp_c}°C
            </h1>
        </div>
        <div className="other-info">
            <div className="info noleft-border">
                <img src={wind} className="icons"/>
                <h3>{props.data.current.wind_kph}km/h</h3>
            </div>
            <div className="info">
                <img src={humidity} className="icons"/>
                <h3>{props.data.current.humidity}%</h3>
            </div>
            <div className="info">
                <img src={uv} className="icons"/>
                <h3>{props.data.current.uv}</h3>
            </div>
        </div>
    </div>)
}