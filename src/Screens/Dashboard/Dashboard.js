import React, {
    Component
} from 'react';
import './Dashboard.css';
import firebase from '../../Config/firebase';


const provider = new firebase.auth.FacebookAuthProvider();

class Dashboard extends Component {
    constructor(props){
        super(props)
        
    }



    render() {
        return (
            <div>
            <h1>You haven’t done any meeting yet!”, try creating a new meeting! </h1>
            </div>
        );
    }
}

export default Dashboard;