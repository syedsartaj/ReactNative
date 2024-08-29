import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function QRcodePage() {
  const myData = "https://yourwebsite.com"; // Replace with any data you want to encode in the QR code

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Scan this QR Code</Text>
      <QRCode
        value={myData}
        size={200}
      />
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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 24,
    color: '#666666',
    textAlign: 'center',
  },

});

export default QRcodePage;
