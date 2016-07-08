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
import canCharacter from "../sprites/can/canCharacter";
import appleCharacter from "../sprites/apple/appleCharacter";

const Window = Dimensions.get('window');
const endCoordinates = [480,250];
const sprite1Start = [150,20];
const sprite2Start = [250,20];
const sprite3Start = [350,20];

class GameTwo1 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rotation : new Animated.Value(16),
    }
  }

  buttonPress = () => {
      this.props.navigator.push({
          id: 12,
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

    const tweenOpts01 = {
      tweenType: "bounce-drop",
      startXY: sprite1Start ,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      destroy: true,
    };

    const tweenOpts02 = {
      tweenType: "bounce-drop",
      startXY: sprite2Start,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      destroy: true,
    };

    const tweenOpts03 = {
      tweenType: "bounce-drop",
      startXY: sprite3Start,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      destroy: true,
    };

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
                    <Text>Go to Level 3</Text>
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
                <AnimatedSprite coordinates={{top: 20, left: 150}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={appleCharacter}
                    tweenStart="touch"
                    tween={tweenOpts01}/>
                <AnimatedSprite coordinates={{top: 20, left: 250}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    tweenStart="touch"
                    tween={tweenOpts02}/>
                <AnimatedSprite coordinates={{top: 20, left: 350}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    tweenStart="touch"
                    tween={tweenOpts03}/>
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

export default GameTwo1
