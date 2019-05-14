import React, {
  Component
} from 'react';
import './App.css';
import firebase from './Config/firebase';
import Login from './Screens/Login/Login';
// import Maps from './Screens/Maps/Maps';
import Profile from './Screens/Profile/Profile';
import Dashboard from './Screens/Dashboard/Dashboard';
import Meeting from './Screens/Meeting/Meeting';


// const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentuser: "",
      dataSaved: false,
      users: null,

    }
    this.userSet = this.userSet.bind(this);
  }

  updateUsers = (e) => {
    this.setState({
      users: e
    })
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
          if (doc.id === user.uid) {
            this.setState({ dataSaved: doc.data() })
          }
        })
      })
  }



  render() {
    const { currentuser, dataSaved , users} = this.state;
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
        { !users && dataSaved && <Dashboard updateUsers={this.updateUsers} userinfo={dataSaved} />}
        {users &&  <Meeting  currentuser={dataSaved} users={users} /> }
      </div>
    );
  }
}

export default App;