import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDPteObvlUPv2qQn7zzaI0Dw9mFUg9O7i0',
  authDomain: 'tunespinner-ffb00.firebaseapp.com',
  databaseURL: 'https://tunespinner-ffb00.firebaseio.com',
  projectId: 'tunespinner-ffb00',
  storageBucket: 'tunespinner-ffb00.appspot.com',
  messagingSenderId: '386665167110',
}


const getFirebase = () => {
  if (window.firebase) {
    return window.firebase
  }

  firebase.initializeApp(config)
  window.firebase = firebase
  return window.firebase
}


export default getFirebase()
