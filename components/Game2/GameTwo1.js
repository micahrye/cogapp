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
import grassCharacter from "../../sprites/grass/grassCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import signCharacter from "../../sprites/sign/signCharacter";


const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 200;
const startTop = -200;
const spacing = 150;
const foodEndTop = 90;
const signEndTop = -5;


class GameTwo1 extends Component {

  constructor(props) {

    super(props);

    tweenDown = function(startTop,endTop) {
      return (
        {
          tweenType: "bounce-drop",
          startY: startTop,
          endY: endTop,
          duration: 800,
          repeatable: false,
          loop: false,
        }
      );
    }

    tweenTimeout = function(startTop,endTop) {
      return (
        {
          tweenType: "basic-back",
          startY: startTop,
          endY: endTop,
          duration: 750,
          repeatable: false,
          loop: false,
        }
      );
    }

    tweenHop = function(startTop) {
      return (
        {
          tweenType: "hop",
          startY: startTop,
          loop: false,
        }
      );
    }

    tweenInitial = {
       tweenType: "hop",
       startY: startTop,
       loop: false,
    };

    this.state = {
      foodKey1: Math.random(),
      foodKey2: Math.random(),
      foodkey3: Math.random(),
      signKey1: Math.random(),
      signKey2: Math.random(),
      signKey3: Math.random(),
      foodTween: tweenInitial,
      signTween: tweenInitial,
      timeoutHuh: false,
      foodPressed: false,
    }
  }

  componentDidMount() {

  }

  // move on to next page when navigation button is pressed
  // push id 12 to navigator, which will take the game to
  // GameTwo2.js
  buttonPress = () => {
      this.props.navigator.replace({
          id: 12,
      });
  }

  randomizeKeys() {
    this.setState({
      foodKey1: Math.random(),
      foodKey2: Math.random(),
      foodKey3: Math.random(),
      signKey1: Math.random(),
      signKey2: Math.random(),
      signKey3: Math.random(),
    });
  }

  onTimeoutOne = () => {
    //console.warn("timeout");
    //if (!this.state.foodPressed) {
      this.setState({foodTween: tweenTimeout(foodEndTop,startTop),
                     signTween: tweenTimeout(signEndTop,startTop),
                     timeoutHuh: false});
      this.randomizeKeys();
    //}
  }

  onTimeoutTwo = () => {
    //console.warn("timeout");
    //if (!this.state.foodPressed) {
      this.setState({foodTween: tweenHop(foodEndTop),
                     signTween: tweenHop(signEndTop)});
      this.randomizeKeys();
    //}
  }

  onLeverTouch = () => {
    if (!this.state.timeoutHuh) {
        setTimeout(this.onTimeoutOne,10000);
        setTimeout(this.onTimeoutTwo,5000);
        this.setState({foodTween: tweenDown(startTop,foodEndTop),
                       signTween: tweenDown(startTop,signEndTop),
                       timeoutHuh: true,});
        this.randomizeKeys();
    }
  }




  render() {

    const tweenOptsLever = {
      tweenType: "hop",
      startY: 80,
      repeatable: true,
      loop: false,
    };


    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                    <Text>Go to Level 3</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    character={mammalCharacter} />
                <AnimatedSprite coordinates={{top:80,left:0}}
                    size={{width:143,height:125}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    onPress={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft-30}}
                    key={this.state.signKey1}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={appleCharacter}
                    key={this.state.foodKey1}
                    tweenStart="auto"
                    tween={this.state.foodTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing-30}}
                    key={this.state.signKey2}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
                    key={this.state.signKey3}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    key={this.state.foodKey3}
                    tweenStart="auto"
                    tween={this.state.foodTween}/>
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

export default GameTwo1
