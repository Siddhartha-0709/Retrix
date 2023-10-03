import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';


const SignUp = () => {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const register = async () => {
    console.log('In SignUp'+phone+' '+email+' '+name)
    navigation.navigate('ProfilePicBio', {phone, email, name});
    // navigation.navigate('Chat', {phoneNumber, otherUser, otherUserName});
  };
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.background}>
        <View>
          <Text style={styles.heading}>Let's Get Started!</Text>
          <Text style={styles.subheading}>
            Your Journey Begins with Retrix{' '}
          </Text>
          <View style={styles.inputFeilds}>
            <Image
              source={require('../assets/images/user.png')}
              style={styles.image}
            />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={'#000000'}
              style={styles.input}
              onChangeText={text => setName(text)}
              require
            />
          </View>
          <View style={styles.inputFeilds}>
            <Image
              source={require('../assets/images/phone.png')}
              style={styles.image}
            />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor={'#000000'}
              style={styles.input}
              keyboardType="numeric"
              onChangeText={text => setPhone(text)}
              require
            />
          </View>
          <View style={styles.inputFeilds}>
            <Image
              source={require('../assets/images/calendar.png')}
              style={styles.image}
            />
            <TextInput
              placeholder="E-Mail ID"
              placeholderTextColor={'#000000'}
              style={styles.input}
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
              require
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={handleLogin}>
          <Text style={styles.button2Text}>
            Already Have an Account?{'   '}
            <Text style={{color: 'red'}}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  background: {
    height: '100%',
  },
  heading: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '900',
    marginBottom: 0,
    marginTop:230,
    marginLeft: 50,
  },
  subheading: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '900',
    marginBottom: 30,
    marginLeft: 50,
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
    backgroundColor: '#FF6969',
    width: 100,
    height: 40,
    borderRadius: 20,
    padding: 3,
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
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
    color: '#FFF5E0',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 150,
  },
  button3: {
    backgroundColor: '#213555',
    height: 40,
    width: 120,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
