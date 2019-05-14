import React, { Component } from 'react';
import './MeetingPlace.css';
import axios from 'axios';
import NearByMap from '../Maps/NearByMap';

class MeetingPlace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      venues: false,
      selectedPlace: false,
      searchFlag: false,
      placetoSearch: null,
    }
  }

  searchNearByLocation = () => {
    const { placetoSearch } = this.state;
    const geolocation = this.props.currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const coords = latitude + ',' + longitude;

    const endPoint = "https://api.foursquare.com/v2/venues/search?";
    const params = {
      client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
      client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
      query: placetoSearch,
      ll: coords,
      v: "20182507",
    }

    axios.get(endPoint + new URLSearchParams(params))
      .then((response) =>
        // console.log(response.data.response.venues)

        // response.data.response.venues.map((item)=>{
        //   console.log(item);
        // })
        this.setState({
          venues: response.data.response.venues,
          searchFlag: true
        })
      );
  }
  nearByLocation = () => {
    const geolocation = this.props.currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;


    const coords = latitude + ',' + longitude;

    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const params = {
      client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
      client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
      query: "drinks",
      ll: coords,
      v: "20182507",
      limit: 3,
      selectedPlace: false,
      searchedplacetoggle:false,
    }

    axios.get(endPoint + new URLSearchParams(params))
      .then((response) =>

        this.setState({
          venues: response.data.response.groups[0].items
        })
      );
  }
  updateCoords = () => {

    console.log("updateCoords");
  }

  componentDidMount = () => {
    this.nearByLocation();

    const node = document.getElementById("searchfield")
    node.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.searchNearByLocation();
        // console.log(this)
      }
    });


  }
  selectedPlaceFunc = (e,searchedplace) => {
    this.setState({
      selectedPlace: e,
      searchedplacetoggle:searchedplace
    })
  }

  mapRender = (venues) => {


    // const selectedUser = this.props.selectedUser;

    const { searchFlag } = this.state;
    const currentuser = this.props.currentuser;
    const geolocation = currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const coords = [{ latitude: latitude, longitude: longitude }]

    return (
      <NearByMap isMarkerShown={true}
        coords={coords}
        updateCoords={this.updateCoords}
        venues={venues}
        selectedPlaceFunc={this.selectedPlaceFunc}
        searchFlag={searchFlag}
      />
    )
  }
  setPlacetoSearch(e) {
    this.setState({
      placetoSearch: e.target.value,
    })
  }

  render() {
    const { venues, selectedPlace } = this.state;


    // const selectedUser = this.props.selectedUser;

    // const currentuser = this.props.currentuser;
    // const geolocation = currentuser.location;
    // const latitude= geolocation.latitude;
    // const longitude=geolocation.longitude;

    // const coords = [{latitude:latitude,longitude:longitude}]

    // console.log(selectedUser);
    // console.log(venues);



    return (
      <div>
        {!venues && <h1>loading...</h1>}
        {/* {!selectedPlace && venues &&
          <div style={{ marginBottom: "0px" }} className="" >
            <div style={{ marginBottom: "0px" }} className="">
              <input style={{ maxWidth: "300px" }} onChange={(e) => { this.setPlacetoSearch(e) }} type="text" placeholder="Place to Search" class="form-control" />
            </div>
            <button style={{}} onClick={() => { this.searchNearByLocation() }} className="btn btn-default">Search Places</button>
          </div>

        } */}
        {
          // !selectedPlace && venues &&  == true == show
          <div className="inner-addon right-addon" style={(!selectedPlace && venues) || { visibility: "hidden" }}>
            <i className="glyphicon glyphicon-search" ></i>
            <input id={"searchfield"} onChange={(e) => { this.setPlacetoSearch(e) }} type="text" className="form-control" placeholder="Place to Search" />
          </div>
        }
        {!selectedPlace && venues && this.mapRender(venues)}
        {
          selectedPlace && 
          
          <h2>ajao</h2>
        }
      </div >
    );
  }
}

export default MeetingPlace;