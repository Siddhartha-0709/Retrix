import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import firebase from '@react-native-firebase/app';

// Import your screen components here
import LoginScreen from './LoginScreen';
import ChatList from './ChatList';
import Chat from './Chat';
import Welcome from './Welcome';
import SignUp from './SignUp';
import ProfilePicBio from './ProfilePicBio';

//Firebase Credentials
const firebaseConfig = {
  apiKey: 'AIzaSyB-ENDOChvniU8LcC8wSt5M7wP3eg70uW0',
  authDomain: 'retrix-9548d.firebaseapp.com',
  databaseURL:
    'https://retrix-9548d-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'retrix-9548d',
  storageBucket: 'retrix-9548d.appspot.com',
  messagingSenderId: '579082619377',
  appId: '1:579082619377:web:c39c046bf7429aba9b1c50',
};
const Stack = createNativeStackNavigator();

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  console.log('Firebase Initialized');
};

function App() {
  initFirebase();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Define your screens and their names */}
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfilePicBio"
          component={ProfilePicBio}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
