import * as firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBavigFqVwDwBdVcG54KSqmTffjRmsxj2g",
    authDomain: "thefinderapplication.firebaseapp.com",
    databaseURL: "https://thefinderapplication.firebaseio.com",
    projectId: "thefinderapplication",
    storageBucket: "thefinderapplication.appspot.com",
    messagingSenderId: "755651934920"
  };
  firebase.initializeApp(config);

export default firebase;
