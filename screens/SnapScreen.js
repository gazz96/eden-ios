import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {API_URL} from '../constant';

import {UserContext} from '../context';
import WebViewWeb from '../components/WebviewWeb';
import {WebView} from 'react-native-webview'; 

const SnapScreen = ({route, navigation}) => {
  const {orderId, order} = route.params;

  let authUser = UserContext();
//   let url = `${API_URL}/order/gateway?user_id=${
//     authUser.get().id
//   }&order_id=${orderId}`;
//   console.log('url', url);
  const onMessage = event => {
    let data = event.nativeEvent.data;
    if(data == "finish") {
        navigation.navigate("My Order")
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if(!order) {
        navigation.goBack()
      }
    });
  });

  const INJECTED_JAVASCRIPT = `(function() {
       

    })();`;

  return (
    <SafeAreaView style={{flex: 1}}>
    <WebView
        injectedJavaScript={INJECTED_JAVASCRIPT}
      source={{
        html: `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script type="text/javascript"
                    src="https://app.sandbox.midtrans.com/snap/snap.js"
                    data-client-key="SB-Mid-client-eSAUT6KP8gpZ2yi-"></script>
        </head>
        <body>
            <script type="text/javascript">
                let message = "";
                let token = "${order.token}"
                let status = "";
                snap.pay(token, {
                onSuccess: function(result){
                    console.log('success');console.log(result); status = "finish"; snap.hide();
                },
                onPending: function(result){console.log('pending');console.log(result); status = "finish"; snap.hide();},
                onError: function(result){console.log('error');console.log(result); status = "finish"; snap.hide();},
                onClose: function(){console.log('customer closed the popup without finishing the payment'); status = "finish"; snap.hide();}
                })

                window.addEventListener("message", function(){
                    window.ReactNativeWebView.postMessage(status);
                });

                //window.ReactNativeWebView.postMessage(status);
               
            </script>
        </body>
        </html>
        `,
      }}
      onMessage={onMessage}
    />
    </SafeAreaView>
  );
};

export default SnapScreen;

const styles = StyleSheet.create({});
