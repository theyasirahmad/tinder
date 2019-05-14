import React, { Component } from "react";
import "./MeetingPlace.css";
import axios from "axios";
import NearByMap from "../Maps/NearByMap";
import firebase from "./../../Config/firebase";
import swal from 'sweetalert';
import Datetime from "../Datetime/Datetime";

class MeetingPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: false,
      searchFlag: false,
      placetoSearch: null,
      selectedPlace: null,
      searchedplacetoggle: false,
      date: null,
      time: null
    };
  }

  searchNearByLocation = () => {
    const { placetoSearch } = this.state;
    const geolocation = this.props.currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const coords = latitude + "," + longitude;

    const endPoint = "https://api.foursquare.com/v2/venues/search?";
    const params = {
      client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
      client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
      query: placetoSearch,
      ll: coords,
      v: "20182507"
    };

    axios.get(endPoint + new URLSearchParams(params)).then(response =>
      this.setState({
        venues: response.data.response.venues,
        searchFlag: true
      })
    );
  };
  nearByLocation = () => {
    const geolocation = this.props.currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const coords = latitude + "," + longitude;

    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const params = {
      client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
      client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
      query: "drinks",
      ll: coords,
      v: "20182507",
      limit: 3
    };

    axios.get(endPoint + new URLSearchParams(params)).then(response =>
      this.setState({
        venues: response.data.response.groups[0].items
      })
    );
  };
  updateCoords = () => {
    console.log("updateCoords");
  };

  componentDidMount = () => {
    this.nearByLocation();

    const node = document.getElementById("searchfield");
    node.addEventListener("keyup", event => {
      if (event.key === "Enter") {
        this.searchNearByLocation();
        // console.log(this)
      }
    });
  };
  selectedPlaceFunc = (e, searchedplace) => {
    this.setState({
      selectedPlace: e,
      searchedplacetoggle: searchedplace
    });
  };
  datetime = (a, b) => {
    const currentuser = this.props.currentuser;
    const selectedUser = this.props.selectedUser;
    const { selectedPlace, searchedplacetoggle } = this.state;

    var duration;

    if ((currentuser.duration1 && selectedPlace.duration1) || currentuser.duration1) {
      duration = "20min"
    }
    else if ((currentuser.duration2 && selectedPlace.duration2) || currentuser.duration2) {
      duration = "60min"
    }
    else if ((currentuser.duration3 && selectedPlace.duration3) || currentuser.duration3) {
      duration = "120min"
    }

    this.setState({
      date: a,
      time: b
    });

    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    db.collection("meetings").add({})
      .then(function (res) {
        console.log(res.id);
        db.collection('meetings')
          .doc(res.id)
          .set({
            reciever: selectedUser.uid,
            recievername: selectedUser.name,
            recieveravatar: selectedUser.imagesUrl[0],
            sender: currentuser.uid,
            sendername: currentuser.name,
            senderavatar: currentuser.imagesUrl[0],
            date: a,
            time: b,
            selectedPlace: selectedPlace,
            searchedplacetoggle: searchedplacetoggle,
            status: "pending",
            id: res.id,
            duration:duration,
          })
          .then(() => {
            swal("Notification sent ");

          });
      })

  };

  mapRender = venues => {
    // const selectedUser = this.props.selectedUser;

    const { searchFlag } = this.state;
    const currentuser = this.props.currentuser;
    const geolocation = currentuser.location;
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const coords = [{ latitude: latitude, longitude: longitude }];

    return (
      <NearByMap
        isMarkerShown={true}
        coords={coords}
        updateCoords={this.updateCoords}
        venues={venues}
        selectedPlaceFunc={this.selectedPlaceFunc}
        searchFlag={searchFlag}
      />
    );
  };
  setPlacetoSearch(e) {
    this.setState({
      placetoSearch: e.target.value
    });
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
          <div
            className="inner-addon right-addon"
            style={(!selectedPlace && venues) || { visibility: "hidden" }}
          >
            <i className="glyphicon glyphicon-search" />
            <input
              id={"searchfield"}
              onChange={e => {
                this.setPlacetoSearch(e);
              }}
              type="text"
              className="form-control"
              placeholder="Place to Search"
            />
          </div>
        }
        {!selectedPlace && venues && this.mapRender(venues)}
        {selectedPlace && <Datetime datetime={this.datetime} />}
      </div>
    );
  }
}

export default MeetingPlace;
