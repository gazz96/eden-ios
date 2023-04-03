import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {HeaderWithBackButton, Gap} from '../components';
import {Rating} from 'react-native-ratings';
import {Colors} from '../constant';
import {UserContext} from '../context';
import {hookstate, useHookstate} from '@hookstate/core';
import {OrderAction, BranchAction, ReviewAction} from '../actions';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';

import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AddReviewScreen = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const userState = UserContext();

  const formState = useHookstate({
    branch_id: '',
    user_id: userState.get().id,
    service_rating: 0,
    food_rating: 0,
    shisha_quality_rating: 0,
    message: '',
  });

  const createReview = async () => {
    try {
      setLoading(true);
      //formState.user_id.set(userState.get().id);
      console.log('formState', formState.get());
      const response = await ReviewAction.create(formState.get());
      Toast.show({
        type: 'success',
        text1: 'Berhasil memberikan review',
      });
      formState.service_rating.set(0);
      formState.food_rating.set(0);
      formState.shisha_quality_rating.set(0);
      formState.branch_id.set('');
      formState.message.set('');
    } catch (error) {
      console.log('errors', error);
      let errors = error.response.data.errors ?? [];
      for (let error in errors) {
        let messages = errors[error];
        messages.map(message => {
          Toast.show({
            type: 'error',
            text1: message,
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBranch = async () => {
    let response = await BranchAction.list();
    setBranches(response.data);
  };

  useEffect(() => {
    loadBranch();
  }, []);

  return (
    <LinearGradient colors={['#272727', '#13140D']} style={styles.container}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{width: '100%', flex: 1, height: '100%'}}>
        <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
          <Gap height={25} />
          <HeaderWithBackButton title="" onPress={() => navigation.goBack()} />
          <Gap height={20} />
          <Text
            style={{
              color: Colors.secondary,
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 20,
              color: '#FFFFF0',
            }}>
            REVIEWS
          </Text>
          <Gap height={55} />
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View>
                <View>
                  <Text
                    style={{
                      color: Colors.secondary,
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 16,
                      color: '#FFFFF0',
                    }}>
                    SERVICES
                  </Text>
                  <Gap height={20} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Stars
                      default={1}
                      count={5}
                      half={false}
                      starSize={100}
                      update={val => {
                        formState.service_rating.set(val);
                      }}
                      fullStar={
                        <Icon name={'star'} color="#FFDD9C" solid size={30} />
                      }
                      emptyStar={
                        <Icon name={'star'} color="#fff" solid size={30} />
                      }
                    />
                  </View>
                </View>
                <Gap height={20} />
                <View>
                  <Text
                    style={{
                      color: Colors.secondary,
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 16,
                      color: '#FFFFF0',
                    }}>
                    FOOD
                  </Text>
                  <Gap height={20} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Stars
                      default={1}
                      count={5}
                      half={false}
                      starSize={100}
                      update={val => {
                        formState.food_rating.set(val);
                      }}
                      fullStar={
                        <Icon name={'star'} color="#FFDD9C" solid size={30} />
                      }
                      emptyStar={
                        <Icon name={'star'} color="#fff" solid size={30} />
                      }
                    />
                  </View>
                </View>
                <Gap height={20} />
                <View>
                  <Text
                    style={{
                      color: Colors.secondary,
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 16,
                      color: '#FFFFF0',
                    }}>
                    SHISA QUALITY
                  </Text>
                  <Gap height={20} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Stars
                      default={1}
                      count={5}
                      half={false}
                      starSize={100}
                      update={val => {
                        formState.shisha_quality_rating.set(val);
                      }}
                      fullStar={
                        <Icon name={'star'} color="#FFDD9C" solid size={30} />
                      }
                      emptyStar={
                        <Icon name={'star'} color="#fff" solid size={30} />
                      }
                    />
                  </View>
                </View>
                <Gap height={20} />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#FFFFF0',
                  }}>
                  Leave a review
                </Text>
                <Gap height={20} />

                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#FFFFF0',
                    }}>
                    Branch:
                  </Text>
                  <Gap height={5} />
                  <SelectDropdown
                    data={branches}
                    search={true}
                    defaultButtonText=" "
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      width: '100%',
                      borderBottomColor: 'rgba(255, 221, 156, 1)',
                      borderBottomWidth: 1,

                      paddingLeft: 0,
                    }}
                    buttonTextStyle={{
                      color: '#ffffff',
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                    }}
                    dropdownStyle={{}}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      formState.branch_id.set(selectedItem.id);
                      return selectedItem.name;
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.name;
                    }}
                  />
                </View>
                <Gap height={20} />

                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#FFFFF0',
                    }}>
                    Your Comment:{' '}
                  </Text>
                  <TextInput
                    onChangeText={text => formState.message.set(text)}
                    style={{
                      borderBottomColor: 'rgba(255, 221, 156, 1)',
                      borderBottomWidth: 1,

                      fontFamily: 'Montserrat-Regular',
                      color:"#fffff0"
                    }}
                  />
                </View>
                <Gap height={20} />

                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Montserrat-Regular',
                      color: '#838282',
                      lineHeight: 25,
                    }}>
                    You can add the comment. Only management will see your
                    review
                  </Text>
                  <Gap height={20} />
                  <TouchableOpacity onPress={() => createReview()}>
                    <LinearGradient
                      colors={['#FFDD9C', '#BC893C']}
                      style={{borderRadius: 15}}>
                      <Text style={styles.btnPrimary}>Done</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <Gap height={20} />
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formTextarea: {
    minHeight: 100,
    borderColor: Colors.muted,
    borderRadius: 10,
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    color: Colors.dark,
  },
  formLabel: {
    fontSize: 12,
    color: Colors.dark,
    fontWeight: 'bold',
    marginBottom: 5,
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
