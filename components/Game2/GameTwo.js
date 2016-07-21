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
const startTop = -300;
const endTop = 90

const LoadingTime = 3000;

const sprite2Start = [startLeft,startTop];

class GameTwo extends Component {

  tweenDown = {
    tweenType: "basic-back",
    endXY: [startLeft,endTop],
    duration: 300,
    loop: false,
  };

  tweenTimeout = {
    tweenType: "basic-back",
    endXY: [startLeft,startTop],
    duration: 300,
    loop: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      frogSpriteAnimationKey: 'idle',
      frogKey: 1,
      canTween: this.tweenTimeout,
      signTween: this.tweenTimeout,
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

  displayMessage = function(){
    console.warn('timeout');
  }

  onLeverTouch = () => {
    setTimeout(this.displayMessage,10000);
    this.setState({canTween:this.tweenDown,
                   signTween: this.tweenDown});
  }

  frogTap = () => {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'celebrate'});
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
                <AnimatedSprite coordinates={{top:150,left:150}}
                    size={{width:256,height:256}}
                    draggable={false}
                    character={frogCharacter}
                    key={this.state.frogKey}
                    spriteKey={1}
                    onPress={this.frogTap}
                    spriteAnimationKey={this.state.frogSpriteAnimationKey}
                />
                <AnimatedSprite coordinates={{top:80,left:0}}
                    size={{width:143,height:125}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    onPress={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+30}}
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
