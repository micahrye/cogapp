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
import frogCharacter from "../sprites/frog/frogCharacter";

const Window = Dimensions.get('window');

class GameTwo3 extends Component {

  constructor(props) {
    super(props);
  }

  buttonPress = () => {
      this.props.navigator.push({
          id: 14,
      });
  }

  render() {

    return (
      <View style={styles.container}>
        <Image source={require('../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to Level 5</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 275, left: Window.width - 200}}
                    size={{width: 256, height: 256}}
                    draggable={false}
                    character={frogCharacter} />
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

export default GameTwo3
