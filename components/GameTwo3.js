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
    this.state = {
      rotation : new Animated.Value(16),
    }
  }

  buttonPress = () => {
      this.props.navigator.push({
          id: 14,
      });
  }

  leverPress = () => {
    Animated.timing(
      this.state.rotation,
      {
        toValue: 75,
        easing: Easing.linear,
        duration: 500,
      }
    ).start();
  }

  render() {

    ro = this.state.rotation.interpolate({
      inputRange: [0,100],
      outputRange: ['0deg','180deg']
    })

    const leverStyle = {
      height: 150,
      width: 20,
      borderColor: 'red',
      borderWidth: 3,
      backgroundColor: 'blue',
      top: 40,
      left: 0,
      transform: [{rotate:ro}]
    };

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
                <Animated.View>
                  <TouchableOpacity
                    onPress={this.leverPress.bind(this)}
                    style={{...leverStyle}}>
                  </TouchableOpacity>
                </Animated.View>
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
