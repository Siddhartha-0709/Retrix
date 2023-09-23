import React from 'react';
import {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

import Snackbar from 'react-native-snackbar';

import {useNavigation} from '@react-navigation/native';

const ChatList = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const phoneNumber = route.params.phoneNumber;
  // console.log("ChatScreen--"+phoneNumber);
  database().ref('/users-list').once('value').then(snapshot => {
      // console.log('User data: ', snapshot.val());
      setUserData(snapshot.val());
    });
  const handleNewChat = (otherUser, otherUserName, imageLink) => {
  navigation.navigate('Chat', {phoneNumber, otherUser, otherUserName, imageLink});
  };
  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/chatLst.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <View style={styles.searchContainer}>
        <TextInput
          placeholder="Find users by their Phone Number"
          placeholderTextColor="black"
          keyboardType="numeric"
          style={styles.searchInput}
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.findButton} onPress={handleNewChat}>
          <Text style={styles.findButtonText}>Find</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(userData).map(key => (
          <TouchableOpacity
            key={key}
            style={styles.chatItem}
            onPress={() => handleNewChat(userData[key].phoneNumber,userData[key].name,userData[key].imageLink)}
            >
            <Image
              source={{
                uri: userData[key].imageLink,
              }}
              style={styles.profilePic}
            />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{userData[key].name}</Text>
              <Text style={styles.lastMessage}>{userData[key].bio}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // You can change the resizeMode as needed
  },
  // The rest of your styles...
  header: {
    height: 90,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  scrollContainer: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3FDE8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  lastMessage: {
    fontSize: 16,
    color: '#555',
  },
  newChat: {
    backgroundColor: '#F3FDE8',
    padding: 6,
    borderRadius: 30,
    height: 50,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3FDE8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  findButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  findButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default ChatList;
