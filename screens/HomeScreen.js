import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Dimensions,
  ImageBackground,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  TipeBangunan,
  logoSrc,
  BASE_URL,
  UPLOAD_URL,
  Colors,
  SAVACONTACT,
} from '../constant';

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Loading, Gap, BadgeItem, PropertiCardBlock} from '../components';
import {UserContext, ShopContext, LangContext} from '../context';
import {ArticleAction, PropertyAction, UserAction} from '../actions';
import GiftAction from '../actions/GiftAction';

import {Rp} from '../constant';
import Toast from 'react-native-toast-message';

import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n from '../helpers/i18n';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const HomeScreen = ({route, navigation, props}) => {
  const currentLang = LangContext();
  const windowWidth = Dimensions.get('window').width - 32;
  const state = UserContext();
  const [user, setUser] = useState('');
  const shopSearchParams = ShopContext();
  const [loading, setLoading] = useState(true);

  const [latestNews, setLatestNews] = useState([]);
  const [isLatestNewsLoading, setIsLatestNewsLoading] = useState(true);

  const [latestGift, setlatestGift] = useState([]);
  const [isLatestGiftLoading, setIsLatestGiftLoading] = useState(true);

  let getImage = image => {
    return {
      uri: BASE_URL + '/uploads/' + image,
    };
  };

  const normalisasiNomorHP = phone => {
    phone = String(phone).trim();
    phone = phone.replace('-', '');
    phone = phone.replace(' ', '');
    if (phone.startsWith('08')) {
      phone = '628' + phone.slice(2);
    } else if (phone.startsWith('+62')) {
      phone = '628' + phone.slice(3);
    }
    return phone.replace(/[- .]/g, '');
  };

  const getLatestNews = async () => {
    try {
      let response = await ArticleAction.list({
        posts_per_page: 4,
      });
      setLatestNews(response.data);
    } catch (error) {
    } finally {
      setIsLatestNewsLoading(false);
    }
  };

  const getLatestGift = async () => {
    setIsLatestGiftLoading(true);
    try {
      let response = await GiftAction.list({
        posts_per_page: 3,
      });
      console.log('response', response);
      setlatestGift(response.data);
    } catch (error) {
      console.log('err', error);
    } finally {
      setIsLatestGiftLoading(false);
    }
  };

  const getMyProfile = async () => {
    setLoading(true);
    try {
      const response = await UserAction.me(state.get().id);
      console.log('user', response);

      setUser(response);
      setLoading(false);
    } catch (error) {
      console.log('error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openInAppBrowser = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          animated: true,
          modalPresentationStyle: 'overFullScreen',
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getLatestNews();
      getLatestGift();
      getMyProfile();
    });
  }, [route]);

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#272727'}}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{
          flex: 1,
        }}>
        <Gap height={40} />
        {/* Header */}
        <View
          style={[
            styles.container,
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <View style={{width: '33%'}}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Image
                source={require('../assets/images/menu.png')}
                style={{width: 35, height: 35}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '33%',
              justifyContent: 'center',
              flexDirection: 'row',
            }}></View>

          <View
            style={{
              width: '33%',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            {user && user.photo ? (
              <Pressable
                onPress={() => navigation.navigate('Dashboard')}
                style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: BASE_URL + '/' + user.photo,
                  }}
                  resizeMode="contain"
                  style={{
                    borderRadius: 35,
                    width: 35,
                    height: 35,
                    borderColor: Colors.muted,
                    borderWidth: 1,
                    backgroundColor: Colors.light,
                    borderWidth: 1,
                    borderColor: Colors.light,
                  }}
                />
                <View style={{textAlign: 'right'}}>
                  <Text
                    style={{
                      color: '#fff',
                      marginLeft: 8,
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 15,
                    }}>
                    {user.first_name}
                  </Text>
                  <Text
                    style={{
                      color: '#FFDD9C',
                      marginLeft: 8,
                      textAlign: 'right',
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 14,
                    }}>
                    {user.point}
                  </Text>
                </View>
              </Pressable>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Dashboard');
                }}
                style={{}}>
                <Image
                  source={require('../assets/images/user-icon.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Gap height={50} />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: '50%',
            }}>
            <Image
              source={require('../assets/images/logo-gold.png')}
              style={{width: '100%'}}
              resizeMode="contain"
            />
            <Gap height={10} />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
              style={{
                minWidth: 68,
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignSelf: 'center',
                borderRadius: 7,
                borderWidth: 2,
                borderColor: '#FFDD9C'
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                  fontSize: 10,
                  borderRadius: 7,
                  color: '#FFDD9C'
                }}>
                {state.get().level} {'\n'} MEMBER
              </Text>
            </LinearGradient>
          </View>
          <View
            style={{
              width: '50%',
              alignContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Book Table');
              }}>
              <LinearGradient
                colors={['#FFDD9C', '#BC893C']}
                style={{
                  borderRadius: 2,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 80,
                  paddingHorizontal: 15,
                  display: 'flex',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: '#0D0D0D',
                    fontWeight: '500',
                    fontFamily: 'Montserrat-SemiBold',
                    width: '75%',
                    // backgroundColor: 'red',
                    //backgroundColor: 'red',
                    height: 80,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 30,
                  }}>
                  BOOK A TABLE
                </Text>
                <Image
                  source={require('../assets/images/reserved.png')}
                  style={{
                    width: 32,
                    height: 32,
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>

           
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Member Card');
              }}>
              <LinearGradient
                colors={['#FFDD9C', '#BC893C']}
                style={{
                  borderRadius: 2,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 80,
                  paddingHorizontal: 15,
                  display: 'flex',
                  marginBottom: 10, 
                }}>
                <Text
                  style={{
                    color: '#0D0D0D',
                    fontWeight: '500',
                    fontFamily: 'Montserrat-SemiBold',
                    width: '75%',
                    // backgroundColor: 'red',
                    //backgroundColor: 'red',
                    height: 80,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 30,
                  }}>
                  MEMBERSHIP
                </Text>
                <View style={{
                  position: 'absolute',
                  top: 0,
                  right: -35,
                  transform: [{
                    rotate: '45deg'
                  }],
                  zIndex: -1
                }}>
                  <Image
                    source={require('../assets/images/qr-code.png')}
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={require('../assets/images/pattern-bg.png')}
          style={{width: '100%', marginTop: -70, marginBottom: -40, zIndex: -1}}
        />
        <View style={{paddingHorizontal: 31}}>
          {/* Member Card */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <View style={{width: '49%'}}>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <LinearGradient
                  colors={['#FFDD9C', '#BC893C']}
                  useAngle={true}
                  angle={150}
                  style={{
                    position: 'relative',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    minHeight: 40,
                    borderRadius: 4,
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#272727',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    DELIVERY SERVICE
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{width: '49%'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Add Review')}>
                <LinearGradient
                  colors={['#FFDD9C', '#BC893C']}
                  useAngle={true}
                  angle={150}
                  style={{
                    position: 'relative',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    minHeight: 40,
                    borderRadius: 4,
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#272727',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    FEEDBACK
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Gap height={30} />
          </View>

          {/* Menu Icons */}
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              {/* <View style={{width: 80}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Shop');
                  }}>
                  <Image
                    source={require('../assets/images/delivery-icon.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View> */}
              <View style={{width: '25%'}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Branch Map')}>
                  <Image
                    source={require('../assets/images/pin-icon.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    color: '#fff',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  LOCATION
                </Text>
              </View>
              <View style={{width: '25%'}}>
                <TouchableOpacity
                  onPress={() => {
                    openInAppBrowser('https://myshisha.id');
                  }}>
                  <Image
                    source={require('../assets/images/bag-icon.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    color: '#fff',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  SHOP
                </Text>
              </View>

              <View style={{width: '25%'}}>
                <TouchableOpacity
                  onPress={() => {
                    openInAppBrowser(
                      'https://taplink.cc/edenhookahclub',
                    );
                  }}>
                  <Image
                    source={require('../assets/images/social-media.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    color: '#fff',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  SOCIAL
                </Text>
              </View>

              <View style={{width: '25%'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('About');
                  }}>
                  <Image
                    source={require('../assets/images/web-icon.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    color: '#fff',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  WEBSITE
                </Text>
              </View>

              {/* <View style={{width: 80}}>
                <TouchableOpacity
                  onPress={() => {
                    openInAppBrowser(
                      'https://www.facebook.com/eden.hookahclub/',
                    );
                  }}>
                  <Image
                    source={require('../assets/images/facebook.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#fff', marginTop: 5, textAlign: 'center'}}>FACEBOOK</Text>
              </View> */}
            </View>
          </View>
        </View>

        <Gap height={40} />
      </ImageBackground>

      <Gap height={40} />

      <View style={{paddingHorizontal: 31}}>
        <View
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginBottom: 5,
              color: '#fff',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            {i18n.t('news.promotion', {lng: currentLang.get()})}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Blogs')}>
            <Text
              style={{
                marginBottom: 5,
                color: '#fff',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {i18n.t('all', {lng: currentLang.get()})}
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={13} />

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {!isLatestNewsLoading ? (
            latestNews.map((post, index) => (
              <View
                style={{
                  width: '49%',
                }}
                key={post.id}>
                <View style={{backgroundColor: '#30312D'}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Detail Article', {
                        postId: post.id,
                      })
                    }>
                    <Image
                      source={ArticleAction.thumbnail(post.thumbnail)}
                      style={{
                        width: '100%',
                        flex: 1,
                        height: 100,
                        backgroundColor: '#fff',
                      }}
                      resizeMode="cover"
                    />
                    <View style={{padding: 14}}>
                      <Text
                        style={{
                          fontSize: 9,
                          fontFamily: 'Montserrat-Regular',
                          color: '#fff',
                        }}>
                        {post.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <>
              <ActivityIndicator />
            </>
          )}
        </View>
        <Gap height={20} />
        {/* Book Table */}
        {/* <View
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginBottom: 5,
              color: '#fff',
              fontFamily: 'Montserrat-Bold',
            }}>
            {i18n.t('book.a.table', {lng: currentLang.get()})}
          </Text>
        </View> */}
        {/* <Gap height={13} />
        <TouchableOpacity onPress={() => navigation.navigate('Book Table')}>
          <ImageBackground
            source={require('../assets/images/book-table-bg.png')}
            style={{height: 120, width: '100%'}}
            imageStyle={{borderRadius: 8}}
          />
        </TouchableOpacity> */}
        <Gap height={20} />
        <View
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginBottom: 5,
              color: '#fff',
              fontFamily: 'Montserrat-Bold',
            }}>
            {i18n.t('gifts.for.point', {lng: currentLang.get()})}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Redeem')}>
            <Text
              style={{
                marginBottom: 5,
                color: '#fff',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {i18n.t('all', {lng: currentLang.get()})}
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={12} />

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {!isLatestGiftLoading ? (
            latestGift.map((post, index) => (
              <View
                style={{width: '33%', position: 'relative', paddingRight: 10}}
                key={post.id}>
                <TouchableOpacity
                  style={{position: 'relative'}}
                  onPress={() =>
                    navigation.navigate('Detail Gift', {
                      giftId: post.id,
                    })
                  }>
                  <Text
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 20,
                      color: '#333333',
                      zIndex: 10,
                      backgroundColor: '#FFDD9C',
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      fontWeight: '600',
                    }}>
                    {post.point}
                  </Text>
                  <ImageBackground
                    source={{
                      uri: BASE_URL + '/' + post.thumbnail,
                    }}
                    style={{width: '100%', borderRadius: 4, height: 150}}
                    imageStyle={{borderRadius: 4}}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <Gap height={30} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    fontSize: 16,
  },
  enteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputSearch: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: Colors.dark,
  },
  badge: {
    fontSize: 10,
    marginRight: 5,
    backgroundColor: Colors.light,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export default HomeScreen;
