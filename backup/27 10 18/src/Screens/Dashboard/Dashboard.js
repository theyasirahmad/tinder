import React, {
    Component
} from 'react';
import './Dashboard.css';
import firebase from '../../Config/firebase';


// const provider = new firebase.auth.FacebookAuthProvider();

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: null
        }

    }
    // calcCrow(lata, lona, lat2, lon2) {

    //     var R = 6371; // km
    //     var dLat = this.toRad(lat2 - lata);
    //     var dLon = this.toRad(lon2 - lona);
    //     var lat1 = this.toRad(lata);
    //     var lat2 = this.toRad(lat2);

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

    render() {

        return (

            <div className="container">
                <h1 style={{ textAlign: "center" }}>You haven’t done any meeting yet!”, try creating a new meeting! </h1>
                <br /><br />
                <button onClick={this.requestForMeeting} className="btn btn-warning">Set A Meeting</button>
            </div>
        );
    }
}

export default Dashboard;