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
import canCharacter from "../../sprites/can/canCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import frogCharacter from "../../sprites/mammal/mammalCharacter";
import goatCharacter from "../../sprites/goat/goatCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [550,330];
// these constants specify the initial locations and spacing of the food items
const startLeft = 250;
const startTop = -200;
const endTopSign = -15;
const endTopCan = 80;


const sprite2Start = [startLeft,startTop];

class GameTwo extends Component {

  constructor(props) {

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

    tweenFall = {
      tweenType: "curve-spin",
      startXY: [startLeft+32,endTopCan],
      endXY: [540,250],
      duration: 750,
      repeatable: false,
      loop: false,
    };

    tweenMove = function(start,end) {
      return(
        {
          tweenType: "move",
          startXY: start,
          endXY: end,
          duration: 750,
          repeatable: false,
          loop: false,
        }
      );
    }

    super(props);
    this.state = {
      foodKey: 0,
      signKey: 0.5,
      foodTween: tweenInitial,
      signTween: tweenInitial,
      onboarding: 1,
      foodCharacter: grassCharacter,
      creatureCharacter: mammalCharacter,
      creatureTween: tweenMove([Window.width+150,Window.height-190],
                               [Window.width-120,Window.height-190]),
      creatureKey: Math.random(),
    }

  }



  componentDidMount() {

  }


  // move on to next page when navigation button is pressed
  // push id 11 to navigator, which will take the game to
  // GameTwo1.js
  buttonPress = () => {
      this.props.navigator.replace({
          id: 'GameTwo1',
      });
  }



  onLeverTouch = () => {

      switch(this.state.onboarding) {
        case 1:
          // grass/gopher character first
          this.setState({foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random()});
          break;
        case 2:
          this.setState({foodCharacter: canCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random()});
          break;
        case 3:
          this.setState({foodCharacter: bugCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random()});
          break;
      }



  }

  toggleCreatureCharacter() {
    this.setState({creatureKey: Math.random(),
                   creatureTween: tweenMove([Window.width-120,Window.height-190],
                                            [Window.width+150,Window.height-190])});
    // switch(this.state.onboarding) {
    //   case 2:
    //     setTimeout(this.setState({creatureKey: Math.random(),
    //                               creatureCharacter: goatCharacter,
    //                               creatureTween: tweenMove([Window.width+300,Window.height-190],
    //                                                        [Window.width-120,Window.height-190])}),
    //                1000);
    //     break;
    //   case 3:
    //     setTimeout(this.setState({creatureKey: Math.random(),
    //                               creatureCharacter: frogCharacter,
    //                               creatureTween: tweenMove([Window.width+300,Window.height-190],
    //                                                        [Window.width-120,Window.height-190])}),
    //                1000);
    //     break;
    // }
  }

  onFoodPress = () => {

    this.setState({foodTween: tweenFall,
                   foodKey: Math.random(),
                   signTween: tweenTimeout(endTopSign,startTop),
                   signKey: Math.random(),
                   onboarding: this.state.onboarding+1});
    setTimeout(this.toggleCreatureCharacter.bind(this),2000);
    if (this.state.onboarding === 3) {
      setTimeout(this.buttonPress,2000);
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
                    <Text>Go to Level 2</Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    character={this.state.creatureCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween}
                    key={this.state.creatureKey}/>
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
                    key={this.state.foodKey}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.foodCharacter}
                    tweenStart="auto"
                    tween={this.state.foodTween}
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
