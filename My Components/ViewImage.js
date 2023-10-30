import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const ViewImage = ({ route }) => {
    const img = route.params.img;
try {
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: img}} style={styles.image} resizeMode="contain" />
      </View>
    );
  } catch (error) {
    console.error(error);
    return (
      <View>
        <Text>Error loading image</Text>
      </View>
    );
  }
};

export default ViewImage;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1, // Take up the entire available space
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    backgroundColor:'#000000'
  },
  image: {
    height:2000,
    width:400
  },
});
