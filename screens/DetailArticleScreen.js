import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {BASE_URL, Colors} from '../constant';
import {ArticleAction} from '../actions';
import Gap from '../components/Gap';
//import HTMLView from 'react-native-htmlview'

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome5';
import RenderHtml from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import {LangContext} from '../context';
const DetailArticleScreen = ({route, navigation}) => {
  const {postId} = route.params;
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true);
  const currentLang = LangContext();
  let getImage = image => {
    return {
      uri: BASE_URL + '/uploads/' + image,
    };
  };

  const getArticle = async () => {
    setLoading(true);
    try {
      const response = await ArticleAction.find(postId);
      setArticle(response);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  const {width} = useWindowDimensions();
  const tagsStyles = {
    body: {
      color: '#fff',
    },
    h3: {
      color: '#fff',
    },
    p: {
      color: '#fff',
      fontFamily: 'Montserrat-Regular',
    },
  };
  return (
    <LinearGradient colors={['#272727', '#13140D']} style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/images/long-background.png')}
        resizeMode="cover"
        style={{width: '100%', flex: 1, height: '100%'}}>
        <ScrollView style={{flex: 1, height: '100%'}}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <ImageBackground
                source={{
                  uri: BASE_URL + '/' + article.thumbnail,
                }}
                imageStyle={{}}
                style={styles.hero}>
                <TouchableOpacity
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
                </TouchableOpacity>
              </ImageBackground>
              <View style={styles.container}>
                <Text style={styles.title}>{article.name}</Text>
                <Gap height={20} />
                {/* <HTMLView value={ article.post_content}/> */}
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: article.content,
                  }}
                  tagsStyles={tagsStyles}
                  enableExperimentalMarginCollapsing={true}
                  renderersProps={{
                    img: {
                      enableExperimentalPercentWidth: true,
                    },
                  }}
                />
              </View>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
};

export default DetailArticleScreen;

const styles = StyleSheet.create({
  hero: {
    height: 600,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 20,
    color: '#FFFFF0',
    letterSpacing: 0.8,
    fontFamily: 'Montserrat-Bold',
  },
  container: {
    padding: 30,
    width: '100%',
  },
});
