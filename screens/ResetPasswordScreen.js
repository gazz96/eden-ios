import { StyleSheet, Text, View, Image, TextInput, Pressable, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, logoSrc } from '../constant'
import Gap from '../components/Gap'
import { SessionAction, AuthAction } from '../actions'

import { UserContext } from '../context';

import Toast from 'react-native-toast-message';

const ResetPasswordScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('bagas.topati@gmail.com');
//   const [password, setPassword] = useState('bagas');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setLoading] = useState(false);

  const state = UserContext()

  const resetPassword = async() => {
    setLoading(true)
    try {
        const response = await AuthAction.resetPassword({
            email: email,
            reset_password_token: token,
            password: password
        });

        console.log(response);

        if(response.user) 
        {
            Toast.show({
                type: 'success',
                text1: 'Information',
                text2: 'Berhasil memperbaharui password.'
            });
        }else {
            Toast.show({
                type: 'error',
                text1: 'Information',
                text2: 'Token sudah expired'
            });
        }

        setEmail('')
        setToken('')
        setPassword('')
    }
    catch(error) 
    {
        console.log('error reset password', error);
        Toast.show({
            type: 'error',
            text1: 'Peringatan',
            text2: 'Data tidak ditemukan'
        });
    }finally {
        setLoading(false)
    }

    
  }

  const requestResetPasswordToken = async() => {
    setLoading(true)
    try {    
        const response = await AuthAction.sendTokenResetPassword({
            email: email
        });
        
        Toast.show({
            type: 'success',
            text1: 'Information',
            text2: 'Token sudah dikirim ke email anda'
        });
     
    } catch(error) {
        
        console.log('error requestResetPasswordToken', error);
        Toast.show({
            type: 'error',
            text1: 'Peringatan',
            text2: 'Data tidak ditemukan'
        });
    }finally {
        setLoading(false)
    }

    
  }

  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
            <Gap height={40}/>
            <Image source={logoSrc} style={styles.logo} resizeMode="contain"/>
            <Gap height={80}/>
            
            <View style={{ width: '100%'}}>
                <Text style={styles.title}>Reset Kata Sandi</Text>
                <Gap height={30}/>
                <View>
                    <Text style={styles.formLabel}>Email</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '75%'}}>
                            <TextInput style={[styles.formControl]} onChangeText={newEmail => setEmail(newEmail)} value={email}/>
                        </View>
                        <Text style={{backgroundColor: Colors.primary, color: Colors.white, borderRadius: 10, padding: 10, width: '20%', display: 'flex', textAlign: 'center', }} onPress={() => {
                            requestResetPasswordToken();
                        }}>Cek</Text>
                    </View>
                    <Text style={{color: Colors.dark, fontSize: 10, marginTop: 3}}>Cek untuk mendapatkan token reset password</Text>
                </View>
                <Gap height={20}/>
                <View>
                    <Text style={styles.formLabel}>Token</Text>
                    <TextInput style={styles.formControl} onChangeText={newToken => setToken(newToken)} value={token}/>
                </View>
                <Gap height={20}/>
                <View>
                    <Text style={styles.formLabel}>Masukan Password Baru</Text>
                    <TextInput style={styles.formControl} onChangeText={newPassword => setPassword(newPassword)} value={password} secureTextEntry={true}/>
                </View>

                <Gap height={20}/>
        
                <Pressable onPress={() => {
                    resetPassword()
                }}>
                    <Text style={styles.btnPrimary}>Reset Password</Text>
                </Pressable>
                
                <Gap height={12}/>
                <TouchableOpacity style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}} onPress={()=>{navigation.goBack()}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14, color: '#828282'}}>Sudah punya akun ?</Text>
                </TouchableOpacity>
                <Gap height={180}/>
            </View>
        </View>
        
    </ScrollView>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    logo: {
        width: 110,
        height: 110
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222'
    },
    formLabel: {
        fontSize: 12, 
        marginBottom: 4,
        color: '#222'
    },
    formControl: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 16,
        color: Colors.dark
    },
    btnPrimary: {
        borderRadius: 10,
        color: '#fff',
        backgroundColor: Colors.primary,
        height: 40,
        lineHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})