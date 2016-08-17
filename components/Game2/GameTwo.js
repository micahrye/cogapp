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
const endCoordinates = [Window.width*0.65,Window.height*0.5];
const endCoordinates2 = [Window.width*0.6,Window.height*0.4];
// these constants specify the initial locations and spacing of the food items
const startLeft = Window.width*0.4;
const startTop = -250;
const endTopSign = -15;
const endTopCan = Window.height*0.2;

const sprite2Start = [startLeft,startTop];

const creatureStart = [Window.width+500,Window.height*0.5];
const creatureEnd = [Window.width*0.65,Window.height*0.5];

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

    tweenFall = function(dest){
      return (
        {
         tweenType: "curve-spin",
         startXY: [startLeft+32,endTopCan],
         endXY: dest,
         duration: 750,
         repeatable: false,
         loop: false,
        }
      )
    };

    tweenMove = function(start,end) {
      return(
        {
          tweenType: "move",
          startXY: start,
          endXY: end,
          duration: 1500,
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

    readyToEat = false;

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

  // flip(num) {
  //   Animated.timing(
  //     this.state.rotate,
  //     {
  //       toValue: num,
  //       easing: Easing.linear,
  //       duration: 500,
  //     }
  //   ).start();
  // }


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
                      creatureTween3: tweenMove([Window.width+500,Window.height*0.4],
                                                [Window.width*0.65,Window.height*0.4]),
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
      creatureTween3: tweenMove([Window.width*0.65,Window.height*0.4],[Window.width+500,Window.height*0.4]),
    });
    setTimeout(this.toggleLevel,1500);
  }

  onFoodPress = () => {
    readyToEat = true;
    if (!this.state.foodPressed) {
      this.setState({foodTween: tweenFall(endCoordinates),
                     foodKey: Math.random(),
                     signTween: tweenTimeout(endTopSign,startTop),
                     signKey: Math.random(),
                     foodPressed: true});
    }
    switch(this.state.onboarding) {
      case 1:
        this.setState({creatureKey1: Math.random(),animation: "openMouth",
                       foodTween: tweenFall(endCoordinates)})
        break;
      case 2:
        this.setState({creatureKey2: Math.random(),animation: "openMouth",
                       foodTween: tweenFall(endCoordinates)})
        break;
      case 3:
        this.setState({creatureKey3: Math.random(), foodTween: tweenFall(endCoordinates2)})
        break;
    }
  }

  onTweenEndFood = () => {
    switch(this.state.onboarding) {
      case 1:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey1: Math.random()})
        }
        break;
      case 2:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey2: Math.random()})
        }
        break;
      case 3:
        if (readyToEat) {
          this.setState({animation: "eat", creatureKey3: Math.random()})
        }
        break;
    }
    readyToEat = false;
  }

  onTweenEndCreature = () => {
    //readyToEat = true;
    switch(this.state.onboarding) {
      case 1:
        this.setState({creatureTween1: tweenStatic(creatureEnd)})
        break;
      case 2:
        this.setState({creatureTween2: tweenStatic(creatureEnd)})
        break;
      case 3:
        this.setState({creatureTween3: tweenStatic([Window.width*0.65,Window.height*0.4])})
        break;
    }
  }

  onAnimationFinish(animationKey, creatureKey) {
    switch(animationKey) {
      case "walk":
        this.setState({animation: "default"})
        break;
      case "celebrate":
        this.setState({onboarding: this.state.onboarding+1})
        this.setState({animation: "walk"})
        //this.flip(100);
        if (this.state.onboarding === 4) {
          setTimeout(this.nextLevel,1000)
        } else {
          setTimeout(this.toggleCreatureCharacter.bind(this),500);
        }
        break;
      case "chew":
        this.setState({animation: "celebrate"})
        switch(this.state.onboarding) {
          case 1:
            this.setState({creatureKey1: Math.random()})
            break;
          case 2:
            this.setState({creatureKey2: Math.random()})
            break;
          case 3:
            this.setState({creatureKey3: Math.random()})
            break;
        }
        break;
      case "openMouth":
        this.setState({animation: "readyToEat"})
        switch(this.state.onboarding) {
          case 1:
            this.setState({creatureKey1: Math.random()})
            break;
          case 2:
            this.setState({creatureKey2: Math.random()})
            break;
          case 3:
            this.setState({creatureKey3: Math.random()})
            break;
        }
        break;
        case "eat":
          this.setState({animation: "celebrate",creatureKey3: Math.random()})
          break;
    }

  }


  render() {

    const tweenOptsLever = {
      tweenType: "bounce",
      startY: 80,
      repeatable: true,
      loop: false,
    };

    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: Window.width/4, height: Window.width/4}}
                    draggable={false}
                    character={mammalCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween1}
                    key={this.state.creatureKey1}
                    spriteAnimationKey={this.state.animation}
                    rotate={[{rotateY: "0deg"}]}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey, key) => {this.onAnimationFinish(spriteAnimationKey, key)}}/>
                <AnimatedSprite coordinates={{top: Window.height -190, left: Window.width - 120}}
                    size={{width: Window.width/4, height: Window.width/4}}
                    draggable={false}
                    character={goatCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween2}
                    key={this.state.creatureKey2}
                    rotate={[{rotateY:"180deg"}]}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey, key) => {this.onAnimationFinish(spriteAnimationKey, key)}}/>
                <AnimatedSprite coordinates={{top: Window.height -50, left: Window.width - 120}}
                    size={{width: Window.height/2, height: Window.height/2}}
                    draggable={false}
                    character={frogCharacter}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween3}
                    key={this.state.creatureKey3}
                    spriteAnimationKey={this.state.animation}
                    rotate={[{rotateY:"0deg"}]}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey, key) => {this.onAnimationFinish(spriteAnimationKey, key)}}/>
                <AnimatedSprite coordinates={{top:100,left:-5}}
                    size={{width:Window.width/6,height:(Window.width/6)*0.878}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    onPress={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    key={this.state.signKey}
                    size={{width: Window.width/7, height: (Window.width/7)*1.596}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+32}}
                    key={this.state.foodKey}
                    size={{width: Window.width/11, height: Window.width/11}}
                    draggable={false}
                    character={this.state.foodCharacter}
                    tweenStart="auto"
                    tween={this.state.foodTween}
                    onPress={this.onFoodPress}
                    onTweenFinish={this.onTweenEndFood}/>
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
