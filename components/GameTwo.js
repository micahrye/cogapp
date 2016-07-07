import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Easing,
  Navigator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "./animatedSprite";
import greenDragonCharacter from "../sprites/dragon/greenDragonCharacter";
import Tweener from "./Tweener";

class GameTwo extends Component {

  constructor(props) {
    super(props);
  }

  buttonPress = () => {
      this.props.navigator.push({
          id: 7,
      });
  }

  render() {

    return (
      <View style={styles.container}>
        <Image source={require('../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to Level 2</Text>
                </TouchableOpacity>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
  button: {
      backgroundColor: '#4d94ff',
      borderRadius: 10,
      width: 90,
      height: 30,

  },
})

export default GameTwo
