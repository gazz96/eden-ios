import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    ImageBackground,
    Image
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {Gap, HeaderWithBackButton, Loading} from '../components';
  import OrderInlineCard from '../components/OrderInlineCard';
  import {BASE_URL, Colors, Rp} from '../constant';
  import {UserAction} from '../actions';
  import {UserContext} from '../context';
  import LinearGradient from 'react-native-linear-gradient';
  import { TouchableOpacity } from 'react-native';
import { useHookstate } from '@hookstate/core';
  
  const MyOrderDetailScreen = ({route, navigation}) => {
    const { order } = route.params;
    const [isLoading, setLoading] = useState(false);
  
    const state = UserContext();
    const total = useHookstate(0);

  
    const productThumbnail = image => {
        return {
          uri: BASE_URL + '/' + image,
        };
      };
    
    useEffect(() => {
        total.set(0)
    }, [])
  
    return (
      <LinearGradient colors={['#272727', '#13140D']} style={styles.container}>
        <ImageBackground
          source={require('../assets/images/long-background.png')}
          resizeMode="cover"
          style={{width: '100%', flex: 1, height: '100%'}}>
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: 20,
            }}>
            <Gap height={20} />
            <HeaderWithBackButton
              onPress={() => navigation.goBack()}
              title={''}
            />
            <Gap height={25} />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                color: '#fffff0',
              }}>
              CUSTOMER DETAIL
            </Text>
            <Gap height={20} />
            <View>
              <Text style={{fontFamily: 'Montserrat-Semibold', color: '#fff'}}>Name: {order.first_name} {order.last_name}</Text>
            </View>
            <View>
              <Text style={{fontFamily: 'Montserrat-Semibold', color: '#fff'}}>Phone Number: {order.phone_number}</Text>
            </View>
            <View>
              <Text style={{fontFamily: 'Montserrat-Semibold', color: '#fff'}}>Address: {order.address}</Text>
            </View>

            <Gap height={20} />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                color: '#fffff0',
              }}>
              ORDER DETAIL
            </Text>
            <Gap height={20} />
            
            {/* <TextInput placeholder='Cari pesanan' style={{
              color: '#222',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingHorizontal: 15,
              paddingVertical: 10
            }} onChangeText={newText => setKeyword(newText)} onEndEditing={() => {
              getMyOrders();
            }}/> */}
            <Gap height={20} />
            <View>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                
                order.items.map((cart, index) => {
                    total.set(p => p + (cart.price * cart.qty))
                    return (
                        <TouchableOpacity
                        key={JSON.parse(cart.product).id}
                        style={{width: '100%', marginBottom: 20, paddingRight: 8}}>
                        <View
                            style={{
                            borderColor: 'rgba(255, 221, 156, 1)',
                            borderWidth: 2,
                            borderRadius: 5,
                            flexDirection: 'row',
                            }}>
                            <Image
                            source={productThumbnail(JSON.parse(cart.product).thumbnail)}
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
                                {JSON.parse(cart.product).name} x{Rp(cart.qty)}
                            </Text>
                            <Text
                                style={{
                                fontSize: 12,
                                fontFamily: 'Montserrat-Bold',
                                marginBottom: 10,
                                color: '#fff',
                                }}>
                                Rp {Rp(cart.price)}
                            </Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    )
                })
              )}
            </View>
          </ScrollView>
          <View style={{backgroundColor: '#fff', padding: 20}}>
            <Text style={{color: '#222', fontFamily: 'Montserrat-Bold', fontSize: 16}}>TOTAL Rp {Rp(total.get())}</Text>
          </View>
        </ImageBackground>
      </LinearGradient>
    );
  };
  
  export default MyOrderDetailScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
  });
  