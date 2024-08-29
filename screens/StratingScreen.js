import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  Image,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

function StartingScreen({ navigation }) {
  const { width, height } = Dimensions.get('window');

  const logoScale = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(logoScale.value, { duration: 1000 }) }],
    };
  });

  useEffect(() => {
    logoScale.value = 1;
  }, []);

  return (
    <LinearGradient
      colors={['#006073', '#1fc2a6']} // Background gradient colors
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Animated.View style={logoAnimatedStyle}>
          <Image
            source={require('../images/logo.png')} // Ensure this path is correct
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate('Signin')}>
          <LinearGradient
            colors={['#EA4623', '#EF3828', '#F27D30', '#F3742F', '#D67E37']} // Custom gradient colors
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('LoginScreen')}>
          <LinearGradient
            colors={['#006073', '#1fc2a6']} // Default gradient colors for the second button
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 200, // Space at the bottom
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // Space between buttons
  },
  buttonText: {
    paddingLeft:40,
    paddingRight:40,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default StartingScreen;
