import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, Image,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Screens
import LoginScreen from './screens/LoginScreen';
import SigninScreen from './screens/SigninScreen';
import LandingPage from './screens/LandingPage';
import StartingScreen from './screens/StratingScreen';
import QRcodePage from './screens/QRcodePage';
import ProfilePage from './screens/ProfilePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LandingPageTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'qrcode';
              break;
            case 'Prfile':
              iconName = 'rocket';
              break;
            case 'Proile':
              iconName = 'list-ul';
              break;
            default:
              iconName = 'circle'; // Default icon name
              break;
          }

          const iconColor = focused ? '#EA4623' : '#006073';

          return <Icon name={iconName} size={30} color={iconColor} />;
        },
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false

      })}
    >
      <Tab.Screen name="Home" component={LandingPage} />
      <Tab.Screen name="Prfile" component={LandingPage} />
      <Tab.Screen name="Profile" component={QRcodePage} />
      <Tab.Screen name="Proile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function App() {
  const [loading, setLoading] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState('StartingScreen');

  React.useEffect(() => {
    const checkUid = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUID');
        if (uid) {
          setInitialRoute('LandingPage');
        }
      } catch (error) {
        console.error('Failed to retrieve uid from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUid();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006073" />
      </View>
    );
  }


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Image source={require('./images/logo.png')} style={styles.logo} />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleAlign: 'left',

        }}
      >
        <Stack.Screen
          name="StartingScreen"
          component={StartingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signin"
          component={SigninScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LandingPage"
          component={LandingPageTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerLeft: {
    marginLeft: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  tabBarStyle: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 60,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
});

export default App;
