async function addToFirebase(phoneNumber, email, name, bio) {
  const phoneNumberString = phoneNumber.toString();
  const database = firebase.database();
  const usersRef = database.ref('users-list');
  const userSnapshot = await usersRef.child(phoneNumberString).once('value');
  if (!userSnapshot.exists()) {
    await usersRef.child(phoneNumber).set({
      phoneNumber,
      email,
      name,
      bio,
    });
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
const uploadProfilePic = async ()=>{
  try{
      const dp = await DocumentPicker.pickSingle({
      type:[DocumentPicker.types.images]
    })
    console.log(dp);
    const reference = storage().ref(dp.name);
    const pathToFile = dp.uri;
    //upload file
    await reference.putFile(pathToFile);
    const url = await storage().ref(dp.name).getDownloadURL();
    console.log(url);
  }
  catch(err){
    console.log(err)
  }

  await addToFirebase(phone, email, name, bio);


  <View style={styles.inputFeilds}>
            <Image
              source={require('../assets/images/bio.png')}
              style={styles.image}
            />
            <TextInput
              placeholder="Enter a Profile Bio!"
              placeholderTextColor={'#000000'}
              style={styles.input}
              keyboardType="email-address"
              onChangeText={text => setBio(text)}
              require
            />
          </View>

<TouchableOpacity style={styles.button3} onPress={uploadProfilePic}>
<Text style={styles.buttonText}>Upload DP</Text>
</TouchableOpacity>