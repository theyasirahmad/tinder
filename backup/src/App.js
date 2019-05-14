import React, {
  Component
} from 'react';
import './App.css';
import firebase from './Config/firebase';
import Login from './Screens/Login/Login';
import Maps from './Screens/Maps/Maps';
import Profile from './Screens/Profile/Profile';
import Dashboard from './Screens/Dashboard/Dashboard';
import Meeting from './Screens/Meeting/Meeting.js';

// import store from './Redux/store'
// import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { updateUser, removeUser } from './Redux/actions/authActions'


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
          this.props.updateUser(doc.data())

          }
        })
      })
  }
  nullFunction() {
  }
  componentDidMount() {
    const { currentuser } = this.state;
    if (!currentuser) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.userSet(user)
          this.checkDatabase(user)
        }
      })
    }
  }
componentWillReceiveProps(nextprops){
  console.log(nextprops)
}

  render() {
    const { currentuser, dataSaved, users } = this.state;
    // if (!currentuser) {
    //   firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //       this.userSet(user)
    //       this.checkDatabase(user)
    //     }
    //   })
    // }
    return (
        <div>
          {/* {!currentuser && <Login />} */}
          {/* {currentuser && <Maps updateCoords={this.nullFunction} />} */}
          {!dataSaved && currentuser && <Profile currentuser={currentuser} saveDataStatus={this.saveDataStatus} />}
          {!users && dataSaved && <Dashboard updateUsers={this.updateUsers} userinfo={dataSaved} />}
          {users && <Meeting currentuser={dataSaved} users={users} />}

        </div>
    );
  }
}

// export default App;


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


export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default Dashboard;