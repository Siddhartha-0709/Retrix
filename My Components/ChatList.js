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
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const phoneNumber = route.params.phoneNumber;
  const userChats = [];
  useEffect(() => {
    database()
      .ref('/chatroom')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const uniqueKey = childSnapshot.key;
          if (uniqueKey.includes(phoneNumber)) {
            if (uniqueKey.substring(0, 9) === phoneNumber) {
              var otherNumber = uniqueKey.substring(10, 19);
              userChats.push(otherNumber);
            } else {
              var otherNumber = uniqueKey.substring(0, 10);
              userChats.push(otherNumber);
            }
          }
        });
        console.log(userChats);
        database()
          .ref('/users-list')
          .once('value')
          .then(snapshot => {
            const userData = snapshot.val();
            console.log(Object.keys(userData));
            const filteredUserData = {};
            userChats.forEach(chatNumber => {
              if (userData.hasOwnProperty(chatNumber)) {
                filteredUserData[chatNumber] = userData[chatNumber];
              }
            });
            console.log('Filtered User Data:', filteredUserData);
            setUserData(filteredUserData);
          })
          .catch(error => {
            console.error('Error fetching user data from Firebase:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching chatroom data from Firebase:', error);
      });
  }, [phoneNumber]);

  const handleChatRefresh = () => {
    database()
      .ref('/chatroom')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const uniqueKey = childSnapshot.key;
          if (uniqueKey.includes(phoneNumber)) {
            if (uniqueKey.substring(0, 9) === phoneNumber) {
              var otherNumber = uniqueKey.substring(10, 19);
              userChats.push(otherNumber);
            } else {
              var otherNumber = uniqueKey.substring(0, 10);
              userChats.push(otherNumber);
            }
          }
        });
        console.log(userChats);
        database()
          .ref('/users-list')
          .once('value')
          .then(snapshot => {
            const userData = snapshot.val();
            console.log(Object.keys(userData));
            const filteredUserData = {};
            userChats.forEach(chatNumber => {
              if (userData.hasOwnProperty(chatNumber)) {
                filteredUserData[chatNumber] = userData[chatNumber];
              }
            });
            console.log('Filtered User Data:', filteredUserData);
            setUserData(filteredUserData);
          })
          .catch(error => {
            console.error('Error fetching user data from Firebase:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching chatroom data from Firebase:', error);
      });
  };

  const handleNewChat = (otherUser, otherUserName, imageLink) => {
    navigation.navigate('Chat', {
      phoneNumber,
      otherUser,
      otherUserName,
      imageLink,
    });
  };
  const searchNewChat = () => {
    var arrayOfObjects;
    database()
      .ref('/users-list')
      .once('value')
      .then(snapshot => {
        const usersData = snapshot.val();
        arrayOfObjects = Object.values(usersData);
        var flag = 0;
        for (i = 0; i < arrayOfObjects.length; i++) {
          if (searchQuery == arrayOfObjects[i].phoneNumber) {
            flag = 1;
            console.log(arrayOfObjects[i]);
            Snackbar.show({
              text: 'Starting new Chat!',
              duration: Snackbar.LENGTH_SHORT,
            });
            handleNewChat(
              arrayOfObjects[i].phoneNumber,
              arrayOfObjects[i].name,
              arrayOfObjects[i].imageLink,
            );
          }
        }
        if (flag == 0) {
          Snackbar.show({
            text: 'User not yet registered!',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
  };
  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/chatLst.jpg')}
        style={styles.backgroundImage}>
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
          <TouchableOpacity style={styles.findButton} onPress={searchNewChat}>
            <Text style={styles.findButtonText}>Find</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.refreshButtonContainer}
        onPress={handleChatRefresh}
        >
              <Text style={{color: '#000000',fontWeight:'800',textAlign:'center'}}>Refresh</Text>
          </TouchableOpacity>
        <ScrollView style={styles.scrollContainer}>
          {Object.keys(userData).map(key => (
            <TouchableOpacity
              key={key}
              style={styles.chatItem}
              onPress={() =>
                handleNewChat(
                  userData[key].phoneNumber,
                  userData[key].name,
                  userData[key].imageLink,
                )
              }>
              <Image
                source={
                  userData[key].imageLink !== 'null'
                    ? {uri: userData[key].imageLink}
                    : require('../assets/images/userdp.png')
                }
                style={styles.profilePic}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{userData[key].name}</Text>
                <Text style={styles.lastMessage}>
                  {userData[key].bio !== 'null'
                    ? userData[key].bio
                    : 'Hey there I am on Retrix!'}
                </Text>
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
    justifyContent: 'center',
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligns items at opposite ends
    alignItems: 'center',
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
  refreshButtonContainer: {
    backgroundColor:'#FFFFFF',
    width:80,
    height:30,
    borderRadius:15,
    padding:4,
    marginLeft:300,
    marginBottom:5
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
