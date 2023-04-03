import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {BASE_URL, Colors} from '../constant';
import {Gap} from '../components';

import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';

import {BranchAction, ReservationAction} from '../actions';
import {useHookstate} from '@hookstate/core';
import moment from 'moment';
import { UserContext } from '../context';

const BookTableScreen = ({navigation}) => {
  const [branches, setBranches] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const userState = UserContext();

  const formState = useHookstate({
    branch_id: null,
    user_id: userState.get().id,
    name: null,
    number_of_guest: null,
    reservation_date: null,
    reservation_time: null,
    description: null,
    phone: null,
  });

  const loadBranch = async () => {
    try {
      let response = await BranchAction.list();
      setBranches(response.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const createReservation = async () => {
    setLoading(true);

    try {
      if (date) {
        let localDate = moment(date).format('YYYY-MM-DD')
        let localTime = moment(date).format('HH:mm:ss')
        formState.reservation_date.set(localDate)
        formState.reservation_time.set(localTime)
      }

      const response = await ReservationAction.create(formState.get());

      formState.set({
        branch_id: null,
        user_id: 1,
        name: null,
        number_of_guest: null,
        reservation_date: null,
        reservation_time: null,
        description: null,
        phone: null,
      });

      Toast.show({
        type: 'success',
        text1: 'Berhasil melakukan reservasi',
      });

      


    } catch (error) {
      console.log('errors', error.response);
      let errors = error.response.data?.errors ?? [];
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

  useEffect(() => {
    loadBranch();
  }, []);

  return (
    <LinearGradient colors={['#272727', '#13140D']} style={styles.container}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{width: '100%', flex: 1, height: '100%'}}>
        <ScrollView style={{flex: 1}}>
          <Pressable
            style={{paddingHorizontal: 20, paddingVertical: 30}}
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
          {loading ? (
            <ActivityIndicator />
          ) : (<>
          <View style={{padding: 20}}>
            <View>
              <Text
                style={{
                  color: '#FFDD9C',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 20,
                }}>
                BOOK A TABLE
              </Text>
              <Gap height={20} />
              <Text
                style={{
                  color: '#FFFFF0',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 14,
                  lineHeight: 30,
                  letterSpacing: 0.8,
                }}>
                Request for table reservations are accepted at least 1 hours
                before the desired visit time
              </Text>
            </View>

            <Gap height={30} />
            <SelectDropdown
              data={branches}
              search={true}
              defaultValueByIndex="0"
              defaultButtonText="Select Branch"
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
                formState.branch_id.set(selectedItem.id);
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item.name;
              }}
            />
            <Gap height={30} />
            <TextInput
              style={styles.formControl}
              placeholder="Name"
              placeholderTextColor="#A3A3A3"
              onChangeText={text => formState.name.set(text)}
              defaultValue={formState.name.get()}
            />
            <Gap height={30} />
            <TextInput
              style={styles.formControl}
              placeholder="Phone"
              placeholderTextColor="#A3A3A3"
              onChangeText={text => formState.phone.set(text)}
              keyboardType="number-pad"
            />
            <Gap height={30} />
            <View
              style={{backgroundColor: '#eee', padding: 20, borderRadius: 15}}>
              <DatePicker
                date={date}
                onDateChange={setDate}
                mode="datetime"
                fadeToColor="#eee"
                textColor="#A3A3A3"
                style={{fontFamily: 'Montserrat-SemiBold'}}
              />
            </View>
            <Gap height={30} />
            <TextInput
              style={styles.formControl}
              placeholder="Number of guest"
              placeholderTextColor="#A3A3A3"
              keyboardType="number-pad"
              onChangeText={text => formState.number_of_guest.set(text)}
              defaultValue=""
            />
            <Gap height={30} />
            <TextInput
              style={styles.formControl}
              placeholder="Notes"
              placeholderTextColor="#A3A3A3"
              onChangeText={text => formState.description.set(text)}
            />
            <Gap height={30} />

            <TouchableOpacity
              onPress={() => {
                createReservation();
              }}
              style={{width: '100%'}}>
              <LinearGradient
                colors={['#FFDD9C', '#BC893C']}
                style={{borderRadius: 15}}>
                {loading ? (
                  <Text style={styles.btnPrimary}>Loading...</Text>
                ) : (
                  <Text style={styles.btnPrimary}>BOOK NOW</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </>)}
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
};

export default BookTableScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  formControl: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 15,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    color: Colors.dark,
    backgroundColor: '#eee',
    fontFamily: 'Montserrat-SemiBold',
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
