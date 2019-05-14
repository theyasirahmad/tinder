import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "../../../node_modules/react-google-maps"
import React, {
    Component
} from 'react';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap onClick={() => { props.setnullLocation() }}
        defaultZoom={12.5}
        center={
            (!props.selectedLocation && { lat: props.coords.latitude, lng: props.coords.longitude })
            || (!props.searchFlag && ({ lat: props.selectedLocation.venue.location.lat, lng: props.selectedLocation.venue.location.lng }))
            || ({ lat: props.selectedLocation.location.lat, lng: props.selectedLocation.location.lng })
        }>
        {props.isMarkerShown
            &&
            props.venues.map((item, index) => {
                var indexx = index + 1
                var text = "P" + indexx;
                return (
                    <div>
                        <Marker
                            key={indexx}
                            title={(!props.searchFlag && item.venue.name) || item.name}
                            position={
                                (!props.searchFlag && { lat: item.venue.location.lat, lng: item.venue.location.lng })
                                || { lat: item.location.lat, lng: item.location.lng }}
                            label={text}
                            onClick={() => { props.selectedLocationFunc(item) }}
                        />
                    </div>
                )
            })
        }
        <Marker
            position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}

        />
    </GoogleMap>
))

class NearByMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            coords: null,
            selectedLocation: false,
        };

        this.updateCoords = this.updateCoords.bind(this);
    }

    componentDidMount() {
        this.setPosition();
    }

    setPosition() {
        // const { coords } = this.state;
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({ coords: position.coords })
            // var coor = position.coords;
            // this.props.updateCoords(coor)
        });


    }
    selectedLocationFunc = (item) => {
        const { selectedLocation } = this.state;
        if (selectedLocation === item) {
            this.setState({
                selectedLocation: false
            })
        }
        else {
            this.setState({
                selectedLocation: item
            })
        }
    }

    setnullLocation = () => {
        this.setState({
            selectedLocation: false
        })
    }

    updateCoords({ latitude, longitude }) {
        // const { coords } = this.state;
        this.setState({ coords: { latitude, longitude } })
        // var coor = { latitude, longitude };
        // this.props.updateCoords(coor)
    }

    render() {
        const { coords, selectedLocation } = this.state;

        const searchFlag = this.props.searchFlag;
        const venues = this.props.venues;
        return (
            <div>

                {/* {console.log(venues[1].venue.location.lat)} */}
                {coords && <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `70vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    coords={coords}
                    updateCoords={this.updateCoords}
                    venues={venues}
                    selectedLocation={selectedLocation}
                    selectedLocationFunc={this.selectedLocationFunc}
                    setnullLocation={this.setnullLocation}
                    searchFlag={searchFlag}
                />}
                <div style={{ height: `17vh` }} onClick={this.setnullLocation}>
                    {!selectedLocation &&
                        <div>
                            {<ul>{(!searchFlag && "Default Nearst Places") || "Searched Places"}{venues.map((item, index) => {
                                return (<li>{"P" + index + " : "}{(!searchFlag && item.venue.name) || item.name}</li>)
                            })}
                            </ul>}
                        </div>
                    }
                    {selectedLocation && <h4 style={{ marginLeft: "10px" }} >Selected Place : {(!searchFlag && selectedLocation.venue.name) || selectedLocation.name}</h4>}
                    {selectedLocation && <button style={{ marginLeft: "50px" }}
                        onClick={(e) => { e.stopPropagation(); this.props.selectedPlaceFunc(selectedLocation,searchFlag) }}

                        className="btn btn-danger">Next</button>}

                </div>
            </div>
        )
    }
}

export default NearByMap;