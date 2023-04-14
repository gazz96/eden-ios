import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

import Toast from 'react-native-toast-message';
// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome5';
import {BASE_URL, Colors, Rp, UPLOAD_URL} from '../constant';
import {ProductAction} from '../actions';

//Components
import {
  BadgeItem,
  Gap,
  HeaderWithBackButton,
  PropertiInlineCard,
} from '../components';

import {ShopContext} from '../context';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import {useHookstate} from '@hookstate/core';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {UserContext} from '../context';

const CreateOrderScreen = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const shopSearchParams = ShopContext();

  const [timeDelivery, setTimeDelivery] = useState(new Date());
  const [openModalTimeDelivery, setOpenModalTimeDelivery] = useState(false);

  const [timePickup, setTimePickup] = useState(new Date());
  const [openModalTimePickup, setOpenModalTimePickup] = useState(false);
  const auth = UserContext();



  const form = useHookstate({
    user_id: auth.get().id,
    package: null,
    how_many_bowl: null,
    level_of_strength: null,
    flavour: null,
    mint_or_ice: null,
    comments: null,
    address: auth.get().address,
    time_of_delivery: null,
    time_of_pickup: null,
    amount: null
  });

  const packagePrice = {
    premium: {
      1: 225000,
      2: 400000,
      3: 600000
    },
    elite: {
      1: 275000,
      2: 500000,
      3: 725000
    }
  }

  const packages = ['Premium', 'Elite'];
  const bowls = [1, 2, 3];
  const levelOfStrength = ['Medium', 'Strong'];
  const flavours = ['Fruits', 'Berries', 'Deserts', 'Drink', 'Spicy'];
  const minOrIce = ['Mint', 'Ice'];


  const messageInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const orderProduct = async () => {
    setLoading(true);
    try {
      const response = await ProductAction.order(form.get());
      console.log(response);
      navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        if (error.response.status == 422) {
          let errors = error.response.data.errors;
          for (let err in errors) {
            console.log(err);
            for (let message in errors[err]) {
              console.log('messagees', errors[err][message]);
              Toast.show({
                type: 'error',
                text1: 'Warning',
                text2: errors[err][message],
              });
            }
          }
        }

        if (error.response.status == 404) {
          let errors = error.response.data.errors;
          for (let err in errors) {
            Toast.show({
              type: 'error',
              text1: 'Warning',
              text2: errors[err],
            });
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        form.time_of_delivery.set(moment(timeDelivery).format('YYYY-MM-DD HH:mm'))
        form.time_of_pickup.set(moment(timePickup).format('YYYY-MM-DD HH:mm'))
      },
      [navigation],
    );
  }, []);

  const productThumbnail = image => {
    return {
      uri: BASE_URL + '/' + image,
    };
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <LinearGradient colors={['#272727', '#13140D']} style={styles.container}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{width: '100%', flex: 1, height: '100%'}}>
        <ScrollView style={styles.container}>
          <View style={{paddingHorizontal: 20}}>
            <Gap height={20} />
            <HeaderWithBackButton
              onPress={() => goBack(navigation)}
              title={'DELIVERY ORDER'}
            />
            <Gap height={25} />
            {
              isLoading ? <ActivityIndicator/> : <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  Select Package
                </Text>
                <SelectDropdown
                  data={packages}
                  defaultButtonText="Select Package"
                  buttonStyle={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderRadius: 15,
                    paddingLeft: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                  }}
                  dropdownStyle={{}}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    form.package.set(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  How many bowl
                </Text>
                <SelectDropdown
                  data={bowls}
                  defaultButtonText="How many bowl"
                  buttonStyle={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderRadius: 15,
                    paddingLeft: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                  }}
                  dropdownStyle={{}}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    form.how_many_bowl.set(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  Level of strength
                </Text>
                <SelectDropdown
                  data={levelOfStrength}
                  defaultButtonText="Level of strength"
                  buttonStyle={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderRadius: 15,
                    paddingLeft: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                  }}
                  dropdownStyle={{}}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    form.level_of_strength.set(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  Flavour
                </Text>
                <SelectDropdown
                  data={flavours}
                  defaultButtonText="Select Flavour"
                  buttonStyle={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderRadius: 15,
                    paddingLeft: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                  }}
                  dropdownStyle={{}}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    form.flavour.set(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  Add mint or ice
                </Text>
                <SelectDropdown
                  data={minOrIce}
                  defaultButtonText="Select"
                  buttonStyle={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderRadius: 15,
                    paddingLeft: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                  }}
                  dropdownStyle={{}}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    form.mint_or_ice.set(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FFFFF0',
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    messageInputRef.current.focus();
                  }}>
                  Your Comments:{' '}
                </Text>
                <TextInput
                  ref={messageInputRef}
                  multiline={true}
                  onChangeText={text => form.comments.set(text)}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1,
                    height: 100,
                    fontFamily: 'Montserrat-Regular',
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: '#fff',
                  }}
                />
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FFFFF0',
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    addressInputRef.current.focus();
                  }}>
                  Your Address:{' '}
                </Text>
                <TextInput
                  ref={addressInputRef}
                  multiline={true}
                  onChangeText={text => form.address.set(text)}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1,
                    height: 100,
                    fontFamily: 'Montserrat-Regular',
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: '#fff',
                  }}
                />
                <Text style={{color: '#eee', marginTop:5, fontFamily: 'Montserrat-Regular'}}>Note : Delivery order apply on 5 km radius from our store, more than 5km will be charge 30K IDR for every 3 km and multiples.</Text>
              </View>
              <Gap height={30} />
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FFFFF0',
                    marginBottom: 5,
                  }}>
                  Time of delivery
                </Text>
                <Text
                  style={{
                    backgroundColor: '#eee',
                    padding: 15,
                    textAlign: 'center',
                    width: '100%',
                    borderRadius: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                    fontSize: 18,
                    overflow: 'hidden',
                  }} onPress={() => {
                    setOpenModalTimeDelivery(true)
                  }}>
                  {form.time_of_delivery.get()}
                </Text>

                <DatePicker
                  date={timeDelivery}
                  onDateChange={setTimeDelivery}
                  mode="datetime"
                  fadeToColor="#eee"
                  textColor="#A3A3A3"
                  modal={true}
                  open={openModalTimeDelivery}
                  style={{fontFamily: 'Montserrat-SemiBold'}}
                  onConfirm={(date) => {
                    
                    form.time_of_delivery.set(moment(date).format('YYYY-MM-DD HH:mm'))
                    setOpenModalTimeDelivery(false)
                  }}
                  onCancel={() => {
                    setOpenModalTimeDelivery(false)
                  }}
                />
              </View>
              <Gap height={30} />

              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FFFFF0',
                    marginBottom: 5,
                  }}>
                  Time of pickup
                </Text>
                <Text
                  style={{
                    backgroundColor: '#eee',
                    padding: 15,
                    textAlign: 'center',
                    width: '100%',
                    borderRadius: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#A3A3A3',
                    fontSize: 18,
                    overflow: 'hidden',
                  }} onPress={() => {
                    setOpenModalTimePickup(true)
                  }}
                  >
                  {form.time_of_pickup.get()}
                </Text>

                <DatePicker
                  date={timePickup}
                  onDateChange={setTimePickup}
                  mode="datetime"
                  fadeToColor="#eee"
                  textColor="#A3A3A3"
                  modal={true}
                  open={openModalTimePickup}
                  style={{fontFamily: 'Montserrat-SemiBold'}}
                  onConfirm={(date) => {
                    form.time_of_pickup.set(moment(date).format('YYYY-MM-DD HH:mm'))
                    setOpenModalTimePickup(false)
                  }}
                  onCancel={() => {
                    setOpenModalTimePickup(false)
                  }}
                />
              </View>
              <Gap height={30} />
              <View>
                <Text style={{color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: 20}}>Total</Text>
                <Text style={{color: '#fff', fontFamily: 'Montserrat-SemiBold', fontSize: 24}}>Rp
                {
                  form.package.get() && form.how_many_bowl.get() ? Rp(packagePrice[(form.package.get()).toLowerCase()][form.how_many_bowl.get()]) : 0
                }
                  
                </Text>
              </View>
              <Gap height={30} /> 
              <TouchableOpacity
                onPress={() => {
                }}
                style={{width: '100%'}}>
                <LinearGradient
                  colors={['#FFDD9C', '#BC893C']}
                  style={{borderRadius: 15}}>
                    <Text style={styles.btnPrimary} onPress={() => {
                      orderProduct()
                    }}>PLACE ORDER</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Gap height={30} />
            </View>
            }
            
          </View>
          <Gap height={20} />
          {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => {
                setPage(page => page - 1)
                getProperties({
                  page: page,
                });
              }} style={styles.btnLoadMore}>
              <Icon name={'chevron-left'} size={12} solid color={'#fff'}/>
              <Text style={{color: Colors.white, marginLeft: 10}}>Sebelumnya</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setPage(page => page + 1)
                getProperties({
                  page: page,
                });
              }} style={styles.btnLoadMore}>
              <Text style={{color: Colors.white, marginRight: 10}}>Selanjutnya</Text>
              <Icon name={'chevron-right'} size={12} solid color={'#fff'}/>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
};

export default CreateOrderScreen;

const goBack = navigation => {
  navigation.goBack();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnLoadMore: {
    backgroundColor: Colors.primary,
    color: '#fff',
    height: 30,
    borderRadius: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    width: 120,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
