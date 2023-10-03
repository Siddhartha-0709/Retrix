import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = () => {
  const navigation = useNavigation();
  async function checkLoginStatus() {
    const status = await AsyncStorage.getItem('loginState');
    if (status === 'Y') {
      const phoneNumber = await AsyncStorage.getItem('PhoneNumber');
      navigation.navigate('ChatList', {phoneNumber});
    }
  }
  const handleButtonPress = () => {
    checkLoginStatus();
    navigation.navigate('SignUp');
  };
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/images/splash.png')} // Set the image source here
        style={styles.background}>
        <Image
          source={require('../assets/images/logo.png')} // Set the image source here
          style={styles.logo}></Image>
        <Image
          source={require('../assets/images/tagling.png')} // Set the image source here
          style={styles.tagline}></Image>
        {/* <Text style={{color:'#000000',fontSize:100, fontWeight:'700',marginLeft:10}}>Retrix</Text> */}
        {/* <Text style={{color:'#000000',fontSize:25, fontWeight:'600',marginLeft:10}}> Fast | Clean | Secure</Text> */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.text}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  background: {
    height: '100%',
    marginLeft: 0,
  },
  logo: {
    maxHeight: 250,
    maxWidth: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 100,
  },
  tagline: {
    maxHeight: 180,
    maxWidth: 400,
    marginLeft:'auto',
    marginRight:'auto'
  },
  loader: {
    maxHeight: 50,
    maxWidth: 50,
    marginHorizontal: 180,
  },
  button: {
    width: 140,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 100,
    elevation: 4,
  },
  text: {
    marginTop: 4,
    color: '#000000',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
