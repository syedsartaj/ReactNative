import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

const { width, height } = Dimensions.get('window');

function LandingPage() {
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); // State to manage notification visibility
  const flatListRef = useRef(null);

  const retrieveUid = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('userUID');
      if (storedUid !== null) {
        setUid(storedUid);
        fetchUserData(storedUid); // Fetch user data once UID is retrieved
      }
    } catch (error) {
      console.error('Failed to retrieve UID:', error);
    }
  };

  // Function to fetch user data from Firebase
  const fetchUserData = async (userUID) => {
    try {
      const snapshot = await database().ref(`/users/${userUID}`).once('value');
      const data = snapshot.val();
      if (data) {
        setUserData(data);
        // Optionally store user data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        console.log(data);
      } else {
        Alert.alert('No Data Found', 'User data not found in the database.');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };
  useEffect(() => {
    retrieveUid();
  }, []);

  const promotions = [
    { image: 'https://via.placeholder.com/80', text: 'Promo 1' },
    { image: 'https://via.placeholder.com/80', text: 'Promo 2' },
    { image: 'https://via.placeholder.com/80', text: 'Promo 3' },
    { image: 'https://via.placeholder.com/80', text: 'Promo 4' },
    { image: 'https://via.placeholder.com/80', text: 'Promo 5' }
  ];
  const news = [
    { image: 'https://via.placeholder.com/80', text: 'News 1' },
    { image: 'https://via.placeholder.com/80', text: 'News 2' },
    { image: 'https://via.placeholder.com/80', text: 'News 3' },
    { image: 'https://via.placeholder.com/80', text: 'News 4' },
    { image: 'https://via.placeholder.com/80', text: 'News 5' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % news.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, news.length]);

  const notifications = [
    'Notification 1',
    'Notification 2',
    'Notification 3',
    'Notification 4',
    'Notification 5',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
      >
        <View style={styles.stacknav}>
          <Image 
            source={require('../images/logo.png')} // Ensure this path is correct
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
            <Icon name="bell-o" size={24} color="#F3742F" />
          </TouchableOpacity>
        </View>

        {/* Notification Dropdown */}
        {showNotifications && (
          <View style={styles.notificationDropdown}>
            {notifications.map((notification, index) => (
              <Text key={index} style={styles.notificationItem}>
                {notification}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.cardView}>
          <LinearGradient
            colors={['#006073', '#1fc2a6']}
            style={styles.gradientBackground}
          >
            {/* Top Section: Name, Balance, and Card Number */}
            <View style={styles.cardTopSection}>
              <View style={styles.cardTopContent}>
                <Text style={styles.cardName}>{userData.name}</Text>
                <Text style={styles.cardBalance}>Total Balance: $511</Text>
                <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
              </View>
              <Text style={styles.cardType}>{userData.package}</Text>
            </View>

            {/* Bottom Section: Earn, Burn, Send */}
            <View style={styles.cardBottomSection}>
              <Text style={styles.cardAction}>Earn</Text>
              <View style={styles.separatorLine}></View>
              <Text style={styles.cardAction}>Burn</Text>
              <View style={styles.separatorLine}></View>
              <Text style={styles.cardAction}>Send</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardsSection}>
          <View style={styles.card}>
            <Icon name="star-o" size={24} color="#F3742F" />
            <Text style={styles.cardText}>Services</Text>
          </View>
          <View style={styles.card}>
            <Icon name="rocket" size={24} color="#F3742F" />
            <Text style={styles.cardText}>Fasttrack</Text>
          </View>
          <View style={styles.card}>
            <Icon name="refresh" size={24} color="#F3742F" />
            <Text style={styles.cardText}>Recovery</Text>
          </View>
          <View style={styles.card}>
            <Icon name="bolt" size={24} color="#F3742F" />
            <Text style={styles.cardText}>Fuel</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Promotions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promotionsSection}>
          {promotions.map((promo, index) => (
            <View key={index} style={styles.promotion}>
              <Image source={{ uri: promo.image }} style={styles.promotionImage} />
              <Text style={styles.promotionText}>{promo.text}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionHeading}>News</Text>
        <View style={styles.newsSection}>
          <FlatList
            ref={flatListRef}
            data={news}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.newsItem}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <Text style={styles.newsText}>{item.text}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.uidSection}>
          {uid ? <Text>User UID: {uid}</Text> : <Text>Loading UID...</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Off-white background
    padding: 20,
  },
  stacknav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginBottom: 16,
    borderRadius: 50,
  },
  notificationDropdown: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  notificationItem: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#333',
  },
  cardView: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between', // Ensure the bottom section stays at the bottom
  },
  cardTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1, // This will push the bottom section down
  },
  cardTopContent: {
    flex: 1, // Ensure content takes available space
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBalance: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  cardType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  cardBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Each action should take equal space
  },
  separatorLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  cardsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  card: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  cardText: {
    marginTop: 8,
    fontSize: 10,
    color: '#333',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  promotionsSection: {
    marginBottom: 16,
  },
  promotion: {
    alignItems: 'center',
    marginRight: 16,
  },
  promotionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  promotionText: {
    fontSize: 14,
    color: '#333',
  },
  newsSection: {
    height: 200,
    marginBottom: 16,
  },
  newsItem: {
    width: width - 40,
    alignItems: 'center',
  },
  newsImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  newsText: {
    fontSize: 14,
    color: '#333',
  },
  uidSection: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LandingPage;
