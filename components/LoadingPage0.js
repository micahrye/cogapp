"use strict"

import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  Image,
  Navigator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Easing,
} from 'react-native';

const Window = Dimensions.get('window');

const LoadingTime = 0;

class LoadingPage0 extends Component {

  componentDidMount() {
    setTimeout(() => {this.props.navigator.replace({id: 23});},LoadingTime);
  }

  render() {
    return (
      <View style={styles.background}>
        
        <View>
          <Image style={styles.image} source={require('../backgrounds/Game_1_Background_1280.png')}/>
          <Image style={styles.image} source={require('../backgrounds/Game_2_Background_1280.png')}/>
          <Image style={styles.image} source={require('../backgrounds/Game_3_Background_1280.png')}/>          
          <Image style={styles.image} source={require('../backgrounds/Game_4_Background_1280.png')}/>          
          <Image style={styles.image} source={require('../backgrounds/Game_5_Background_1280.png')}/>          
          <Image style={styles.image} source={require('../backgrounds/Game_6_Background_1280.png')}/>          
          <Image style={styles.image} source={require('../backgrounds/Game_7_Background_1280.png')}/>          

        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'peachpuff',
    width: Window.width,
    height: Window.height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    height: 1,
    width: 1,
  },
});

export default LoadingPage0

