import React, {
  Component
} from 'react';
import './App.css';
import { css } from 'react-emotion';
import firebase from './Config/firebase';
import 'firebase/auth';
import Login from './Screens/Login/Login';
// import Maps from './Screens/Maps/Maps';
import Profile from './Screens/Profile/Profile';
import Dashboard from './Screens/Dashboard/Dashboard';
import Meeting from './Screens/Meeting/Meeting.js';
import ClipLoader from 'react-spinners/ClipLoader';

// import store from './Redux/store'
// import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { updateUser, removeUser } from './Redux/actions/authActions'

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


// const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentuser: "",
      dataSaved: false,
      users: null,
      readyToGo: null,

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
    // db.settings({ timestampsInSnapshots: true })


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
  setUsersToNull = () => {
    this.setState({
      users: null
    })
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
    setTimeout(() => {
      this.setState({ readyToGo: true })
    }, 2500)
  }
  componentWillReceiveProps(nextprops) {
    console.log(nextprops)
  }

  setdataSavedToNull = () => {
    this.setState({
      dataSaved: false
    })
  }

  render() {
    const { currentuser, dataSaved, users, readyToGo } = this.state;
    return (
      <div>{
        readyToGo &&
        <div>
          {!currentuser && <Login />}
          {!dataSaved && currentuser && <Profile currentuser={currentuser} saveDataStatus={this.saveDataStatus} />}
          {!users && dataSaved && <Dashboard setdataSavedToNull={this.setdataSavedToNull} updateUsers={this.updateUsers} userinfo={dataSaved} />}
          {users && <Meeting setUsersToNull={this.setUsersToNull} currentuser={dataSaved} users={users} />}

        </div>
      }
        {
          !readyToGo &&
          // <h1>Loading</h1>
            <ClipLoader
            className={override}
            sizeUnit={"px"}
            size={150}
            color={'#123abc'}
            loading={this.state.loading}
          />
        }
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