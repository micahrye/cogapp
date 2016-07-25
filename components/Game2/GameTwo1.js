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


const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 150;
const startTop = -200;
const spacing = 150;
const foodEndTop = 90;



class GameTwo1 extends Component {

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
       startXY: [startLeft,startTop],
       loop: false,
    };



    super(props);
    this.state = {
      foodKey1: Math.random(),
      foodKey2: Math.random(),
      foodkey3: Math.random(),
      foodTween1: tweenInitial,
      foodTween2: tweenInitial,
      foodTween3: tweenInitial,
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

  onTimeoutOne = () => {
    //console.warn("timeout");
    //if (!this.state.foodPressed) {
      this.setState({foodTween1: tweenTimeout(startLeft,foodEndTop,startLeft,startTop),
                     foodTween2: tweenTimeout(startLeft+spacing,foodEndTop,startLeft+spacing,startTop),
                     foodTween3: tweenTimeout(startLeft+spacing*2,foodEndTop,startLeft+spacing*2,startTop),
                     foodKey1: Math.random(),
                     foodKey2: Math.random(),
                     foodKey3: Math.random(),
                     timeoutHuh: false});
    //}
  }

  onTimeoutTwo = () => {
    //console.warn("timeout");
    //if (!this.state.foodPressed) {
      this.setState({foodTween1: tweenHop(startLeft,foodEndTop),
                     foodTween2: tweenHop(startLeft+spacing,foodEndTop),
                     foodTween3: tweenHop(startLeft+spacing*2,foodEndTop),
                     foodKey1: Math.random(),
                     foodKey2: Math.random(),
                     foodKey3: Math.random()});
    //}
  }

  onLeverTouch = () => {
      setTimeout(this.onTimeoutOne,10000);
      setTimeout(this.onTimeoutTwo,5000);
      this.setState({foodTween1: tweenDown(startLeft,startTop,startLeft,foodEndTop),
                     foodTween2: tweenDown(startLeft+spacing,startTop,startLeft+spacing,foodEndTop),
                     foodTween3: tweenDown(startLeft+spacing*2,startTop,startLeft+spacing*2,foodEndTop),
                     foodKey1: Math.random(),
                     foodKey2: Math.random(),
                     foodKey3: Math.random(),
                     timeoutHuh: true,});

  }




  render() {

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
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={appleCharacter}
                    key={this.state.foodKey1}
                    tweenStart="auto"
                    tween={this.state.foodTween1}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween2}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={canCharacter}
                    key={this.state.foodKey3}
                    tweenStart="auto"
                    tween={this.state.foodTween3}/>
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
