import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function ProfilePage() {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const data = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData !== null) {
        // Parse the JSON string to an object
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
    }
  };

  useEffect(() => {
    data();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('userUID');
      // Navigate to the StartingScreen
      navigation.navigate('StartingScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user's profile image URI
        style={styles.profileImage}
      />
      <Text style={styles.name}>{userData.name || 'Name not available'}</Text>
      <Text style={styles.email}>{userData.usermail || 'Email not available'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F3742F', // Example color
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
