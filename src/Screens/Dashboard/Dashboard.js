
/* eslint-disable no-undef */
// /* global google */

// import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "../../../node_modules/react-google-maps"
import React, {
    Component
} from 'react';
import './Dashboard.css';
import firebase from '../../Config/firebase';
import PopupMap from "../Maps/PopupMap";
import AddToCalendar from 'react-add-to-calendar';
import swal from '@sweetalert/with-react'

import { updateUser, removeUser } from '../../Redux/actions/authActions'
import { connect } from 'react-redux'

// import swal from 'sweetalert';
// import { swal } from '@sweetalert/with-react';


// const provider = new firebase.auth.FacebookAuthProvider();

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: null,
            meetings: null,
            requestedMeetings: null,
            requestedMeetingsResponded: null,
            counter: 0,
            selectedPlace: null,
            directions: null,
            readyToGo:null,
        }

    }

    calcCrow(lata, lona, latb, lon2) {

        var R = 6371; // km
        var dLat = this.toRad(latb - lata);
        var dLon = this.toRad(lon2 - lona);
        var lat1 = this.toRad(lata);
        var lat2 = this.toRad(latb);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        // return d;

        var status = (Math.floor(d) <= 5) ? true : false
        return status
    }

    // Converts numeric degrees to radians
    toRad(Value) {
        return Value * Math.PI / 180;
    }


    requestForMeeting = () => {

        var users = [];
        const db = firebase.firestore();
        db.settings({ timestampsInSnapshots: true })

        const userinfo = this.props.userinfo;
        // console.log(userinfo.location.latitude + " + " + userinfo.location.longitude);

        db.collection('users').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {

                    if (
                        this.calcCrow(userinfo.location.latitude, userinfo.location.longitude, doc.data().location.latitude, doc.data().location.longitude)
                        &&
                        ((userinfo.duration1 && doc.data().duration1) || (userinfo.duration2 && doc.data().duration2) || (userinfo.duration3 && doc.data().duration3)) && ((userinfo.coffee && doc.data().coffee) || (userinfo.cocktail && doc.data().cocktail) || (userinfo.juice && doc.data().juice))
                    ) {
                        users.push(doc.data())
                    }


                })
            })
            .then(() => {
                this.props.updateUsers(users)
            })


        // if (((userinfo.duration1 && doc.data().duration1) || (userinfo.duration2 && doc.data().duration2) || (userinfo.duration3 && doc.data().duration3)) && ((userinfo.coffee && doc.data().coffee) || (userinfo.cocktail && doc.data().cocktail) || (userinfo.juice && doc.data().juice))) {
        //     this.setState({ dataSaved: doc.data() })
        // }

    }

    initialFunc = () => {
        const userinfo = this.props.userinfo;

        var meetings = [];
        const db = firebase.firestore();
        db.settings({ timestampsInSnapshots: true })

        console.log(userinfo);

        db.collection('meetings')
            .where('sender', "==", `${userinfo.uid}`)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    meetings.push(doc.data())
                })
            })
            .then(() => {
                if (meetings.length != 0) {
                    this.setState({
                        meetings: meetings
                    })
                    console.log(meetings)
                }
            })

        var requestedMeetings = [];
        var requestedMeetingsResponded = []

        db.collection('meetings')
            .where('reciever', "==", `${userinfo.uid}`)
            // .where("status", "==", "pending")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().status === "pending") {

                        requestedMeetings.push(doc.data())
                    }
                    else {

                        requestedMeetingsResponded.push(doc.data())
                    }
                })
            })
            .then(() => {
                if (requestedMeetings.length != 0 && requestedMeetingsResponded.length != 0) {

                    this.setState({
                        requestedMeetings: requestedMeetings,
                        requestedMeetingsResponded: requestedMeetingsResponded
                    })
                }
                else if (requestedMeetings.length != 0) {

                    this.setState({
                        requestedMeetings: requestedMeetings,
                    })
                }
                else if (requestedMeetingsResponded.length != 0) {

                    this.setState({
                        meetings: Object.assign([], this.state.meetings, requestedMeetingsResponded)
                        // ...requestedMeetingsResponded,
                    })
                }
            })
    }
    componentDidMount() {
        this.initialFunc()
        setTimeout(() => {
            this.setState({readyToGo:true})
        }, 1000);
    }
    locationMapRender = (item) => {
        this.setState({ selectedPlace: item })
    }
    setNullPlace = () => {
        // this.setState({ selectedPlace: null })
        console.log("DASHBORD")
        this.setState({
            selectedPlace: null
        })
    }
    // componentWillUnmount() {
    //     alert("jarahe ho?")
    // }

    editProfile() {
        this.props.setdataSavedToNull()
    }
    requestedMeetingsRender() {

        const { requestedMeetings, counter, selectedPlace } = this.state;

        if (counter !== requestedMeetings.length) {
            // console.log(counter === requestedMeetings.length)
            // console.log("counter" +counter )
            // console.log("requestedMeetings.length" +requestedMeetings.length )

            const userinfo = this.props.userinfo;


            const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true })





            // console.log(requestedMeetings)
            // requestedMeetings.map((item, index) => {
            // swal
            return (
                <div  >
                    {<div style={selectedPlace && { display: "none" }} className={"meetingstatusdiv "} >
                        <div className={"meetingpopupdiv"}>

                            <img className={"meetingpopup"} src={requestedMeetings[counter].senderavatar} alt="userprofile" />
                            <img className={"meetingpopup"} src={requestedMeetings[counter].recieveravatar} alt="userprofile" />
                        </div>
                        <hr />
                        <h1>Name: {requestedMeetings[counter].sendername}</h1>
                        <h2>Status : {requestedMeetings[counter].status}</h2>
                        <h2>Meeting date : {requestedMeetings[counter].date}</h2>
                        <h2>Meeting time : {requestedMeetings[counter].time}</h2>
                        <h2>Meeting location : {requestedMeetings[counter].selectedPlace.venue.name}</h2>
                        <h2>Meeting Duration : {requestedMeetings[counter].duration}</h2>
                        <button className={"btn btn-default"} onClick={() => {
                            this.locationMapRender(requestedMeetings[counter].selectedPlace)
                        }}
                        >Location</button>
                    </div>

                    }
                    <div>
                        {
                            selectedPlace &&
                            <PopupMap setNullPlace={this.setNullPlace} searchFlag={requestedMeetings[counter].searchFlag} selectedLocation={requestedMeetings[counter].selectedPlace} coords={userinfo.location} />

                        }
                    </div>
                    <div style={{ width: "100%", textAlign: "center", margin: "5vh 0px" }}>
                        {
                            <div>

                                <button className={"btn btn-default"} onClick={() => {
                                    db.collection('meetings').doc(requestedMeetings[counter].id)
                                        .update({
                                            status: "Cancelled",
                                        }).then(() => {
                                            this.setState({ counter: counter + 1 })
                                        })
                                }} >

                                    Cancel Meeting
                        </button>

                                <button className={"btn btn-warning"} onClick={() => {
                                    db.collection('meetings').doc(requestedMeetings[counter].id)
                                        .update({
                                            status: "Accepted",
                                        }).then(() => {
                                            this.setState({ counter: counter + 1 })
                                        })
                                }} >
                                    Accept
                        </button>
                            </div>
                        }
                    </div>
                </div>
                // , {
                //     buttons: ["cancel", "accept"],
                // }).then((value) => {
                //     // swal(`The returned value is: ${value}`);
                //     db.collection('meetings').doc(requestedMeetings[counter].id)
                //         .update({
                //             status: value ? "Accepted" : "Cancelled"
                //         }).then(() => {
                //             this.setState({ counter: counter + 1 })
                //         })

                // }
            );


            // })

        }
        else if (counter === requestedMeetings.length) {

            this.setState({
                requestedMeetings: null
            })
        }

    }


    // meetingsToNull = () => {
    //     this.setState({
    //         requestedMeetings: null
    //     })
    // }
    addtocalanderFunc(event) {
        swal(
            <AddToCalendar event={event} />
        )
    }
    meetingsStautsRender() {
        // const dateOfMeeting= "date of meeting "+ requestedMeetings[counter
        // let event = {
        //     title: `Meeting with${requestedMeetings[counter].sender}`,
        //     description: `date of meeting :${requestedMeetings[counter].date}`,
        //     location: requestedMeetings[counter].location.venue.name,
        //     // startTime: `${requestedMeetings[counter].date} ${requestedMeetings[counter].time} `,
        //     // endTime: '2016-09-16T21:45:00-04:00'
        //     <AddToCalendar event={event} />
        // };


        const { userinfo } = this.props;
        const { meetings, requestedMeetingsResponded } = this.state;
        var allmeetings;
        if (meetings) {
            allmeetings = meetings
        }
        if (requestedMeetingsResponded) {
            allmeetings = requestedMeetingsResponded
        }
        if (meetings && requestedMeetingsResponded) {
            allmeetings = meetings;
            allmeetings.push(...requestedMeetingsResponded)
        }
        console.log(allmeetings)
        console.log(userinfo.uid)
        return (
            <div className={"row"}>
                {
                    allmeetings.map((item, index) => {
                        let event = {
                            title: `Meeting with :${item.sender}`,
                            description: `date of meeting :${item.date}`,
                            location: item.selectedPlace.venue.name,
                        };

                        if (item.sender === userinfo.uid) {
                            return (
                                <div key={index} className={"col-xs-12 col-sm-6 col-md-4 col-lg-3"}>
                                    <div className={"meetingstatusdiv "} key={index}>
                                        <h1>Name: {item.recievername}</h1>
                                        <h2>Status : {item.status}</h2>
                                        <h2>Meeting date : {item.date}</h2>
                                        <h2>Meeting time : {item.time}</h2>
                                        <h2>Meeting location : {item.selectedPlace.venue.name}</h2>
                                        <button disabled={item.status !== "Accepted" && "true"} className={"btn btn-default"} onClick={() => { this.addtocalanderFunc(event) }}>
                                            Add event to calander
                                        </button>
                                        <img src={item.recieveravatar} alt="userprofile" />
                                    </div>

                                </div>


                            )
                        }
                        else {
                            return (
                                <div key={index} className={"   col-xs-12 col-sm-6 col-md-4 col-lg-3"}>
                                    <div className={"meetingstatusdiv "} key={index}>
                                        <h1>Name: {item.sendername}</h1>
                                        <h2>Status : {item.status}</h2>
                                        <h2>Meeting date : {item.date}</h2>
                                        <h2>Meeting time : {item.time}</h2>
                                        <h2>Meeting location : {item.selectedPlace.venue.name}</h2>
                                        <hr />
                                        <img src={item.senderavatar} alt="userprofile" />
                                    </div>

                                </div>


                            )
                        }
                    })
                }
            </div>
        )
    }
    render() {
        const { meetings, requestedMeetings, selectedPlace, readyToGo } = this.state;
        const currentuser = this.props.userinfo;

        return (
            <div>
                {
                    readyToGo &&

            <div>
            {
                !requestedMeetings &&
                <div>
                    {!meetings && <div className="container" >
                        <h1 style={{ textAlign: "center" }}>You haven’t done any meeting yet!”, try creating a new meeting! </h1>
                        <br /> <br />
                        <button onClick={this.requestForMeeting} className="btn btn-warning">Set A Meeting</button>
                    </div>}

                    {
                        meetings && this.meetingsStautsRender()
                    }
                    {meetings &&
                        //new meeting floating btn
                        <button onClick={() => { this.requestForMeeting() }} className={"floatingBtn"}>New Meeting</button>
                    }

                </div>
            }

            {
                (requestedMeetings
                    &&
                    this.requestedMeetingsRender()
                )
                ||
                (selectedPlace
                    // &&


                )
            }
            <button onClick={() => { this.editProfile() }} className={"floatingBtn1"}>
                edit profile
            </button>
        </div>
    
                }
                {
                    !readyToGo && <h1>Loading</h1>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authReducers.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (user) => dispatch(updateUser(user)),
        removeUser: () => dispatch(removeUser())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
// export default Dashboard;