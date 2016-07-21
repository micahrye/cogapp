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

import AnimatedSprite from "../animatedSprite";
import Tweener from "../Tweener";

// import different characters to feed to animated sprite
import greenDragonCharacter from "../../sprites/dragon/greenDragonCharacter";
import frogCharacter from "../../sprites/frog/frogCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 150;
const startTop = 20;
const spacing = 150;
const sprite1Start = [startLeft,startTop];
const sprite2Start = [startLeft+spacing,startTop];
const sprite3Start = [startLeft+spacing*2,startTop];


class GameTwo3 extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // move on to next page when navigation button is pressed
  // push id 14 to navigator, which will take the game to
  // a game over page
  buttonPress = () => {
      this.props.navigator.replace({
          id: 14,
      });
  }

  componentDidMount() {

  }



  render() {

    // options for left-most food item - drops and
    // bounces towards creature on touch
    const tweenOpts01 = {
      tweenType: "bounce-drop",
      startXY: sprite1Start ,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      disappearAfterAnimation: true,
    };

    // options for middle food item
    const tweenOpts02 = {
      tweenType: "bounce-drop",
      startXY: sprite2Start,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      disappearAfterAnimation: true,
    };

    // options for right-most food item
    const tweenOpts03 = {
      tweenType: "bounce-drop",
      startXY: sprite3Start,
      endXY: endCoordinates,
      duration: 600,
      repeatable: false,
      loop: false,
      disappearAfterAnimation: true,
    };

    const tweenOptsLever = {
      tweenType: "bounce",
      repeatable: true,
      loop: false,
    };


    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to game over</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 275, left: Window.width - 200}}
                    size={{width: 256, height: 256}}
                    draggable={false}
                    character={frogCharacter} />
                <AnimatedSprite coordinates={{top:80,left:0}}
                    size={{width:143,height:125}}
                    draggable={false}
                    character={leverCharacter}                      tweenStart="touch"
                    tween={tweenOptsLever}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={appleCharacter}
                    tweenStart="touch"
                    tween={tweenOpts01}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    tweenStart="touch"
                    tween={tweenOpts02}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
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
      left: 0,
      top: 0,
      position: 'absolute',
  },
})

export default GameTwo3
