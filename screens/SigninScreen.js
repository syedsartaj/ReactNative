import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Animated from 'react-native-reanimated';

function SigninScreen({ navigation }) {
  const [usermail, setUsermail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  const handleSubmit = async () => {
    if (!usermail || !password || !name || !phoneNumber || !selectedPackage) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      const formattedPhoneNumber = `+971${phoneNumber.replace(/^\+971/, '')}`;
      const userCredential = await auth().createUserWithEmailAndPassword(usermail, password);
      const uid = userCredential.user.uid;

      await database().ref(`/users/${uid}`).set({
        usermail,
        password, // Storing the password as plain text is not recommended for production.
        name,
        phoneNumber: formattedPhoneNumber,
        package: selectedPackage, // Store the selected package
      });

      Alert.alert('Sign Up Successful', `Welcome ${userCredential.user.email}`);
      navigation.navigate('LandingPage');
    } catch (error) {
      console.error('Error during sign up:', error);
      if (error.code === 'auth/network-request-failed') {
        Alert.alert('Sign Up Failed', 'Network error: Please check your internet connection.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Sign Up Failed', 'The email address is invalid.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Sign Up Failed', 'The password is too weak.');
      } else {
        Alert.alert('Sign Up Failed', error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#006073', '#1fc2a6']}
      style={styles.container}
    >
      <Animated.View style={styles.innerContainer}>
        <Text style={styles.title}>Create An Account</Text>
        <Text style={styles.description}>Enter your details to sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          autoCapitalize="none"
          value={usermail}
          onChangeText={setUsermail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (without UAE country code)"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.packageTitle}>Select Your Package</Text>
        <View style={styles.packageContainer}>
          {['Bronze', 'Silver', 'Gold', 'Platinum'].map((pkg) => (
            <TouchableOpacity
              key={pkg}
              style={[
                styles.packageButton,
                selectedPackage === pkg && styles.packageButtonSelected,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              <Text
                style={[
                  styles.packageButtonText,
                  selectedPackage === pkg && styles.packageButtonTextSelected,
                ]}
              >
                {pkg}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    color: '#333333',
    width: '100%',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  packageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  packageButton: {
    borderWidth: 1,
    borderColor: '#1fc2a6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    margin: 4, // Adjust margin to fit better
  },
  packageButtonSelected: {
    backgroundColor: '#1fc2a6',
  },
  packageButtonText: {
    color: '#1fc2a6',
    fontSize: 16,
    fontWeight: '600',
  },
  packageButtonTextSelected: {
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#1fc2a6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#006073',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 12,
  },
});

export default SigninScreen;
