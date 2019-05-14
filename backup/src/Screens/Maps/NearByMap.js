/* eslint-disable no-undef */
/* global google */

import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "../../../node_modules/react-google-maps"
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
        {!props.directions
            &&
            props.isMarkerShown
            &&
            props.venues.map((item, index) => {
                var indexx = index + 1
                var text = "P" + indexx;
                return (
                    <div key={index}>
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

        {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
))

class NearByMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            coords: null,
            selectedLocation: false,
            directions: null,
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
        this.setDirectionstoNull()
    }

    updateCoords({ latitude, longitude }) {
        // const { coords } = this.state;
        this.setState({ coords: { latitude, longitude } })
        // var coor = { latitude, longitude };
        // this.props.updateCoords(coor)
    }
    setDirectionstoNull = () => {
        this.setState({
            directions: null
        })
    }
    getDirections = () => {

        const searchFlag = this.props.searchFlag;
        const { coords, selectedLocation, directions } = this.state;
        if (!directions) {
            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route({

                // (!props.searchFlag && ({ lat: props.selectedLocation.venue.location.lat, lng: props.selectedLocation.venue.location.lng }))
                // || ({ lat: props.selectedLocation.location.lat, lng: props.selectedLocation.location.lng })

                origin: new google.maps.LatLng(coords.latitude, coords.longitude),
                destination: new google.maps.LatLng((!this.props.searchFlag && selectedLocation.venue.location.lat) || selectedLocation.location.lat, (!this.props.searchFlag && selectedLocation.venue.location.lng) || selectedLocation.location.lng),

                // origin: new google.maps.LatLng(24.8812296, 67.0727269),
                // destination: new google.maps.LatLng(24.8861479, 67.0595196),
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                    });
                } else {
                    alert("Sorry! Can't calculate directions!")
                }
            });
        }
        else {
            this.setnullLocation();
        }
    }


    render() {
        const { coords, selectedLocation, directions } = this.state;

        const searchFlag = this.props.searchFlag;
        const venues = this.props.venues;
        return (
            <div>

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
                    directions={directions}
                />}
                <div style={{ height: `17vh` }} onClick={this.setnullLocation}>
                    {

                        !selectedLocation &&

                            <div>
                                {<ul>{(!searchFlag && "Default Nearst Places") || "Searched Places"}{venues.map((item, index) => {
                                    return (<li>{"P" + index + " : "}{(!searchFlag && item.venue.name) || item.name}</li>)
                                })}
                                </ul>


                                }
                            </div>
                    }
                    {(selectedLocation && <h4 style={{ marginLeft: "10px" }} >Selected Place : {(!searchFlag && selectedLocation.venue.name) || selectedLocation.name}</h4>)
                    // || popupLocation && <h4 style={{ marginLeft: "10px" }} >Selected Place : {venues}</h4>     
                }

                    {selectedLocation
                        &&
                        <div>
                            <button style={{ marginLeft: "50px" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.selectedPlaceFunc(selectedLocation, searchFlag)
                                }}
                                className="btn btn-danger">Next
                            </button>
                            <button style={{ marginLeft: "50px" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.getDirections()
                                }}
                                className="btn btn-danger">
                                {!directions && "get directions"}
                                {directions && "back"}
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default NearByMap;