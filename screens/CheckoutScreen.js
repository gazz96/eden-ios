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
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {BASE_URL, Colors, Rp, UPLOAD_URL} from '../constant';
import {CartAction, ProductAction} from '../actions';

import {Gap, HeaderWithBackButton} from '../components';
import {UserContext} from '../context';
import LinearGradient from 'react-native-linear-gradient';
import {useHookstate} from '@hookstate/core';
import Toast from 'react-native-toast-message';

const CheckoutScreen = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const total = useHookstate(0);
  const auth = UserContext();

  const form = useHookstate({
    user_id: auth.get().id,
    name: auth.get().name,
    address: auth.get().address,
    phone_number: auth.get().phone_number
  });

  const getCarts = async (params = {}) => {
    setLoading(true);
    setCarts([]);
    try {
      const response = await CartAction.list({
        user_id: auth.get().id,
      });
      response.map(cart => {
        total.set(p => p +( cart.qty * cart.product.price ))
      })
      setCarts(response);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        getCarts();
      },
      [navigation],
    );
  }, []);

  const orderProduct = async () => {
    try {
      const response = await ProductAction.order(form.get());
      console.log(response);

      navigation.navigate('Gateway', {
        orderId: response.order.id,
        order: response.order,
      });

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
        <ScrollView style={styles.container} onScroll={({nativeEvent}) => {}}>
          <View style={{paddingHorizontal: 20}}>
            <Gap height={20} />
            <HeaderWithBackButton
              onPress={() => goBack(navigation)}
              title={''}
            />
            <Gap height={25} />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                color: '#fffff0',
              }}>
              CHECKOUT
            </Text>
            <Gap height={31} />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                color: '#fffff0',
              }}>
              ORDER SUMMARY
            </Text>
            <View>
              <Gap height={20} />
              <View>
                <TextInput
                  style={styles.formControl}
                  onChangeText={newText => form.name.set(newText)}
                  value={form.name.get()}
                  placeholder="Name"
                  placeholderTextColor="#A3A3A3"
                />
              </View>
              <Gap height={20} />
              <View>
                <TextInput
                  style={styles.formControl}
                  onChangeText={newText => form.phone_number.set(newText)}
                  value={form.phone_number.get()}
                  placeholder="Phone Number"
                  placeholderTextColor="#A3A3A3"
                />
              </View>
              <Gap height={20} />
              <View>
                <TextInput
                  style={styles.formControl}
                  onChangeText={newText => form.address.set(newText)}
                  value={form.address.get()}
                  placeholder="Shipping Address"
                  placeholderTextColor="#A3A3A3"
                  numberOfLines={4}
                  textAlignVertical={'top'}
                  multiline={true}
                />
              </View>
            </View>
            <Gap height={31} />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                color: '#fffff0',
              }}>
              ITEMS Rp {Rp(total.get())}
            </Text>
            <Gap height={20} />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                carts.map((cart, index) => {
                  return (
                    <TouchableOpacity
                      key={cart.product.id}
                      style={{width: '100%', marginBottom: 20, paddingRight: 8}}
                      onPress={() => {
                        navigation.navigate('Detail Product', {
                          productId: cart.product.id,
                        });
                      }}>
                      <View
                        style={{
                          borderColor: 'rgba(255, 221, 156, 1)',
                          borderWidth: 2,
                          borderRadius: 5,
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={productThumbnail(cart.product.thumbnail)}
                          style={{width: '40%', height: 115}}
                          resizeMode="cover"
                        />
                        <View
                          style={{
                            backgroundColor: '#30312D',
                            padding: 11,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            width: '60%',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: 'Montserrat-Bold',
                              marginBottom: 5,
                              color: '#fff',
                            }}>
                            {cart.product.name} x{Rp(cart.qty)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: 'Montserrat-Bold',
                              marginBottom: 10,
                              color: '#fff',
                            }}>
                            Rp {Rp(cart.product.price)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
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
        {carts.length > 0 ? (
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => {
                orderProduct();
                //navigation.navigate('Checkout');
              }}>
              <LinearGradient
                colors={['#FFDD9C', '#BC893C']}
                style={{borderRadius: 15}}>
                <Text style={styles.btnPrimary}>PLACE ORDER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </ImageBackground>
    </LinearGradient>
  );
};

export default CheckoutScreen;

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
  formControl: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 15,
    minHeight: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    color: Colors.dark,
    backgroundColor: '#eee',
    fontFamily: 'Montserrat-SemiBold',
  },
});
