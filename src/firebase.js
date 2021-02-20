import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4gpWypGIqHMtVtd4CsoB3rQDzDdOYxs4",
  authDomain: "instagram-46c59.firebaseapp.com",
  projectId: "instagram-46c59",
  storageBucket: "instagram-46c59.appspot.com",
  messagingSenderId: "723566069800",
  appId: "1:723566069800:web:74c3289f971f0cba184d1d",
  measurementId: "G-BTG0S6W5HH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
