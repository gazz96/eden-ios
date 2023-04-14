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
import { HeaderWithBackButton } from '../components'
import WebView from 'react-native-webview'
const FaqScreen = ({route, navigation}) => {
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
                {/* <ScrollView style={{  height: '100%', paddingHorizontal: 20 }}> */}
                    <Gap height={20}/>
                    <View style={{paddingHorizontal: 20}}>
                        <HeaderWithBackButton onPress={() => navigation.goBack() } title="FAQ" />
                    </View>
                    <Gap height={30}/>
                     <View style={{paddingHorizontal: 20}}>
                        <View style={{marginBottom: 20}}>
                            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#fff', marginBottom: 5}}>{'\u2022'} What is the EDC? </Text>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#fff'}}>EDC or Eden Coin is a point reward that you can use for redeem gifts offered on our apps.</Text>
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#fff', marginBottom: 5}}>{'\u2022'} Where I can collect my redeemed gifts? </Text>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#fff'}}>Please collect your redeemed gifts at our nearest store in your area, please refer to our maps in app to see location.</Text>
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#fff', marginBottom: 5}}>{'\u2022'} What is benefit of membership? </Text>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#fff'}}>
                            - Silver member entitled to get 5% discount and converted as EDC for every shishs purchases.
                            </Text>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#fff'}}>
                            - Gold entitled to get 10% discount and converted as EDC for every shishs purchases.
                            </Text>
                            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#fff'}}>
                            - Platinum member entitled to get 15% discount and converted as EDC for every shishs purchases.
                            </Text>

                            
                            
                        </View>
                     </View>
                {/* </ScrollView> */}
            </ImageBackground>
        </LinearGradient>
    )
}

export default FaqScreen

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