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
import grassCharacter from "../../sprites/grass/grassCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 250;
const startTop = -200;
const endTopSign = -5;
const endTopCan = 90;


const sprite2Start = [startLeft,startTop];

class GameTwo extends Component {

  constructor(props) {

    tweenDown = function(startLeft,startTop,endLeft,endTop) {
      return (
        {
          tweenType: "bounce-drop",
          startXY: [startLeft,startTop],
          endXY: [endLeft,endTop],
          duration: 800,
          repeatable: false,
          loop: false,
        }
      );
    }

    tweenTimeout = function(startLeft,startTop,endLeft,endTop) {
      return (
        {
          tweenType: "basic-back",
          startXY: [startLeft,startTop],
          endXY: [endLeft,endTop],
          duration: 750,
          repeatable: false,
          loop: false,
        }
      );
    }

    tweenHop = function(startLeft,startTop) {
      return (
        {
          tweenType: "hop",
          startXY: [startLeft,startTop],
          loop: false,
        }
      );
    }

   tweenInitial = {
                  tweenType: "hop",
                  startXY: [startLeft+32,startTop],
                  loop: false,
                  };

    tweenFall = {
      tweenType: "curve-spin",
      startXY: [startLeft+32,endTopCan],
      endXY: [540,250],
      duration: 750,
      repeatable: false,
      loop: false,
    };

    super(props);
    this.state = {
      canKey: 0,
      signKey: 0.5,
      canTween: tweenInitial,
      signTween: tweenInitial,
      timeoutHuh: false,
      foodPressed: false,
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
    if (!this.state.foodPressed) {
      this.setState({canTween: tweenTimeout(startLeft+32,endTopCan,startLeft+32,startTop),
                     signTween: tweenTimeout(startLeft,endTopSign,startLeft,startTop),
                     canKey: Math.random(),
                     signKey: Math.random(),
                     timeoutHuh: false});
    }
  }

  onTimeoutTwo = () => {
    //console.warn("timeout");
    if (!this.state.foodPressed) {
      this.setState({canTween: tweenHop(startLeft+32,endTopCan),
                     signTween: tweenHop(startLeft,endTopSign),
                     canKey: Math.random(),
                     signKey: Math.random(),});
    }
  }

  onLeverTouch = () => {
    if(!this.state.timeoutHuh && !this.state.foodPressed) {
      setTimeout(this.onTimeoutOne,10000);
      setTimeout(this.onTimeoutTwo,5000);
      this.setState({canTween: tweenDown(startLeft+32,startTop,startLeft+32,endTopCan),
                     signTween: tweenDown(startLeft,startTop,startLeft,endTopSign),
                     canKey: Math.random(),
                     signKey: Math.random(),
                     timeoutHuh: true,});
    }
  }

  onFoodPress = () => {
    this.setState({canTween: tweenFall,
                   canKey: Math.random(),
                   foodPressed: true});
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
      tweenType: "hop",
      startXY: [0,80],
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
                    character={grassCharacter}
                    tweenStart="auto"
                    tween={this.state.canTween}
                    onPress={this.onFoodPress}/>
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
