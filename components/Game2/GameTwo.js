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
import frogCharacter from "../../sprites/frog/frogCharacter";
import goatCharacter from "../../sprites/goat/goatCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [450,250];
// these constants specify the initial locations and spacing of the food items
const startLeft = 250;
const startTop = -200;
const endTopSign = -15;
const endTopCan = 80;


const sprite2Start = [startLeft,startTop];

const creatureStart = [Window.width+150,Window.height-190];
const creatureEnd = [Window.width-200,Window.height-190];

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

   tweenInitial = {
                  tweenType: "hop",
                  startY: startTop,
                  loop: false,
                  };

    tweenFall = {
      tweenType: "curve-spin",
      startXY: [startLeft+32,endTopCan],
      endXY: endCoordinates,
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

    tweenStatic = function(pos) {
      return(
        {
         tweenType: "move",
         startXY: pos,
         endXY: pos,
         duration: 0,
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
      creatureTween1: tweenMove(creatureStart,creatureEnd),
      creatureTween2: tweenMove(creatureStart,creatureStart),
      creatureTween3: tweenMove(creatureStart,creatureStart),
      creatureKey1: Math.random(),
      creatureKey2: Math.random(),
      creatureKey3: Math.random(),
      leverPressed: false,
      foodPressed: false,
      animation: "default",
    }

  }



  componentDidMount() {
    this.setState({creatureKey1: Math.random(),
                   animation: "walk"});

  }

  onLeverTouch = () => {

    if(!this.state.leverPressed) {

      switch(this.state.onboarding) {
        case 1:
          // grass/gopher character first
          this.setState({foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
        case 2:
          this.setState({foodCharacter: canCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
        case 3:
          this.setState({foodCharacter: bugCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
      }

    }

  }


  toggleCreatureCharacter() {

    this.setState({leverPressed: false});

    switch(this.state.onboarding) {
      case 2:
        this.setState({
                        creatureKey1: Math.random(),
                        creatureKey2: Math.random(),
                        creatureTween1: tweenMove(creatureEnd,creatureStart),
                        creatureTween2: tweenMove(creatureStart,creatureEnd),
                       })
        break;
      case 3:
      this.setState({
                      creatureKey2: Math.random(),
                      creatureKey3: Math.random(),
                      creatureTween2: tweenMove(creatureEnd,creatureStart),
                      creatureTween3: tweenMove([600,115],[Window.width-250,115]),
                      animation: "default",
                     })
        break;
    }
  }

  toggleLevel = () => {
    this.props.navigator.replace({id: 'GameTwo1',});
  }

  nextLevel = () => {
    this.setState({
      creatureKey3: Math.random(),
      creatureTween3: tweenMove([Window.width-250,115],[700,115]),
    });
    setTimeout(this.toggleLevel,1500);
  }

  onFoodPress = () => {

    if (!this.state.foodPressed) {
      this.setState({foodTween: tweenFall,
                     foodKey: Math.random(),
                     signTween: tweenTimeout(endTopSign,startTop),
                     signKey: Math.random(),
                     onboarding: this.state.onboarding+1,
                     foodPressed: true});
      setTimeout(this.toggleCreatureCharacter.bind(this),2000);
      if (this.state.onboarding === 3) {
        this.setState({animation: "celebrate",
                       creatureKey3: Math.random(),
                       creatureTween3: tweenStatic([Window.width-250,115])});
        setTimeout(this.nextLevel,3000);
      }
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
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    character={mammalCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween1}
                    key={this.state.creatureKey1}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}/>
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    character={goatCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween2}
                    key={this.state.creatureKey2}/>
                <AnimatedSprite coordinates={{top: Window.height -50, left: Window.width - 120}}
                    size={{width: 256, height: 256}}
                    draggable={false}
                    character={frogCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween3}
                    key={this.state.creatureKey3}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}/>
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
