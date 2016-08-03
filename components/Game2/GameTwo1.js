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
import goatCharacter from "../../sprites/goat/goatCharacter";
import frogCharacter from "../../sprites/frog/frogCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import signCharacter from "../../sprites/sign/signCharacter";


const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [450,250];
// these constants specify the initial locations and spacing of the food items
const startLeft = 200;
const startLeft2 = 275;
const startTop = -200;
const spacing = 150;
const foodEndTop = 80;
const signEndTop = -15;

const creatureStart = [Window.width+150,Window.height-190];
const creatureEnd = [Window.width-200,Window.height-190];


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
          endXY: endCoordinates,
          duration: 750,
          repeatable: false,
          loop: false,
        }
      );
    }

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

    tweenInitial = {
       tweenType: "hop",
       startY: startTop,
       loop: false,
    };

    tweenOff = {
      tweenType: "sendOffScreen",
      loop: false,
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
      creatureKey1: Math.random(),
      creatureKey2: Math.random(),
      creatureKey3: Math.random(),
      phase0Left: grassCharacter,
      phase0Right: grassCharacter,
      phase0Correct: "left",
      phase1Left: grassCharacter,
      phase1Middle: grassCharacter,
      phase1Right: grassCharacter,
      phase1Correct: ["incorrect","incorrect","incorrect"],
      phase1AnsweredCorrectly: 0,
      foodTween01: tweenInitial,
      foodTween02: tweenInitial,
      foodTween11: tweenInitial,
      foodTween12: tweenInitial,
      foodTween13: tweenInitial,
      signTween01: tweenInitial,
      signTween2: tweenInitial,
      creatureTween1: tweenMove(creatureStart,creatureEnd),
      creatureTween2: tweenMove(creatureStart,creatureStart),
      creatureTween3: tweenMove(creatureStart,creatureStart),
      currentCreature: 1,
      timeoutHuh: false,
      foodPressed: false,
      gamePhase: true,
      numTrials: 0,
      showFood1: true,
      showFood2: true,
      showFood: true,
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

  sendOffScreen = (foodTween) => {
    this.setState({foodTween: tweenOff});
  }

  onTimeoutOne = () => {

      if (this.state.gamePhase) {
          this.setState({foodTween01: tweenTimeout(foodEndTop,startTop),
                         foodTween02: tweenTimeout(foodEndTop,startTop),
                         signTween01: tweenTimeout(signEndTop,startTop),
                         foodKey4: Math.random(),
                         foodKey5: Math.random(),
                         signKey4: Math.random(),
                         signKey5: Math.random(),
                         timeoutHuh: false});
          this.toggleCreature();
        } else {
          this.setState({foodTween11: tweenTimeout(foodEndTop,startTop),
                         foodTween12: tweenTimeout(foodEndTop,startTop),
                         foodTween13: tweenTimeout(foodEndTop,startTop),
                         signTween2: tweenTimeout(signEndTop,startTop),
                         foodKey1: Math.random(),
                         foodKey2: Math.random(),
                         foodKey3: Math.random(),
                         signKey1: Math.random(),
                         signKey2: Math.random(),
                         signKey3: Math.random(),
                         numTrials: this.state.numTrials+1,
                         timeoutHuh: false,
                         foodPressed: false,});
          this.toggleCreature();
          if (this.state.numTrials >= 8) {
            setTimeout(this.buttonPress,2000);
          }
        }
        this.setState({timeoutHuh: false});

  }

  onTimeoutTwo = () => {

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

  randomFood(food1,food2,food3) {
    diceRoll = Math.random();
    if (diceRoll < 0.33) {
      return food1;
    } else if (diceRoll > 0.66) {
      return food2;
    } else {
      return food3;
    }
  }

  excludeFoodType(type) {
    switch(type) {
      case "bug":
        return this.randomFood(grassCharacter,canCharacter,appleCharacter);
        break;
      case "apple":
        return this.randomFood(grassCharacter,canCharacter,bugCharacter);
        break;
      case "can":
        return this.randomFood(grassCharacter,bugCharacter,appleCharacter);
        break;
      case "grass":
        return this.randomFood(bugCharacter,canCharacter,appleCharacter);
        break;
    }
  }

  selectFoodPhase0Helper(food,foodString) {
    diceRoll = Math.random();
    if (diceRoll <= 0.5) {
      this.setState({phase0Left: food,
                     phase0Right: this.excludeFoodType(foodString),
                     phase0Correct: "left"});
    } else {
      this.setState({phase0Left: this.excludeFoodType(foodString),
                     phase0Right: food,
                     phase0Correct: "right"});
    }
  }

  selectFoodPhase0() {
    switch(this.state.currentCreature) {
      case 1:
        this.selectFoodPhase0Helper(grassCharacter,"grass");
        break;
      case 2:
        this.selectFoodPhase0Helper(canCharacter,"can");
        break;
      case 3:
        this.selectFoodPhase0Helper(bugCharacter,"bug");
        break;
    }
  }

  selectFoodPhase1Helper(food,foodString) {
    diceRoll = Math.random();
    if (diceRoll < 0.33) {
      this.setState({phase1Left: food,
                     phase1Middle: food,
                     phase1Right: this.excludeFoodType(foodString),
                     phase1Correct: ["correct","correct","incorrect"]});
    } else if (diceRoll > 0.66){
      this.setState({phase1Left: this.excludeFoodType(foodString),
                     phase1Middle: food,
                     phase1Right: food,
                     phase1Correct: ["incorrect","correct","correct"]});
    } else {
      this.setState({phase1Left: food,
                     phase1Middle: this.excludeFoodType(foodString),
                     phase1Right: food,
                     phase1Correct: ["correct","incorrect","correct"]});
    }
  }


  selectFoodPhase1() {
    switch(this.state.currentCreature) {
      case 1:
        this.selectFoodPhase1Helper(grassCharacter,"grass");
        break;
      case 2:
        this.selectFoodPhase1Helper(canCharacter,"can");
        break;
      case 3:
        this.selectFoodPhase1Helper(bugCharacter,"bug");
        break;
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
        this.setState({timeoutHuh: true,
                       showFood1: true,
                       showFood2: true,
                       showFood3: true,});
    }
  }

  toggleCreature = () => {
    if (this.state.currentCreature === 1) {
      this.setState({
        creatureKey1: Math.random(),
        creatureTween1: tweenMove(creatureEnd,creatureStart)});
    } else if (this.state.currentCreature === 2) {
      this.setState({
        creatureKey2: Math.random(),
        creatureTween2: tweenMove(creatureEnd,creatureStart)});
    } else {
      this.setState({
        creatureKey3: Math.random(),
        creatureTween3: tweenMove([Window.width-250,115],[700,115])});
    }
    diceRoll = Math.random();
    // ensures the same creature is not selected twice in a row
    switch(this.state.currentCreature) {
      case 1:
        if (diceRoll < 0.5) {
          this.setState({
            creatureKey2: Math.random(),
            creatureTween2: tweenMove(creatureStart, creatureEnd),
            currentCreature: 2,
          });
        } else {
          this.setState({
            creatureKey3: Math.random(),
            creatureTween3: tweenMove([700,115], [Window.width-250,115]),
            currentCreature: 3,
          });
        }
        break;
      case 2:
      if (diceRoll < 0.5) {
        this.setState({
          creatureKey1: Math.random(),
          creatureTween1: tweenMove(creatureStart, creatureEnd),
          currentCreature: 1,
        });
      } else {
        this.setState({
          creatureKey3: Math.random(),
          creatureTween3: tweenMove([700,115], [Window.width-250,115]),
          currentCreature: 3,
        });
      }
        break;
      case 3:
      if (diceRoll < 0.5) {
        this.setState({
          creatureKey1: Math.random(),
          creatureTween1: tweenMove(creatureStart, creatureEnd),
          currentCreature: 1,
        });
      } else {
        this.setState({
          creatureKey2: Math.random(),
          creatureTween2: tweenMove(creatureStart, creatureEnd),
          currentCreature: 2,
        });
      }
        break;
    }
  }

  removeFood1 = () => {
    this.setState({showFood1: false});
  }

  removeFood2 = () => {
    this.setState({showFood2: false});
  }

  removeFood3 = () => {
    this.setState({showFood3: false});
  }

  onFoodPress = (spriteKey) => {
    xvalue = 0;
    switch(spriteKey) {
      case 1:
         x = startLeft;
         this.setState({foodKey1: Math.random(),
                        foodTween11: tweenFall(x),
                        foodPressed: true});
         setTimeout(this.removeFood1,750);
        if (this.state.phase1Correct[0] === "correct") {
          this.setState({phase1AnsweredCorrectly: this.state.phase1AnsweredCorrectly+1});
          if (this.state.phase1AnsweredCorrectly >= 1) {
            clearTimeout(this.timeout1);
            clearTimeout(this.timeout2);
            setTimeout(this.toggleCreature,2000);
            this.setState({signKey1: Math.random(),
                           signKey2: Math.random(),
                           signKey3: Math.random(),
                           foodKey1: Math.random(),
                           foodKey2: Math.random(),
                           foodKey3: Math.random(),
                           signTween2: tweenTimeout(signEndTop,startTop),
                           foodTween13: tweenTimeout(foodEndTop,startTop),
                           foodTween12: tweenTimeout(foodEndTop,startTop),
                           foodPressed: false,
                           timeoutHuh: false,
                           phase1AnsweredCorrectly: 0,
                           numTrials: this.state.numTrials+1});
            if (this.state.phase1Correct[1] === "correct") {
              this.removeFood2();
            }
            if (this.state.phase1Correct[2] === "correct") {
              this.removeFood3();
            }
          }
          if (this.state.numTrials >= 8) {
            setTimeout(this.buttonPress,2000);
          }
        }
         break;
      case 2:

         x = startLeft+spacing;
         this.setState({foodKey2: Math.random(),
                        foodTween12: tweenFall(x),
                        foodPressed: true});
         setTimeout(this.removeFood2,750);
         if (this.state.phase1Correct[1] === "correct") {
           this.setState({phase1AnsweredCorrectly: this.state.phase1AnsweredCorrectly+1});
           if (this.state.phase1AnsweredCorrectly >= 1) {
             clearTimeout(this.timeout1);
             clearTimeout(this.timeout2);
             setTimeout(this.toggleCreature,2000);
             this.setState({signKey1: Math.random(),
                            signKey2: Math.random(),
                            signKey3: Math.random(),
                            foodKey1: Math.random(),
                            foodKey2: Math.random(),
                            foodKey3: Math.random(),
                            signTween2: tweenTimeout(signEndTop,startTop),
                            foodTween13: tweenTimeout(foodEndTop,startTop),
                            foodTween11: tweenTimeout(foodEndTop,startTop),
                            timeoutHuh: false,
                            foodPressed: false,
                            phase1AnsweredCorrectly: 0,
                            numTrials: this.state.numTrials+1});
              if (this.state.phase1Correct[0] === "correct") {
                this.removeFood1();
              }
              if (this.state.phase1Correct[2] === "correct") {
                this.removeFood3();
              }
           }
           if (this.state.numTrials >= 8) {
             setTimeout(this.buttonPress,2000);
           }
         }
         break;
      case 3:

         x = startLeft+spacing*2;
         this.setState({foodKey3: Math.random(),
                        foodTween13: tweenFall(x),
                        foodPressed: true});
         setTimeout(this.removeFood3,750);
         if (this.state.phase1Correct[2] === "correct") {
           this.setState({phase1AnsweredCorrectly: this.state.phase1AnsweredCorrectly+1});
           if (this.state.phase1AnsweredCorrectly >= 1) {
             clearTimeout(this.timeout1);
             clearTimeout(this.timeout2);
             setTimeout(this.toggleCreature,2000);
             this.setState({signKey1: Math.random(),
                            signKey2: Math.random(),
                            signKey3: Math.random(),
                            foodKey1: Math.random(),
                            foodKey2: Math.random(),
                            foodKey3: Math.random(),
                            signTween2: tweenTimeout(signEndTop,startTop),
                            foodTween11: tweenTimeout(foodEndTop,startTop),
                            foodTween12: tweenTimeout(foodEndTop,startTop),
                            foodPressed: false,
                            timeoutHuh: false,
                            phase1AnsweredCorrectly: 0,
                            numTrials: this.state.numTrials+1});
            if (this.state.phase1Correct[0] === "correct") {
              this.removeFood1();
            }
            if (this.state.phase1Correct[1] === "correct") {
              this.removeFood2();
            }
           }
           if (this.state.numTrials >= 8) {
             setTimeout(this.buttonPress,2000);
           }

         }
         break;
      case 4:
         x = startLeft2;
         this.setState({foodKey4: Math.random(),
                        foodTween01: tweenFall(x),
                        foodPressed: true,
                        signTween01: tweenTimeout(signEndTop,startTop),
                        foodTween02: tweenTimeout(foodEndTop,startTop),
                        signKey4: Math.random(),
                        signKey5: Math.random(),
                        foodKey5: Math.random(),
                        foodPressed: false,
                        timeoutHuh: false});
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
        this.setState({numTrials: this.state.numTrials+1});
        if (this.state.numTrials === 2) {
          this.setState({gamePhase: false});
        }
        if (this.state.phase0Correct === "left") {}
        setTimeout(this.toggleCreature,2000);
        break;
      case 5:
         x= startLeft2+spacing;
         this.setState({foodKey5: Math.random(),
                        foodTween02: tweenFall(x),
                        foodPressed: true,
                        signTween01: tweenTimeout(signEndTop,startTop),
                        foodTween01: tweenTimeout(foodEndTop,startTop),
                        signKey4: Math.random(),
                        signKey5: Math.random(),
                        foodKey4: Math.random(),
                        foodPressed: false,
                        timeoutHuh: false});
          clearTimeout(this.timeout1);
          clearTimeout(this.timeout2);
          this.setState({numTrials: this.state.numTrials+1});
          if (this.state.numTrials === 2) {
            this.setState({gamePhase: false});
          }
          if (this.state.phase0Correct === "right") {}
          setTimeout(this.toggleCreature,2000);
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
                <Text> numtrials: {this.state.numTrials} </Text>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween1}
                    key={this.state.creatureKey1}
                    character={mammalCharacter}/>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: 115, height: 160}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween2}
                    key={this.state.creatureKey2}
                    character={goatCharacter}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: 256, height: 256}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween3}
                    key={this.state.creatureKey3}
                    character={frogCharacter}/>
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
                    tween={this.state.signTween2}/>
                {this.state.showFood1 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Left}
                    key={this.state.foodKey1}
                    tweenStart="auto"
                    tween={this.state.foodTween11}
                    onPress={this.onFoodPress}
                    spriteKey={1}/>
                : null}
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing-30}}
                    key={this.state.signKey2}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}/>
                {this.state.showFood2 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Middle}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween12}
                    onPress={this.onFoodPress}
                    spriteKey={2}/>
                : null}
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
                    key={this.state.signKey3}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}/>
                {this.state.showFood3 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase1Right}
                    key={this.state.foodKey3}
                    tweenStart="auto"
                    tween={this.state.foodTween13}
                    onPress={this.onFoodPress}
                    spriteKey={3}/>
                : null}
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2-30}}
                    key={this.state.signKey4}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween01}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase0Left}
                    key={this.state.foodKey4}
                    tweenStart="auto"
                    tween={this.state.foodTween01}
                    onPress={this.onFoodPress}
                    spriteKey={4}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing-30}}
                    key={this.state.signKey5}
                    size={{width: 110, height: 170}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween01}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing}}
                    size={{width: 60, height: 60}}
                    draggable={false}
                    character={this.state.phase0Right}
                    key={this.state.foodKey5}
                    tweenStart="auto"
                    tween={this.state.foodTween02}
                    onPress={this.onFoodPress}
                    spriteKey={5}/>
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
