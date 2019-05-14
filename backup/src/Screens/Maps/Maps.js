import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "../../../node_modules/react-google-maps"
import React, {
    Component
} from 'react';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={18}
        center={{ lat: props.coords.latitude, lng: props.coords.longitude }}
    >
        {props.isMarkerShown &&
            <Marker  
                position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
                draggable={true}
                onDragEnd={position => {
                    props.updateCoords({ latitude: position.latLng.lat(), longitude: position.latLng.lng() })
                }}
            />}
    </GoogleMap>
))

class Maps extends Component {
    constructor() {
        super()

        this.state = {
            coords: null
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
            var coor = position.coords;
            this.props.updateCoords(coor)
        });


    }

    updateCoords({ latitude, longitude }) {
        // const { coords } = this.state;
        this.setState({ coords: { latitude, longitude } })
        var coor = {latitude, longitude};
        this.props.updateCoords(coor)
    }

    render() {
        const { coords } = this.state;

        console.log(coords);
        return (
            <div>
                {coords && <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `80vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    coords={coords}
                    updateCoords={this.updateCoords}
                />}
            </div>
        )
    }
}

export default Maps;