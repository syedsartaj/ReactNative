import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

function LoginScreen({ navigation }) {
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

  const logoScale = useSharedValue(1);
  const formHeight = useSharedValue(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(logoScale.value, { duration: 1000 }) }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(formHeight.value, { duration: 1200 }),
    };
  });

  const handleSubmit = async () => {
    // Check if the form fields are empty
    if (!username || !password) {
      Alert.alert('Validation Error', 'Please enter both your username and password.');
      return;
    }
  
    try {
      // Authenticate the user
      const userCredential = await auth().signInWithEmailAndPassword(username, password);
      
      // Get the user's UID
      const uid = userCredential.user.uid;
      
      // Store the UID in AsyncStorage
      await AsyncStorage.setItem('userUID', uid);
      
      // Navigate to the Landing Page
      navigation.navigate('LandingPage');
      
    } catch (error) {
      // Handle any errors that occur during sign-in
      if (error instanceof Error) {
        console.error(error);
        Alert.alert('Login Failed', error.message);
      } else {
        console.error("An unknown error occurred.");
        Alert.alert('Login Failed', 'An unknown error occurred.');
      }
    }
  };
    useEffect(() => {
    logoScale.value = 1;
    formHeight.value = deviceHeight * 0.6;
  }, []);

  return (
    <LinearGradient
      colors={['#006073', '#1fc2a6']} // Gradient colors
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image 
          source={require('../images/logo.png')} // Ensure this path is correct
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.description}>Enter your email and password</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0B0B0" // Light gray color for placeholder
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.link}>Create an account</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333333',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 24,
    color: '#666666',
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
  button: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1fc2a6',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#006073',
    fontSize: 16,
    marginTop: 12,
  },
});

export default LoginScreen;
