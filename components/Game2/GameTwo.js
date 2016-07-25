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
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import frogCharacter from "../../sprites/frog/frogCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 250;
const startTop = -200;
const endTopSign = -5;
const endTopCan = 90;

const LoadingTime = 3000;

const sprite2Start = [startLeft,startTop];

class GameTwo extends Component {



  constructor(props) {


    tweenDownSign = {
          tweenType: "bounce-drop",
          startXY: [startLeft,startTop],
          endXY: [startLeft,endTopSign],
          duration: 800,
          repeatable: false,
          loop: false,
        };

    tweenDownCan = {
              tweenType: "bounce-drop",
              startXY: [startLeft+32,startTop],
              endXY: [startLeft+32,endTopCan],
              duration: 800,
              repeatable: false,
              loop: false,
            };

    tweenTimeoutSign = {
          tweenType: "basic-back",
          startXY: [startLeft,endTopSign],
          endXY: [startLeft,startTop],
          duration: 750,
          loop: false,
        };

    tweenTimeoutCan = {
              tweenType: "basic-back",
              startXY: [startLeft+32,endTopCan],
              endXY: [startLeft+32,startTop],
              duration: 750,
              loop: false,
            };

      tweenHopSign = {
                  tweenType: "hop",
                  startXY: [startLeft,endTopSign],
                  loop: false,
                };

      tweenHopCan = {
                      tweenType: "hop",
                      startXY: [startLeft+32,endTopCan],
                      loop: false,
                    };

   tweenInitial = {
                  tweenType: "hop",
                  startXY: [startLeft+32,startTop],
                  loop: false,
                  };



    super(props);
    this.state = {
      canKey: 0,
      signKey: 0.5,
      canTween: tweenInitial,
      signTween: tweenInitial,
      timeoutHuh: false,
    }

  }



  componentDidMount() {

  }


  // move on to next page when navigation button is pressed
  // push id 11 to navigator, which will take the game to
  // GameTwo1.js
  buttonPress = () => {
      this.props.navigator.replace({
          id: 11,
      });
  }



  onTimeoutOne = () => {
    //console.warn("timeout");
    this.setState({canTween: tweenTimeoutCan,
                   signTween: tweenTimeoutSign,
                   canKey: Math.random(),
                   signKey: Math.random(),
                   timeoutHuh: false});
  }

  onTimeoutTwo = () => {
    //console.warn("timeout");
    this.setState({canTween: tweenHopCan,
                   signTween: tweenHopSign,
                   canKey: Math.random(),
                   signKey: Math.random(),});
  }

  onLeverTouch = () => {
    if(!this.state.timeoutHuh) {
      setTimeout(this.onTimeoutOne,10000);
      setTimeout(this.onTimeoutTwo,5000);
      this.setState({canTween: tweenDownCan,
                     signTween: tweenDownSign,
                     canKey: Math.random(),
                     signKey: Math.random(),
                     timeoutHuh: true,});
    }
  }




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


    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to Level 2</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    character={mammalCharacter}/>
                <AnimatedSprite coordinates={{top:80,left:0}}
                    size={{width:143,height:125}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    onPress={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    key={this.state.signKey}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+32}}
                    key={this.state.canKey}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    tweenStart="auto"
                    tween={this.state.canTween}/>
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
      top:0,
      left:0,
      position: 'absolute',
  },
})

export default GameTwo
