import { StyleSheet, Text, View, ScrollView, Pressable, Image, ActivityIndicator, FlatList, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL, Colors, Rp, UPLOAD_URL } from '../constant';
import { ProductAction } from '../actions';

//Components
import { BadgeItem, Gap, HeaderWithBackButton, PropertiInlineCard } from '../components';

import { ShopContext } from '../context';
import LinearGradient from 'react-native-linear-gradient';
import {UserContext} from '../context';


const FavoritesScreen = ({route, navigation }) => {

    const authUser = UserContext();
    const [isLoading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const shopSearchParams = ShopContext();
    
    const getFavorites = async(params = {}) => {
       
        setLoading(true)
        setFavorites([])
        try {
            const response = await ProductAction.favorites({
                user_id: authUser.get().id
            })
            setFavorites(response);
            return response.data;
        }catch(error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const onRefresh = React.useCallback(() => {
        getFavorites();
      }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getFavorites({
              user_id: authUser.get().id
          });
        
      }, [navigation]);
    }, [])

    const productThumbnail = (image) => {
        return {
            uri: BASE_URL + '/' + image
        }
    }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  


  return (
    <LinearGradient colors={['#272727', '#13140D']} style={styles.container}>
      <ImageBackground source={require('../assets/images/long-background.png')} resizeMode="cover" style={{width: '100%', flex: 1, height: '100%'}}>
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>
        }>
          <View style={{ paddingHorizontal: 20 }}>
            <Gap height={20}/>
            <HeaderWithBackButton onPress={() => goBack(navigation)} title={'FAVORITE'}/>
            <Gap height={25}/>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {
              isLoading ? <ActivityIndicator/> : favorites.map((favorite, index) => {
                return (
                
                <TouchableOpacity key={favorite.product.id} style={{ width: '50%', marginBottom: 20, paddingRight: 8 }} onPress={() => {
                  navigation.navigate('Detail Product', {
                    productId: favorite.product.id
                  })
                }}>
                  <View style={{ borderColor: 'rgba(255, 221, 156, 1)', borderWidth: 2, borderRadius: 5 }}>
                    <Image source={productThumbnail(favorite.product.thumbnail)} style={{width: '100%', height: 115}} resizeMode="cover"/>
                    <View style={{backgroundColor: '#30312D', padding: 11, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                      <Text style={{fontSize: 12, fontFamily: 'Montserrat-Bold', marginBottom: 5, color: '#fff'}}>{favorite.product.name}</Text>
                      <Text style={{fontSize: 12, fontFamily: 'Montserrat-Bold', marginBottom: 10, color: '#fff'}}>{Rp(favorite.product.price)}</Text>
                      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="star"/>
                        <Text style={{marginLeft: 5}}>4.9</Text>
                      </View> */}
                    </View>
                  </View>
                </TouchableOpacity>
                    
                )
              })
            }
            </View>
          </View>
          <Gap height={20}/>
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
    
  )
}

export default FavoritesScreen

const goBack = (navigation) => {
  navigation.goBack()
}

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
    justifyContent: 'center'
  },

})