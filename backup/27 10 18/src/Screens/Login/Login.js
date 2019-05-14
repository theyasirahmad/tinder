import React, {
    Component
} from 'react';
import './login.css';
import firebase from './../../Config/firebase';


const provider = new firebase.auth.FacebookAuthProvider();

class Login extends Component {
    constructor(props){
        super(props)
    
        this.login=this.login.bind(this)
    }

    //firebase facebook login function.
    login() {
        
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log(user.displayName);

        }).catch(function (error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // // The email of the user's account used.
            // var email = error.email;
            // // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            console.log(error);
            // ...
        });
    }

    renderLogin() {
        return (
            <div className={"container"}>
                <h1>Finder. </h1>
                <p className={"tagline"}> the perfect meeting app</p>
                <button title={"login with facebook"} className={"btn btn-danger"} onClick={this.login}>LOGIN</button>
                <br/>
                <br/>
                <p>Login find-er using facebook account</p>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderLogin()}
            </div>
        );
    }
}

export default Login;