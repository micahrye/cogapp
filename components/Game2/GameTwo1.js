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
const startLeft2 = 275;
const startTop = -200;
const spacing = 150;
const foodEndTop = 80;
const signEndTop = -15;


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

    tweenFall = function (leftValue){
      return(
        {
          tweenType: "curve-spin",
          startXY: [leftValue,foodEndTop],
          endXY: [540,250],
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

    randomFood = function() {
      diceRoll = Math.random();
      if (diceRoll < 0.33) {
        return canCharacter;
      } else if (diceRoll > 0.66) {
        return bugCharacter;
      } else {
        return appleCharacter;
      }
    }

    this.state = {
      foodKey1: Math.random(),
      foodKey2: Math.random(),
      foodKey3: Math.random(),
      foodKey4: Math.random(),
      foodKey5: Math.random(),
      signKey1: Math.random(),
      signKey2: Math.random(),
      signKey3: Math.random(),
      signKey4: Math.random(),
      signKey5: Math.random(),
      phase0Left: grassCharacter,
      phase0Right: grassCharacter,
      phase0Correct: "left",
      phase1Left: grassCharacter,
      phase1Middle: grassCharacter,
      phase1Right: grassCharacter,
      phase1Correct: ["incorrect","incorrect","incorrect"],
      phase1AnsweredCorrectly: false,
      foodTween01: tweenInitial,
      foodTween02: tweenInitial,
      foodTween11: tweenInitial,
      foodTween12: tweenInitial,
      foodTween13: tweenInitial,
      signTween01: tweenInitial,
      signTween2: tweenInitial,
      timeoutHuh: false,
      foodPressed: false,
      gamePhase: true,
    }
    this.timeout1 = undefined;
    this.timeout2 = undefined;

  }

  componentDidMount() {

  }

  // move on to next page when navigation button is pressed
  // push id 12 to navigator, which will take the game to
  // GameTwo2.js
  buttonPress = () => {
      this.props.navigator.replace({
          id: 'GameTwo2',
      });
  }

  onTimeoutOne = () => {
    if (!this.state.foodPressed) {
      if (this.state.gamePhase) {
          this.setState({foodTween01: tweenTimeout(foodEndTop,startTop),
                         foodTween02: tweenTimeout(foodEndTop,startTop),
                         signTween01: tweenTimeout(signEndTop,startTop),
                         foodKey4: Math.random(),
                         foodKey5: Math.random(),
                         signKey4: Math.random(),
                         signKey5: Math.random()});
        } else {
          this.setState({foodTween11: tweenTimeout(foodEndTop,startTop),
                         foodTween12: tweenTimeout(foodEndTop,startTop),
                         foodTween13: tweenTimeout(foodEndTop,startTop),
                         signTween2: tweenTimeout(signEndTop,startTop),
                         foodkey1: Math.random(),
                         foodKey2: Math.random(),
                         foodKey3: Math.random(),
                         signKey1: Math.random(),
                         signKey2: Math.random(),
                         signKey3: Math.random()});
        }
        this.setState({timeoutHuh: false});
    }
  }

  onTimeoutTwo = () => {
    if (!this.state.foodPressed) {
      if (this.state.gamePhase) {
        this.setState({foodTween01: tweenHop(foodEndTop),
                       foodTween02: tweenHop(foodEndTop),
                       signTween01: tweenHop(signEndTop),
                       foodKey4: Math.random(),
                       foodKey5: Math.random(),
                       signKey4: Math.random(),
                       signKey5: Math.random()});
      } else {
        this.setState({foodTween11: tweenHop(foodEndTop),
                       foodTween12: tweenHop(foodEndTop),
                       foodTween13: tweenHop(foodEndTop),
                       signTween2: tweenHop(signEndTop),
                       foodKey1: Math.random(),
                       foodKey2: Math.random(),
                       foodKey3: Math.random(),
                       signKey1: Math.random(),
                       signKey2: Math.random(),
                       signKey3: Math.random()});
      }
    }
  }

  randomFood() {
    diceRoll = Math.random();
    if (diceRoll < 0.33) {
      return canCharacter;
    } else if (diceRoll > 0.66) {
      return bugCharacter;
    } else {
      return appleCharacter;
    }
  }

  selectFoodPhase0() {
    diceRoll = Math.random();
    if (diceRoll < 0.5) {
      this.setState({phase0Left: grassCharacter,
                     phase0Right: this.randomFood(),
                     phase0Correct: "left"});
    } else {
      this.setState({phase0Right: grassCharacter,
                     phase0Left: this.randomFood(),
                     phase0Correct: "right"});
    }
  }


  selectFoodPhase1() {
    diceRoll = Math.random();
    if (diceRoll < 0.33) {
      this.setState({phase1Left: grassCharacter,
                     phase1Middle: grassCharacter,
                     phase1Right: this.randomFood(),
                     phase1Correct: ["correct","correct","incorrect"]});
    } else if (diceRoll > 0.66){
      this.setState({phase1Left: this.randomFood(),
                     phase1Middle: grassCharacter,
                     phase1Right: grassCharacter,
                     phase1Correct: ["incorrect","correct","correct"]});
    } else {
      this.setState({phase1Left: grassCharacter,
                     phase1Middle: this.randomFood(),
                     phase1Right: grassCharacter,
                     phase1Correct: ["correct","incorrect","correct"]});
    }
  }


  onLeverTouch = () => {
    if (!this.state.timeoutHuh && !this.state.foodPressed) {
        this.timeout1 = setTimeout(this.onTimeoutOne,10000);
        this.timeout2 = setTimeout(this.onTimeoutTwo,5000);
        if (this.state.gamePhase) {
          this.selectFoodPhase0();
          this.setState({foodTween01: tweenDown(startTop,foodEndTop),
                         foodTween02: tweenDown(startTop, foodEndTop),
                         signTween01: tweenDown(startTop,signEndTop),
                         foodKey4: Math.random(),
                         foodKey5: Math.random(),
                         signKey4: Math.random(),
                         signKey5: Math.random()});
        } else {
          this.selectFoodPhase1();
          this.setState({foodTween11: tweenDown(startTop,foodEndTop),
                         foodTween12: tweenDown(startTop,foodEndTop),
                         foodTween13: tweenDown(startTop,foodEndTop),
                         signTween2: tweenDown(startTop,signEndTop),
                         foodKey1: Math.random(),
                         foodKey2: Math.random(),
                         foodKey3: Math.random(),
                         signKey1: Math.random(),
                         signKey2: Math.random(),
                         signKey3: Math.random()});
        }
        this.setState({timeoutHuh: true});

    }
  }

  onFoodPress = (spriteKey) => {
    xvalue = 0;
    switch(spriteKey) {
      case 1:
         x = startLeft;
         this.setState({foodKey1: Math.random(),
                        foodTween11: tweenFall(x),
                        foodPressed: true});
        if (this.state.phase1Correct[0] === "correct") {
          if (this.state.phase1AnsweredCorrectly === true) {
            setTimeout(this.buttonPress,2000);
          } else {
            this.setState({phase1AnsweredCorrectly: true});
          }
        }
         break;
      case 3:
         x = startLeft+spacing;
         this.setState({foodKey2: Math.random(),
                        foodTween12: tweenFall(x),
                        foodPressed: true});
         if (this.state.phase1Correct[1] === "correct") {
           if (this.state.phase1AnsweredCorrectly === true) {
             setTimeout(this.buttonPress,2000);
           } else {
             this.setState({phase1AnsweredCorrectly: true});
           }
         }
         break;
      case 5:
         x = startLeft+spacing*2;
         this.setState({foodKey3: Math.random(),
                        foodTween13: tweenFall(x),
                        foodPressed: true});
         if (this.state.phase1Correct[2] === "correct") {
           if (this.state.phase1AnsweredCorrectly === true) {
             setTimeout(this.buttonPress,2000);
           } else {
             this.setState({phase1AnsweredCorrectly: true});
           }
         }
         break;
      case 7:
         x = startLeft2;
         this.setState({foodKey4: Math.random(),
                        foodTween01: tweenFall(x),
                        foodPressed: true});
         if (this.state.phase0Correct === "left") {
            clearTimeout(this.timeout1);
            clearTimeout(this.timeout2);
            this.setState({signTween01: tweenTimeout(signEndTop,startTop),
                           foodTween02: tweenTimeout(foodEndTop,startTop),
                           signKey4: Math.random(),
                           signKey5: Math.random(),
                           foodKey5: Math.random(),
                           gamePhase: false,
                           foodPressed: false,
                           timeoutHuh: false});
          }
         break;
      case 9:
         x= startLeft2+spacing;
         this.setState({foodKey5: Math.random(),
                        foodTween02: tweenFall(x),
                        foodPressed: true});
         if (this.state.phase0Correct === "right") {
           clearTimeout(this.timeout1);
           clearTimeout(this.timeout2);
             this.setState({signTween01: tweenTimeout(signEndTop,startTop),
                            foodTween01: tweenTimeout(foodEndTop,startTop),
                            signKey4: Math.random(),
                            signKey5: Math.random(),
                            foodKey4: Math.random(),
                            gamePhase: false,
                            foodPressed: false,
                            timeoutHuh: false});
            }
         break;
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
                    tween={this.state.signTween2}
                    spriteKey={0}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Left}
                    key={this.state.foodKey1}
                    tweenStart="auto"
                    tween={this.state.foodTween11}
                    onPress={this.onFoodPress}
                    spriteKey={1}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing-30}}
                    key={this.state.signKey2}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}
                    spriteKey={2}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Middle}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween12}
                    onPress={this.onFoodPress}
                    spriteKey={3}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
                    key={this.state.signKey3}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}
                    spriteKey={4}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Right}
                    key={this.state.foodKey3}
                    tweenStart="auto"
                    tween={this.state.foodTween13}
                    onPress={this.onFoodPress}
                    spriteKey={5}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2-30}}
                    key={this.state.signKey4}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween01}
                    spriteKey={6}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase0Left}
                    key={this.state.foodKey4}
                    tweenStart="auto"
                    tween={this.state.foodTween01}
                    onPress={this.onFoodPress}
                    spriteKey={7}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing-30}}
                    key={this.state.signKey5}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween01}
                    spriteKey={8}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase0Right}
                    key={this.state.foodKey5}
                    tweenStart="auto"
                    tween={this.state.foodTween02}
                    onPress={this.onFoodPress}
                    spriteKey={9}/>
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
