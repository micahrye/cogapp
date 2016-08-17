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
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import goatCharacter from "../../sprites/goat/goatCharacter";
import frogCharacter from "../../sprites/frog/frogCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import signCharacter from "../../sprites/sign/signCharacter";

// window dimensions
const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [Window.width*0.65,Window.height*0.5];
// these constants specify the initial/final locations and spacing
// and signs of the food items
const startLeft = Window.width*0.4;
//const startLeft2 = 325;
const startTop = -250;
const spacing = 200;
const foodEndTop = Window.height*0.2;
const signEndTop = -15;
// start/end for goat and mammal (frog has different dimensions and uses slightly
// different start amd end coordinates)
const creatureStart = [Window.width+500,Window.height*0.5];
const creatureEnd = [Window.width*0.65,Window.height*0.5];

class GameTwo2 extends Component {

  constructor(props) {
    super(props);
    // tweening constant for falling food/signs
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
    // tweening constant for returning food/signs to just beyond the top of
    // the screen
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
    // tweening constant for food/signs - warns of impending timeout
    tweenHop = function(startTop) {
      return (
        {
          tweenType: "hop",
          startY: startTop,
          loop: false,
        }
      );
    }
    // tweening constant used by food that has been pressed
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
    // tweening constant for moving creature characters on/off screen
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
    // a simple hop animation given to offscreen components on mounting
    // to avoid error (can't just give them null)
    tweenInitial = {
       tweenType: "hop",
       startY: startTop,
       loop: false,
    };

    this.state = {
      foodKey1: Math.random(), //keys for food,signs,creatures
      foodKey2: Math.random(),
      //foodKey3: Math.random(),
      signKey1: Math.random(),
      signKey2: Math.random(),
      //signKey3: Math.random(),
      creatureKey1: Math.random(),
      creatureKey2: Math.random(),
      creatureKey3: Math.random(),
      creatureKey4: Math.random(),
      phase1Left: grassCharacter, // variables that hold food sprites in phase1
      //phase1Middle: grassCharacter,
      phase1Right: grassCharacter,
      phase1Correct: ["incorrect","incorrect"], // tells which sprites are correct in phase1
      //phase1AnsweredCorrectly: 0, // prevents game from moving on to next trial after 1st correct sprite is pressed
      foodTween11: tweenInitial,
      foodTween12: tweenInitial,
      //foodTween13: tweenInitial,
      signTween2: tweenInitial,
      spriteAnimationKey1: 'default',
      spriteAnimationKey2: 'default',
      creatureTween1: tweenMove(creatureStart,creatureEnd), // holds tweens for creatures
      creatureTween2: tweenMove(creatureStart,creatureStart),
      creatureTween3: tweenMove(creatureStart,creatureStart),
      creatureTween4: tweenMove(creatureStart,creatureStart),
      currentCreature: 1, // indicates which kind of creature is currently on screen (starts with mammal) mammal=1,goat=2,frog=3
      timeoutHuh: false,  // these two prevent lever from activating new trial prematurely
      foodPressed: false,
      numTrials: 0, // keeps track of number of trials done so far (moves to next phase at 9)
      showFood1: true, // allows food sprites in phase 1 to be turned on/off
      showFood2: true,
      //showFood3: true,
    }
    this.timeout1 = undefined;
    this.timeout2 = undefined;
  }

  // moves the app to level 2
  buttonPress = () => {
      this.props.navigator.replace({
          id: 'GameTwo3',
      });
  }

  // handles the fifteen second timeout - if 15 seconds go by after
  // the lever is pulled the food/signs return to above the top of the screen
  // and toggleCreature() is called, displaying a new creature that needs
  // to be fed (this marks the start of a new trial so onTimeoutOne
  // increments numTrials as well)
  onTimeoutOne = () => {
          this.setState({foodTween11: tweenTimeout(foodEndTop,startTop),
                         foodTween12: tweenTimeout(foodEndTop,startTop),
                         //foodTween13: tweenTimeout(foodEndTop,startTop),
                         signTween2: tweenTimeout(signEndTop,startTop),
                         foodKey1: Math.random(),
                         foodKey2: Math.random(),
                         //foodKey3: Math.random(),
                         signKey1: Math.random(),
                         signKey2: Math.random(),
                        // signKey3: Math.random(),
                         numTrials: this.state.numTrials+1,
                         timeoutHuh: false,
                         foodPressed: false,});
          this.toggleCreature();
          if (this.state.numTrials >= 8) {
            setTimeout(this.buttonPress,2000);
          }
        this.setState({timeoutHuh: false});
  }

  // handles the 10 second timeout - if ten seconds go by after the lever
  // is pulled, the food/signs hop to indicate that time is running out
  onTimeoutTwo = () => {
        this.setState({foodTween11: tweenHop(foodEndTop),
                       foodTween12: tweenHop(foodEndTop),
                       //foodTween13: tweenHop(foodEndTop),
                       signTween2: tweenHop(signEndTop),
                       foodKey1: Math.random(),
                       foodKey2: Math.random(),
                       //foodKey3: Math.random(),
                       signKey1: Math.random(),
                       signKey2: Math.random()});
                       //signKey3: Math.random()});

  }

  // takes three items as input, selects 1 randomly - used by excludeFoodType
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

  randomFood2() {
    diceRoll = Math.random();
    if (diceRoll < 0.25) {
      return [canCharacter,"can"];
    } else if (diceRoll > 0.5 && diceRoll > 0.25) {
      return [bugCharacter,"bug"];
    } else if (diceRoll < 0.75 && diceRoll > 0.5) {
      return [grassCharacter,"grass"];
    } else {
      return [appleCharacter,"apple"];
    }
  }

  // used in selecting food sprites for each trial: given a certain kind of food,
  // excludeFoodType will select one of the remaining three types at random.
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

  excludeColor(color) {
    switch(color) {
      case "green":
        return this.randomFood("blue","red","yellow");
        break;
      case "blue":
        return this.randomFood("green","red","yellow");
        break;
      case "red":
        return this.randomFood("green","blue","yellow");
        break;
      case "yellow":
        return this.randomFood("green","blue","red");
        break;
    }
  }


  // works the same way as the phase0 helper function but handles three
  // food sprites, instead of just two.
  // selectFoodPhase1Helper(food,foodString) {
  //   diceRoll = Math.random();
  //   if (diceRoll < 0.33) {
  //     this.setState({phase1Left: food,
  //                    phase1Middle: food,
  //                    phase1Right: this.excludeFoodType(foodString),
  //                    phase1Correct: ["correct","correct","incorrect"]});
  //   } else if (diceRoll > 0.66){
  //     this.setState({phase1Left: this.excludeFoodType(foodString),
  //                    phase1Middle: food,
  //                    phase1Right: food,
  //                    phase1Correct: ["incorrect","correct","correct"]});
  //   } else {
  //     this.setState({phase1Left: food,
  //                    phase1Middle: this.excludeFoodType(foodString),
  //                    phase1Right: food,
  //                    phase1Correct: ["correct","incorrect","correct"]});
  //   }
  // }

  // assigns food sprites for a phase1 trial
  selectFoodPhase1() {
    diceRoll = Math.random();
    switch(this.state.currentCreature) {
      case 1:
        food = this.randomFood2();
        if (diceRoll < 0.5) {
          this.setState({phase1Left: food[0],
                         spriteAnimationKey1: "green",
                         phase1Right: this.excludeFoodType(food[1]),
                         spriteAnimationKey2: this.excludeColor("green"),
                         phase1Correct: ["correct","incorrect"]});
        } else {
          this.setState({phase1Right: food[0],
                         spriteAnimationKey2: "green",
                         phase1Left: this.excludeFoodType(food[1]),
                         spriteAnimationKey1: this.excludeColor("green"),
                         phase1Correct: ["incorrect","correct"]});
        }
        break;
      case 2:
      food = this.randomFood2();
        if (diceRoll < 0.5) {
          this.setState({phase1Left: food[0],
                         spriteAnimationKey1: "blue",
                         phase1Right: this.excludeFoodType(food[1]),
                         spriteAnimationKey2: this.excludeColor("blue"),
                         phase1Correct: ["correct","incorrect"]});
        } else {
          this.setState({phase1Right: food[0],
                         spriteAnimationKey2: "blue",
                         phase1Left: this.excludeFoodType(food[1]),
                         spriteAnimationKey1: this.excludeColor("blue"),
                         phase1Correct: ["incorrect","correct"]});
        }
        break;
      case 3:
        food = this.randomFood2();
          if (diceRoll < 0.5) {
            this.setState({phase1Left: food[0],
                           spriteAnimationKey1: "red",
                           phase1Right: this.excludeFoodType(food[1]),
                           spriteAnimationKey2: this.excludeColor("red"),
                           phase1Correct: ["correct","incorrect"]});
          } else {
            this.setState({phase1Right: food[0],
                           spriteAnimationKey2: "red",
                           phase1Left: this.excludeFoodType(food[1]),
                           spriteAnimationKey1: this.excludeColor("red"),
                           phase1Correct: ["incorrect","correct"]});
          }
        break;
      case 4:
        food = this.randomFood2();
          if (diceRoll < 0.5) {
            this.setState({phase1Left: food[0],
                           spriteAnimationKey1: "yellow",
                           phase1Right: this.excludeFoodType(food[1]),
                           spriteAnimationKey2: this.excludeColor("yellow"),
                           phase1Correct: ["correct","incorrect"]});
          } else {
            this.setState({phase1Right: food[0],
                           spriteAnimationKey2: "yellow",
                           phase1Left: this.excludeFoodType(food[1]),
                           spriteAnimationKey1: this.excludeColor("yellow"),
                           phase1Correct: ["incorrect","correct"]});
          }
        break;
    }

  }

  // onLeverTouch sets timeouts, selects new food sprites, and drops
  // the food sprites/signs down from the top of the screen so they're visible
  onLeverTouch = () => {
    if (!this.state.timeoutHuh && !this.state.foodPressed) {
        this.timeout1 = setTimeout(this.onTimeoutOne,15000);
        this.timeout2 = setTimeout(this.onTimeoutTwo,10000);
          this.selectFoodPhase1();
          this.setState({foodTween11: tweenDown(startTop,foodEndTop),
                         foodTween12: tweenDown(startTop,foodEndTop),
                         //foodTween13: tweenDown(startTop,foodEndTop),
                         signTween2: tweenDown(startTop,signEndTop),
                         foodKey1: Math.random(),
                         foodKey2: Math.random(),
                         //foodKey3: Math.random(),
                         signKey1: Math.random(),
                         signKey2: Math.random()});


        this.setState({timeoutHuh: true,
                       showFood1: true, // resets all food so it's visible, just in case it's been changed in a previous trial
                       showFood2: true});
                       //showFood3: true,});
    }
  }

  // moves the current creature off the screen and sends a new, different one on
  toggleCreature = () => {
    // this part moves the current creature off to the right
    if (this.state.currentCreature === 1) {
      this.setState({
        creatureKey1: Math.random(),
        creatureTween1: tweenMove(creatureEnd,creatureStart)});
    } else if (this.state.currentCreature === 2) {
      this.setState({
        creatureKey2: Math.random(),
        creatureTween2: tweenMove(creatureEnd,creatureStart)});
    } else  if (this.state.currentCreature === 3){
      this.setState({
        creatureKey3: Math.random(),
        creatureTween3: tweenMove(creatureEnd,creatureStart)});
    } else {
      this.setState({
        creatureKey4: Math.random(),
        creatureTween4: tweenMove(creatureEnd,creatureStart)});
    }
    diceRoll = Math.random();
    // this part ensures the same creature is not selected twice in a row
    switch(this.state.currentCreature) {
      case 1:
        if (diceRoll < 0.33) {
          this.setState({
            creatureKey2: Math.random(),
            creatureTween2: tweenMove(creatureStart, creatureEnd),
            currentCreature: 2,
          });
        } else if (diceRoll > 0.66) {
          this.setState({
            creatureKey3: Math.random(),
            creatureTween3: tweenMove(creatureStart, creatureEnd),
            currentCreature: 3,
          });
        } else {
          this.setState({
            creatureKey4: Math.random(),
            creatureTween4: tweenMove(creatureStart, creatureEnd),
            currentCreature: 4,
          });
        }
        break;
      case 2:
      if (diceRoll < 0.33) {
        this.setState({
          creatureKey1: Math.random(),
          creatureTween1: tweenMove(creatureStart, creatureEnd),
          currentCreature: 1,
        });
      } else if (diceRoll > 0.66){
        this.setState({
          creatureKey3: Math.random(),
          creatureTween3: tweenMove(creatureStart, creatureEnd),
          currentCreature: 3,
        });
      } else {
        this.setState({
          creatureKey4: Math.random(),
          creatureTween4: tweenMove(creatureStart, creatureEnd),
          currentCreature: 4,
        });
      }
        break;
      case 3:
      if (diceRoll < 0.33) {
        this.setState({
          creatureKey1: Math.random(),
          creatureTween1: tweenMove(creatureStart, creatureEnd),
          currentCreature: 1,
        });
      } else if (diceRoll > 0.66){
        this.setState({
          creatureKey2: Math.random(),
          creatureTween2: tweenMove(creatureStart, creatureEnd),
          currentCreature: 2,
        });
      } else {
        this.setState({
          creatureKey4: Math.random(),
          creatureTween4: tweenMove(creatureStart, creatureEnd),
          currentCreature: 4,
        });
      }
        break;
      case 4:
        if (diceRoll < 0.33) {
          this.setState({
            creatureKey1: Math.random(),
            creatureTween1: tweenMove(creatureStart, creatureEnd),
            currentCreature: 1,
          });
        } else if (diceRoll > 0.66){
          this.setState({
            creatureKey2: Math.random(),
            creatureTween2: tweenMove(creatureStart, creatureEnd),
            currentCreature: 2,
          });
        } else {
          this.setState({
            creatureKey3: Math.random(),
            creatureTween3: tweenMove(creatureStart, creatureEnd),
            currentCreature: 3,
          });
        }
        break;
    }
  }

  // helper functions that allow showFood variables to be switched using
  // setTimeout calls (setState cannot be called directly within a setTimeout)
  removeFood1 = () => {
    this.setState({showFood1: false});
  }

  removeFood2 = () => {
    this.setState({showFood2: false});
  }

  // removeFood3 = () => {
  //   this.setState({showFood3: false});
  // }

  // Handles the events that need to occur when any food item is pressed
  onFoodPress = (spriteKey) => {
    xvalue = 0;
    switch(spriteKey) {
      case 1: // (leftmost food sprite in phase 1)
         x = startLeft;
         this.setState({foodKey1: Math.random(),
                        foodTween11: tweenFall(x),
                        foodPressed: true});
            clearTimeout(this.timeout1);
            clearTimeout(this.timeout2);
            setTimeout(this.toggleCreature,2000);
            this.setState({signKey1: Math.random(),
                           signKey2: Math.random(),
                           //signKey3: Math.random(),
                           foodKey1: Math.random(),
                           foodKey2: Math.random(),
                           //foodKey3: Math.random(),
                           signTween2: tweenTimeout(signEndTop,startTop),
                           //foodTween13: tweenTimeout(foodEndTop,startTop),
                           foodTween12: tweenTimeout(foodEndTop,startTop),
                           foodPressed: false,
                           timeoutHuh: false,
                           phase1AnsweredCorrectly: 0,
                           numTrials: this.state.numTrials+1});

          if (this.state.numTrials >= 5) {
            this.setState({timeoutHuh: true});
            setTimeout(this.buttonPress,2000);
          }
         break;
      case 2: // (right food sprite in phase 1)
         x = startLeft+spacing;
         this.setState({foodKey2: Math.random(),
                        foodTween12: tweenFall(x),
                        foodPressed: true});
             clearTimeout(this.timeout1);
             clearTimeout(this.timeout2);
             setTimeout(this.toggleCreature,2000);
             this.setState({signKey1: Math.random(),
                            signKey2: Math.random(),
                            //signKey3: Math.random(),
                            foodKey1: Math.random(),
                            foodKey2: Math.random(),
                            //foodKey3: Math.random(),
                            signTween2: tweenTimeout(signEndTop,startTop),
                            //foodTween13: tweenTimeout(foodEndTop,startTop),
                            foodTween11: tweenTimeout(foodEndTop,startTop),
                            timeoutHuh: false,
                            foodPressed: false,
                            phase1AnsweredCorrectly: 0,
                            numTrials: this.state.numTrials+1});
           if (this.state.numTrials >= 8) {
             this.setState({timeoutHuh: true});
             setTimeout(this.buttonPress,2000);
         }
         break;
      // case 3:  // (rightmost food sprite in phase 1)
      //    x = startLeft+spacing*2;
      //    this.setState({foodKey3: Math.random(),
      //                   foodTween13: tweenFall(x),
      //                   foodPressed: true});
      //    setTimeout(this.removeFood3,750);
      //    if (this.state.phase1Correct[2] === "correct") {
      //      this.setState({phase1AnsweredCorrectly: this.state.phase1AnsweredCorrectly+1});
      //      if (this.state.phase1AnsweredCorrectly >= 1) {
      //        clearTimeout(this.timeout1);
      //        clearTimeout(this.timeout2);
      //        setTimeout(this.toggleCreature,2000);
      //        this.setState({signKey1: Math.random(),
      //                       signKey2: Math.random(),
      //                       signKey3: Math.random(),
      //                       foodKey1: Math.random(),
      //                       foodKey2: Math.random(),
      //                       foodKey3: Math.random(),
      //                       signTween2: tweenTimeout(signEndTop,startTop),
      //                       foodTween11: tweenTimeout(foodEndTop,startTop),
      //                       foodTween12: tweenTimeout(foodEndTop,startTop),
      //                       foodPressed: false,
      //                       timeoutHuh: false,
      //                       phase1AnsweredCorrectly: 0,
      //                       numTrials: this.state.numTrials+1});
      //       if (this.state.phase1Correct[0] === "correct") {
      //         this.removeFood1();
      //       }
      //       if (this.state.phase1Correct[1] === "correct") {
      //         this.removeFood2();
      //       }
      //      }
      //      if (this.state.numTrials >= 8) {
      //        this.setState({timeoutHuh: true});
      //        setTimeout(this.buttonPress,2000);
      //      }
      //
      //    }
      //    break;
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
                <TouchableOpacity onPress={this.buttonPress}>
                <Text> numtrials: {this.state.numTrials} </Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween1}
                    key={this.state.creatureKey1}
                    spriteAnimationKey={"green"}
                    loopAnimation={true}
                    character={omnivoreCharacter}/>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween2}
                    key={this.state.creatureKey2}
                    spriteAnimationKey={"blue"}
                    loopAnimation={true}
                    character={omnivoreCharacter}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween3}
                    key={this.state.creatureKey3}
                    spriteAnimationKey={"red"}
                    loopAnimation={true}
                    character={omnivoreCharacter}/>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween4}
                    key={this.state.creatureKey4}
                    spriteAnimationKey={"yellow"}
                    loopAnimation={true}
                    character={omnivoreCharacter}/>
                <AnimatedSprite coordinates={{top:100,left:-5}}
                    size={{width:Window.width/6,height:(Window.width/6)*0.878}}
                    draggable={false}
                    character={leverCharacter}
                    tweenStart="touch"
                    tween={tweenOptsLever}
                    onPress={this.onLeverTouch}/>
                <AnimatedSprite coordinates={{top: startTop, left: startLeft-30}}
                    key={this.state.signKey1}
                    size={{width: Window.width/7, height: (Window.width/7)*1.596}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}/>
                {this.state.showFood1 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
                    size={{width: Window.width/11, height: Window.width/11}}
                    draggable={false}
                    character={this.state.phase1Left}
                    key={this.state.foodKey1}
                    tweenStart="auto"
                    tween={this.state.foodTween11}
                    onPress={this.onFoodPress}
                    spriteKey={1}
                    spriteAnimationKey={this.state.spriteAnimationKey1}
                    loopAnimation={true}/>
                : null}
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing-30}}
                    key={this.state.signKey2}
                    size={{width: Window.width/7, height: (Window.width/7)*1.596}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}/>
                {this.state.showFood2 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
                    size={{width: Window.width/11, height: Window.width/11}}
                    draggable={false}
                    character={this.state.phase1Right}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween12}
                    onPress={this.onFoodPress}
                    spriteKey={2}
                    spriteAnimationKey={this.state.spriteAnimationKey2}
                    loopAnimation={true}/>
                : null}
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
})

export default GameTwo2


// <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
//     key={this.state.signKey3}
//     size={{width: 110, height: 170}}
//     draggable={false}
//     character={signCharacter}
//     tweenStart="auto"
//     tween={this.state.signTween2}/>
// {this.state.showFood3 ?
// <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
//     size={{width: 60, height: 60}}
//     draggable={false}
//     character={this.state.phase1Right}
//     key={this.state.foodKey3}
//     tweenStart="auto"
//     tween={this.state.foodTween13}
//     onPress={this.onFoodPress}
//     spriteKey={3}/>
// : null}
