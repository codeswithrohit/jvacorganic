import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
    //Paste Your firebase config here
   
    apiKey: "AIzaSyBGOytsyzFv2Ej-rprhhr0lKLusaC8kGqY",
  authDomain: "organicfirm-e67e3.firebaseapp.com",
  projectId: "organicfirm-e67e3",
  storageBucket: "organicfirm-e67e3.appspot.com",
  messagingSenderId: "79800945091",
  appId: "1:79800945091:web:0960f40ddfefdf6785d576"
    
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



