import React, {
  Component
} from 'react';
import './App.css';
import firebase from './Config/firebase';
import Login from './Screens/Login/Login';
import Maps from './Screens/Maps/Maps';
import Profile from './Screens/Profile/Profile';
import Dashboard from './Screens/Dashboard/Dashboard';


const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentuser: "",
      dataSaved: false,

    }
    this.userSet = this.userSet.bind(this);
  }

  saveDataStatus = () => {
    this.setState({
      dataSaved: true
    })
  }
  userSet(e) {
    this.setState({
      currentuser: e
    })


  }

  checkDatabase = (user) => {

    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true })


    db.collection('users').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id == user.uid) {
            this.setState({dataSaved:true})
          }
          else{
            
          }
        })
      })
  }



  render() {
    const { currentuser, dataSaved } = this.state;
    if (!currentuser) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.userSet(user)
          this.checkDatabase(user)
        }
      })
    }
    return (
      <div>
        {!currentuser && <Login />}
        {/* {currentuser && <Maps />} */}
        {!dataSaved && currentuser && <Profile currentuser={currentuser} saveDataStatus={this.saveDataStatus} />}
        {dataSaved && <Dashboard />}
      </div>
    );
  }
}

export default App;