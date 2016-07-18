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

// imports

import AnimatedSprite from "./animatedSprite";
import Tweener from "./Tweener";


// import different characters to feed to animated sprite
import greenDragonCharacter from "../sprites/dragon/greenDragonCharacter";
import frogCharacter from "../sprites/frog/frogCharacter";
import canCharacter from "../sprites/can/canCharacter";
import appleCharacter from "../sprites/apple/appleCharacter";
import signCharacter from "../sprites/sign/signCharacter";
import leverCharacter from "../sprites/lever/leverCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 250;
const startTop = 90;


const sprite2Start = [startLeft,startTop];



class GameTwo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rotation : new Animated.Value(16),
    }
  }

  // move on to next page when navigation button is pressed
  // push id 11 to navigator, which will take the game to
  // GameTwo1.js
  buttonPress = () => {
      this.props.navigator.push({
          id: 11,
      });
  }

  displayMessage = function(){
    console.warn('timeout');
  }

  onLeverTouch = () => {
    setTimeout(this.displayMessage,10000); // timeout ten seconds after lever is pulled
  }

  // animate lever to move to a downward angle on press
  // leverPress = () => {
  //   Animated.timing(
  //     this.state.rotation,
  //     {
  //       toValue: 75,
  //       easing: Easing.linear,
  //       duration: 500,
  //     }
  //   ).start();
  // }



  render() {


    const tweenOpts02 = {
      tweenType: "bounce-drop",
      startXY: sprite2Start,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
    };

    const tweenOptsLever = {
      tweenType: "bounce",
      repeatable: true,
      loop: false,
    };


    // translates integers into degrees to allow rotation to
    // be animated.  Used in leverStyle transform
    ro = this.state.rotation.interpolate({
      inputRange: [0,100],
      outputRange: ['0deg','180deg']
    })

    // style for lever
    // const leverStyle = {
    //   height: 150,
    //   width: 20,
    //   borderColor: 'red',
    //   borderWidth: 3,
    //   backgroundColor: 'blue',
    //   top: 40,
    //   left: 0,
    //   transform: [{rotate:ro}]
    // };

    return (
      <View style={styles.container}>
        <Image source={require('../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to Level 2</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 275, left: Window.width - 200}}
                    size={{width: 256, height: 256}}
                    draggable={false}
                    character={frogCharacter}
                    hitSlop={{top:-150,left:-20,bottom:0,right:-10}}/>
                <AnimatedSprite coordinates={{top:80,left:0}}
                    size={{width:140,height:120}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    setTouchActivity={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: 0, left: startLeft}}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+30}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    tweenStart="touch"
                    tween={tweenOpts02}/>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // styles for background png image/basic black backgroundColor
  // to go behind it
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
  // style for navigation button
  button: {
      backgroundColor: '#4d94ff',
      borderRadius: 10,
      width: 90,
      height: 30,

  },
})

export default GameTwo
