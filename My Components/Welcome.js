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
import { useNavigation } from '@react-navigation/native';
const Welcome = () => {
  const navigation = useNavigation();

  const handleButtonPress = ()=>{
    navigation.navigate('SignUp')
  }
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/images/background.png')} // Set the image source here
        style={styles.background}>
          <Text style={{color:'#000000',fontSize:100, fontWeight:'700',marginLeft:10}}>Retrix</Text>
          <Text style={{color:'#000000',fontSize:25, fontWeight:'600',marginLeft:10}}> Fast | Clean | Secure</Text>
          <Text style={{color:'#000000',fontSize:25, fontWeight:'600',marginLeft:10}}> Promising Security and Privacy</Text>
        <TouchableOpacity style={styles.button}
          onPress={handleButtonPress}
        >
          <Text style={styles.text}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  background: {
    height: '120%',
  },
  logo: {
    marginVertical: 40,
    marginHorizontal: 7,
    maxHeight: 480,
    maxWidth: 450,
  },
  loader: {
    maxHeight: 50,
    maxWidth: 50,
    marginHorizontal: 180,
  },
  button: {
    width:140,
    height:50,
    backgroundColor:'#000000',
    borderRadius:20,
    padding:8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop:450
  },
  text:{
    marginTop:4,
    color:'#FFFFFF',
    textAlign:'center',
    fontSize:20,
    fontWeight:'600',
    marginLeft:'auto',
    marginRight:'auto',
  }
});
