import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import {Client, Account, ID} from 'appwrite';
import {useNavigation} from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';

const LoginScreen = () => {
  const [login, setLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [userId, setUserId] = useState('');
  const client = new Client();
  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6509a362c69999b443de');
  const account = new Account(client);
  const navigation = useNavigation();

  if (login === true) {
    navigation.navigate('ChatList', {phoneNumber});
  }
  const handleGetOTP = async () => {
    console.log(phoneNumber);
    var phoneNumber2 = '+91' + phoneNumber;
    const sessionToken = await account.createPhoneSession(
      ID.unique(),
      phoneNumber2,
    );
    const uId = sessionToken.userId;
    setUserId(uId);
    console.log(userId);
  };

  async function addPhoneNumberToFirebase(phoneNumber) {
    const database = firebase.database();
    const usersRef = database.ref('users-list');
    const userSnapshot = await usersRef.child(phoneNumber).once('value');
    if (!userSnapshot.exists()) {
      Snackbar.show({
        text: 'Account dosenot Exists! Please Sign Up',
        duration: Snackbar.LENGTH_SHORT,
      });
      navigation.navigate('SignUp');
    }
    else{
      navigation.navigate('ChatList', {phoneNumber});
    }
  }

  const authenticate = async () => {
    const session = await account.updatePhoneSession(userId, pin);
    if (session != null) {
      console.log('Login Successful');
      console.log(session);
      console.log('Adding Entry to Database if Not Already Exist');
      await addPhoneNumberToFirebase(phoneNumber);
    }
  };
  const handleSignup = ()=>{
    navigation.navigate('SignUp')
  }
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subheading}>Access | Engage | Connect</Text>
          <View style={styles.inputFields}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/phone.png')}
                style={styles.image}
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor={'#000000'}
                style={styles.input}
                keyboardType="numeric"
                onChangeText={text => setPhoneNumber(text)}
              />
            </View>
            <TouchableOpacity style={styles.getOTP}
            onPress={handleGetOTP}
            >
              <Text style={styles.getOTPText}>Get OTP</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputFields}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/phone.png')}
                style={styles.image}
              />
              <TextInput
                placeholder="OTP"
                placeholderTextColor={'#000000'}
                style={styles.input}
                keyboardType="numeric"
                onChangeText={text => setPin(text)}
              />
            </View>
            <TouchableOpacity style={styles.getOTP}
            onPress={authenticate}
            >
              <Text style={styles.getOTPText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button2}
        onPress={handleSignup}
        >
          <Text style={styles.button2Text}>Don't Have an Account? <Text style={{color:'#45FFCA'}}>Sign Up</Text></Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 5,
    marginLeft:50
  },
  heading: {
    marginVertical:240,
    fontSize: 40,
    color: '#000000',
    fontWeight: '900',
    marginBottom: 0,
  },
  subheading: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '900',
    marginBottom: 30,
  },
  inputFields: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width:230,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 2,
    marginRight: 10, // Added marginRight to separate TextInput and Get OTP button
    paddingLeft:9
  },
  image: {
    height: 30,
    width: 30,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    height:50
  },
  getOTP: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop:5,
    width:100
  },
  getOTPText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign:'center'
  },
  button2Text:{
    color:'#FFFFFF',
    fontWeight:'700',
    fontSize:16,
    marginLeft:20,
    marginBottom:20
  }
});
