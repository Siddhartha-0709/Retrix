import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import '@react-native-firebase/database';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
import DocumentPicker from 'react-native-document-picker';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';

const Chat = ({route}) => {
  const user = route.params.phoneNumber;
  const otherUser = route.params.otherUser;
  const otherUserName = route.params.otherUserName;
  const imageLink = route.params.imageLink;
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const [fileData, setFileData] = useState('null');
  const scrollViewRef = useRef();
  let param1 = Number(user);
  let param2 = Number(otherUser);
  var chatRoomId;
  if (param1 > param2) {
    chatRoomId = param1.toString() + param2.toString();
  } else {
    chatRoomId = param2.toString() + param1.toString();
  }
  useEffect(() => {
    // This will run when fileData changes
    console.log('File--' + fileData);
    if(fileData!='null'){
      updateMessages();
    }
  }, [fileData]);
  useEffect(() => {
    const chatroomRef = database().ref(
      `/chatroom/${chatRoomId}/content/messages`,
    );
    chatroomRef.orderByChild('timestamp').on('value', snapshot => {
      if (snapshot.exists()) {
        // setData(snapshot.val());
        var messages = Object.values(snapshot.val()).sort(
          (a, b) => a.timestamp - b.timestamp,
        );
        messages = messages.reverse();
        setData(messages);
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    });
    return () => chatroomRef.off();
  }, [chatRoomId]);

  const updateMessages = async () => {
    const chatroomRef = database().ref(`/chatroom/${chatRoomId}`);
    const chatroomExists = await chatroomRef.once('value');
    if (!chatroomExists) {
      console.log('Creating New ChatRoom');
      await chatroomRef
        .update({
          id: chatRoomId,
          content: {
            participant1: user,
            participant2: otherUser,
            messages: [
              {
                sender: user,
                receiver: otherUser,
                data: message,
                media: fileData,
                timestamp: firebase.database.ServerValue.TIMESTAMP, // This sets the timestamp to the server's current time
              },
            ],
          },
        })
        .then(() => {
          setMessage(''); // Clear the input field after sending a message
        });
    } else {
      // Update the existing chatroom.
      console.log('Updating Existing ChatRoom');
      chatroomRef
        .child('content/messages')
        .push({
          sender: user,
          receiver: otherUser,
          data: message,
          media: fileData,
          timestamp: firebase.database.ServerValue.TIMESTAMP, // This sets the timestamp to the server's current time
        })
        .then(() => {
          setMessage(''); // Clear the input field after sending a message
        });
    }
  };

  const handleDocumentSend = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      console.log(file);
      const reference = storage().ref(file.name);
      const pathToFile = file.uri;
      //upload file
      Snackbar.show({
        text: 'Uploading media please wait',
        duration: Snackbar.LENGTH_SHORT,
      });
      await reference.putFile(pathToFile);
      const url = await storage().ref(file.name).getDownloadURL();
      console.log(url);
      setFileData(url);
      console.log('File In Function-' + fileData);
      Snackbar.show({
        text: 'Upload Complete',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.topBar}>
        <Image
          source={{
            uri: imageLink,
          }}
          style={styles.profilePic}
        />
        <Text style={styles.topBarText}>{otherUserName}</Text>
      </View>

      {/* Wrap the content in an ImageBackground */}
      <ImageBackground
        source={require('../assets/images/chatbg.jpg')}
        style={styles.backgroundImage}>
        <ScrollView
          style={styles.messageContainer}
          ref={scrollViewRef}
          contentContainerStyle={styles.messageContent}>
          {Object.keys(data)
            .reverse()
            .map(key => {
              const senderStyle =
                data[key].sender === user
                  ? styles.senderMessage
                  : styles.receiverMessage;
              return (
                <View key={key} style={senderStyle}>
                  {data[key].media !== 'null' ? (
                    <Image
                      source={{uri: data[key].media}}
                      style={{width: 250, height: 250,margin:0,borderRadius:20}}
                    />
                  ) : (
                    <Text style={styles.messageText}>{data[key].data}</Text>
                  )}
                </View>
              );
            })}
        </ScrollView>

        <View style={styles.inputContainer}>
        <TouchableOpacity
            style={styles.sendImage}
            onPress={handleDocumentSend}>
            <Image
              source={require('../assets/images/gallery.png')}
              style={{width:40,height:40}}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#000000"
            onChangeText={text => setMessage(text)}
            color="#000000"
            value={message}
          />
          <TouchableOpacity style={styles.sendButton} onPress={updateMessages}>
          <Image
              source={require('../assets/images/send.png')}
              style={{width:40,height:40}}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27374D',
  },
  topBar: {
    backgroundColor: '#000',
    height: 60,
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Align items vertically
    padding: 10, // Adjust padding as needed
  },
  topBarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // You can adjust the resizeMode as needed
  },
  messageContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Make the background of the ScrollView transparent
  },
  messageContent: {
    paddingVertical: 10,
  },
  senderMessage: {
    backgroundColor: '#FF2E63',
    marginLeft: 10,
    marginRight: 7,
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    elevation: 4,
  },
  receiverMessage: {
    backgroundColor: '#424874',
    marginLeft: 7,
    marginRight: 10,
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    elevation: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 18,
    margin:8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 50,
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginLeft: 4,
    padding:6
  },
  sendButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    marginLeft:'auto',
    marginRight:'auto',
    margin:5
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  sendImage:{
    backgroundColor:'#FFFFFF',
    borderRadius:20,
    padding:5,
    marginRight:4
  }
});
export default Chat;
