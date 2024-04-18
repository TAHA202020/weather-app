export default function InoCard(props)
{
    console.log(props)
    return(<div className="info-card">
        Humidity {props.data.current.humidity}
    </div>)
}