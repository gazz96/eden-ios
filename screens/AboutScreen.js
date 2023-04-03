import { StyleSheet, Text, View, ScrollView, ImageBackground, useWindowDimensions,Image } from 'react-native'
import React, { useEffect, useState  } from 'react'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import { BASE_URL, Colors } from '../constant'
import { ArticleAction } from '../actions'
import Gap from '../components/Gap'
//import HTMLView from 'react-native-htmlview'

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome5';
import RenderHtml from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient'

const AboutScreen = ({route, navigation}) => {
    //const { article } = route.params;
    let getImage = (image) => {
        return {
            uri: BASE_URL + '/uploads/' + image
        }
    }

    const { width } = useWindowDimensions();
    return (
        <LinearGradient colors={['#272727', '#13140D']} style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/long-background.png')} resizeMode="cover" style={{width: '100%', flex: 1, height: '100%'}}>
                <ScrollView style={{ flex: 1, height: '100%' }} >
                    <ImageBackground source={require('../assets/images/about.png')} imageStyle={{}} style={styles.hero}>
                        <Pressable style={{ paddingHorizontal:  20, paddingVertical: 20}} onPress={() => navigation.goBack()}>
                        <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#fff',
                      borderRadius: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      lineHeight: 40,
                      marginTop: 30
                    }}>
                    <Image
                      source={require('../assets/images/arrow-right.png')}
                    />
                  </View>
                        </Pressable>
                    </ImageBackground>
                    <View style={styles.container}>
                        <Text style={styles.title}>EDEN Group</Text>
                        <Gap height={20}/>
                        <Text style={{color: 'rgba(255,255,255,.7)', lineHeight: 32, fontSize: 18, fontFamily: 'Montserrat-Regular'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augue sollicitudin volutpat pellentesque urna a, accumsan. Turpis turpis nec odio hendrerit quam gravida ac semper.
                        </Text>
                    </View>
                    
                </ScrollView>
            </ImageBackground>
        </LinearGradient>
    )
}

export default AboutScreen

const styles = StyleSheet.create({
    hero: {
        height: 400
    },
    title: {
        fontSize: 20,
        color: '#FFFFF0',
        letterSpacing: .8,
        fontFamily: 'Montserrat-Bold'
    },
    container : {
        padding: 30,
        width: '100%',
    },
 
})