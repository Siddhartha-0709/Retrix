import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import firebase from '@react-native-firebase/app';
import Snackbar from 'react-native-snackbar';
import '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

const ProfilePicBio = ({route}) => {
  const [bio, setBio] = useState('null');
  const [imageLink, setImageLink] = useState('null');
  const [loader, setLoader] = useState(false);
  const name = route.params.name;
  const phone = route.params.phone;
  const email = route.params.email;
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  async function addToFirebase(phoneNumber, email, name, bio, imageLink) {
    const phoneNumberString = phoneNumber.toString();
    const database = firebase.database();
    const usersRef = database.ref('users-list');
    const userSnapshot = await usersRef.child(phoneNumberString).once('value');
    if (!userSnapshot.exists()) {
      setLoader(true);
      await usersRef.child(phoneNumber).set({
        phoneNumber,
        email,
        name,
        bio,
        imageLink
      });
      setLoader(false);
    } else {
      //Account already exists no need to signup
      //TODO:: Navigate to Login Screen
      Snackbar.show({
        text: 'Account already exists! Please Log In',
        duration: Snackbar.LENGTH_SHORT,
      });
      navigation.navigate('Login');
    }  
  }
  const register = () => {
    addToFirebase(phone,email,name,bio,imageLink);
    Snackbar.show({
      text: 'Account created Successfully!',
      duration: Snackbar.LENGTH_SHORT,
    });
    navigation.navigate('Login');
  };
  const uploadPic = async () => {
    try {
      const dp = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      console.log(dp);
      const reference = storage().ref(dp.name);
      const pathToFile = dp.uri;
      //upload file
      await reference.putFile(pathToFile);
      const url = await storage().ref(dp.name).getDownloadURL();
      console.log(url);
      setImageLink(url);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/images/background1.png')}
        style={styles.background}>
        <View style={{marginTop: 0}}>
          <Text style={styles.heading}>Let's Get Personal</Text>
          <Text style={styles.subheading}>Take a Snap & Share a Bio!</Text>
          {imageLink != 'null' ? (
            <Image
              source={{uri: imageLink}}
              style={{
                height: 200,
                width: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius:50
              }}
            />
          ) : (
            <Image
              source={require('../assets/images/userdp.png')}
              style={{
                height: 200,
                width: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius:50
              }}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={uploadPic}>
            {loader==false?(
            <Image
              source={require('../assets/images/camera.png')}
              style={{height: 40, width: 40}}
            />)
            :
            (<ActivityIndicator size="large" color="#00ff00" />)}
          </TouchableOpacity>
        </View>
        <View style={styles.inputFeilds}>
          <Image
            source={require('../assets/images/bio.png')}
            style={styles.image}
          />
          <TextInput
            placeholder="Your Profile Bio!"
            placeholderTextColor={'#000000'}
            style={styles.input}
            keyboardType="email-address"
            onChangeText={text => setBio(text)}
            require
          />
        </View>
        <TouchableOpacity style={styles.button2} onPress={register}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.button2Text}>
            Already Have an Account?{' '}
            <Text style={{color: '#279EFF'}}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProfilePicBio;

const styles = StyleSheet.create({
  background: {
    height: '100%',
  },
  heading: {
    fontSize: 40,
    color: '#000000',
    fontWeight: '900',
    marginLeft: 30,
    marginTop: 130,
  },
  subheading: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '900',
    marginBottom: 30,
    marginLeft: 30,
  },
  inputFeilds: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    marginTop: 30,
  },
  image: {
    height: 30,
    width: 30,
  },
  input: {
    width: 260,
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 0,
    marginLeft: 240,
    position: 'absolute',
    top: 380,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    color: '#FFFFFF',
  },
  button2Text: {
    color: '#213555',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 240,
  },
  button3: {
    backgroundColor: '#213555',
    height: 40,
    width: 120,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button2: {
    backgroundColor: '#000000',
    padding: 10,
    width: 100,
    height: 60,
    borderRadius: 30,
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
