import {View, Text, StyleSheet, Image, Pressable, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {logoSrc} from '../constant';
import Gap from '../components/Gap';

const SplashScreen = ({navigation}) => {

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000)
    });
  }, []);

  
  return (
    <ImageBackground source={require('../assets/images/splash.png')} resizeMode="cover" style={styles.container}>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#13140D'
  },
});

export default SplashScreen;
