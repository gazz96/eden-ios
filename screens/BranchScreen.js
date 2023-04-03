import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Pressable,
  Linking,
  Image,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {BASE_URL, Colors} from '../constant';
import Gap from '../components/Gap';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import BranchMap from '../components/BranchMap';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import { BranchAction } from '../actions';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const BranchScreen = ({navigation}) => {
  const [branches, setBranches] = useState("");
  const [currentBranch, setCurrentBranch] = useState({});
  const [loading, setLoading] = useState(false);
  const [injectedJs, setinjectedJs] = useState("")


  const [show, setShow] = useState(-1)

  const loadBranch = async () => {
    setLoading(true)
    try {
      let response = await BranchAction.list();
      console.log('response', response.data);
      // console.log('JSON', JSON.stringify(response.data));
      setinjectedJs(`
        window.branches = ${JSON.stringify(response.data)}
      `)

      setBranches(JSON.stringify(response.data));

      
 
    } 
    catch (err) {
      console.log('err', err);
    }
    finally {
      setLoading(false)
    }
  };

  const bottomSheetRef = useRef();
  
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    setShow(index)
    
  }, []);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  useEffect(() => {
    loadBranch()
  }, []);

  const webviewRef = useRef();


  const onMessage = event => {
    console.log(event)
    setCurrentBranch(JSON.parse(event.nativeEvent.data));
    setShow(1)
    let data = event.nativeEvent.data;
  };


  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <LinearGradient colors={['#272727', '#13140D']} style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{width: '100%', flex: 1, height: '100%'}}>
          <Pressable
            style={{paddingHorizontal: 20, paddingVertical: 20}}
            onPress={() => navigation.goBack()}>
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
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 20,
              }}>
              LOCATIONS
            </Text>
          </View>
          <Gap height={20}/>
          {
            loading ? <ActivityIndicator/> : 
            <>
              <WebView
                onMessage={onMessage}
                ref={webviewRef}
                injectedJavaScript={injectedJs}
                source={{
                  html: `
                  <html>
                      <head>
                          <title>Branch</title>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
                          <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
                          <style>
                              body {
                                  padding: 0;
                                  margin: 0;
                              }
                              html, body, #map {
                                  height: 100%;
                                  width: 100vw;
                              }
                          </style>
                      </head>
                      <body>
                          <div id="map"></div>
                          <script>
                            var map = L.map('map').setView([-8.4023, 115.1790], 10);
                            var branches = ${JSON.stringify(branches)}
                            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            }).addTo(map);
                            
                            
                            branches = JSON.parse(branches);
                            var lowestMarker = null;
                            branches.map((branch, index) => {
                              L.marker([branch.longitude, branch.latitude]).addTo(map)
                                .on("click", function(){
                                  window.ReactNativeWebView.postMessage(JSON.stringify(branch));
                                })
                              
                            })

                            
                            
    

                        </script>
                      </body>
                      
                  </html>`
                }}  
                >

              </WebView>
              {
                  currentBranch ? 
                <BottomSheet
                  ref={bottomSheetRef}
                  index={show}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}
                  enablePanDownToClose={true}
                >
                  <View style={styles.contentContainer}>
                    <Text style={{color: "#222", fontFamily: 'Montserrat-Bold', fontSize: 16}}>{currentBranch.name}</Text>
                    <Gap height={20}/>
                    <Text style={{color: "#222", fontFamily: 'Montserrat-Regular', fontSize: 14}}>{currentBranch.address}</Text>
                    <Gap height={20}/>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image source={require("../assets/images/work-time.png")}/>
                      <Text style={{marginLeft: 8, color: "#222", fontFamily: 'Montserrat-SemiBold', fontSize: 16}}>{currentBranch.work_time}</Text>
                    </View>
                    <Gap height={20}/>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image source={require("../assets/images/phone.png")}/>
                      <Text style={{marginLeft: 8, color: "#222", fontFamily: 'Montserrat-SemiBold', fontSize: 16}}>{currentBranch.phone}</Text>
                    </View>
                    <Gap height={20}/>
                    
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(currentBranch.map_link)
                        }}>
                        <LinearGradient
                          colors={['#FFDD9C', '#BC893C']}
                          style={{borderRadius: 15}}>
                          <Text style={styles.btnPrimary}>GET DIRECTIONS</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                  </View> 
                  </BottomSheet> :
              <></>
              }
            </>
          }
      </ImageBackground>
    </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default BranchScreen;

const styles = StyleSheet.create({
  hero: {
    height: 439,
  },
  container: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  btnPrimary: {
    borderRadius: 25,
    color: '#fff',
    width: '100%',
    height: 50,
    lineHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'Montserrat-Bold',
  },
});
