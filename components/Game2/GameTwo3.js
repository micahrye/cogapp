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
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import OmnivoreGreen from "../../sprites/omnivore/OmnivoreGreen";
import OmnivoreBlue from "../../sprites/omnivore/OmnivoreBlue";
import OmnivoreRed from "../../sprites/omnivore/OmnivoreRed";
import OmnivoreYellow from "../../sprites/omnivore/OmnivoreYellow";
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
const endCoordinates2 = [Window.width*0.6,Window.height*0.4];
// these constants specify the initial/final locations and spacing
// and signs of the food items
const startLeft = Window.width*0.25;
const startLeft2 = Window.width*0.35;
const startTop = -250;
const spacing = 200;
const foodEndTop = Window.height*0.2;
const signEndTop = -15;
// start/end for goat and mammal (frog has different dimensions and uses slightly
// different start amd end coordinates)
const creatureStart = [Window.width+500,Window.height*0.5];
const creatureEnd = [Window.width*0.65,Window.height*0.5];

class GameTwo3 extends Component {

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
          duration: 1500,
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

    this.state = {
      foodKey1: Math.random(), //keys for food,signs,creatures
      foodKey2: Math.random(),
      foodKey3: Math.random(),
      signKey1: Math.random(),
      signKey2: Math.random(),
      signKey3: Math.random(),
      creatureKey1: Math.random(),
      creatureKey2: Math.random(),
      creatureKey3: Math.random(),
      creatureKey4: Math.random(),
      creatureKey5: Math.random(),
      creatureKey6: Math.random(),
      creatureKey7: Math.random(),
      phase1Left: grassCharacter, // variables that hold food sprites in phase1
      phase1Middle: grassCharacter,
      phase1Right: grassCharacter,
      phase1Correct: ["incorrect","incorrect","incorrect"], // tells which sprites are correct in phase1
      phase1Pressed: "left",
      foodTween11: tweenInitial,
      foodTween12: tweenInitial,
      foodTween13: tweenInitial,
      signTween2: tweenInitial,
      creatureTween1: tweenMove(creatureStart,creatureStart), // holds tweens for creatures
      creatureTween2: tweenMove(creatureStart,creatureStart),
      creatureTween3: tweenMove(creatureStart,creatureStart),
      creatureTween4: tweenMove(creatureStart,creatureStart),
      creatureTween5: tweenMove(creatureStart,creatureStart),
      creatureTween6: tweenMove(creatureStart,creatureStart),
      creatureTween7: tweenMove(creatureStart,creatureStart),
      previousCreature: -1,
      currentCreature: -1, // indicates which kind of creature is currently on screen (starts with mammal) mammal=1,goat=2,frog=3
      timeoutHuh: false,  // these two prevent lever from activating new trial prematurely
      foodFalling: false,
      numTrials: 0, // keeps track of number of trials done so far (moves to next phase at 9)
      showFood1: true, // allows food sprites in phase 1 to be turned on/off
      showFood2: true,
      showFood3: true,
      spriteAnimationKey1: 'default',
      spriteAnimationKey2: 'default',
      spriteAnimationKey3: 'default',
      animation: "default",
    }
    this.timeout1 = undefined;
    this.timeout2 = undefined;
    readyToEat = false;
  }

  randomNumNeutral() {
    diceRoll = Math.random();
    if (diceRoll < 0.33) {
      return 1;
    } else if (diceRoll > 0.66) {
      return 2;
    } else {
      return 3;
    }
  }

  setNeutral(num) {
    this.setState({previousCreature: this.state.currentCreature});
    switch(num) {
      case 1:
        this.setState({creatureTween1:tweenMove(creatureStart,creatureEnd),
                       creatureKey1: Math.random(),
                       currentCreature: num});
        break;
      case 2:
        this.setState({creatureTween2:tweenMove(creatureStart,creatureEnd),
                       creatureKey2: Math.random(),
                       currentCreature: num});
        break;
      case 3:
        this.setState({creatureTween3: tweenMove([Window.width+500,Window.height*0.4],
                                                 [Window.width*0.65,Window.height*0.4]),
                       creatureKey3: Math.random(),
                       currentCreature: num});
        break;
    }
  }

  randomNumOmnivore() {
    diceRoll = Math.random();
    if (diceRoll < 0.25) {
      return 4;
    } else if (diceRoll > 0.25 && diceRoll < 0.5) {
      return 5;
    } else if (diceRoll > 0.5 && diceRoll < 0.75) {
      return 6;
    } else {
      return 7;
    }
  }

  setOmnivore(num) {
    this.setState({previousCreature: this.state.currentCreature});
    switch(num) {
      case 4:
        this.setState({creatureTween4:tweenMove(creatureStart,creatureEnd),
                       creatureKey4: Math.random(),
                       currentCreature: num});
        break;
      case 5:
        this.setState({creatureTween5:tweenMove(creatureStart,creatureEnd),
                       creatureKey5: Math.random(),
                       currentCreature: num});
        break;
      case 6:
        this.setState({creatureTween6:tweenMove(creatureStart,creatureEnd),
                       creatureKey6: Math.random(),
                       currentCreature: num});
        break;
      case 7:
        this.setState({creatureTween7:tweenMove(creatureStart,creatureEnd),
                       creatureKey7: Math.random(),
                       currentCreature: num});
        break;
    }
  }

  componentDidMount() {
    diceRoll = Math.random();
    if (diceRoll < 0.5) {
      this.setNeutral(this.randomNumNeutral());
    } else {
      this.setOmnivore(this.randomNumOmnivore());
    }

  }

  componentWillUnmount() {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
  }

  // moves the app to level 2
  buttonPress = () => {
      this.props.navigator.replace({
          id: 'Main',
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
                         foodFalling: false,});
          this.toggleCreature();
          if (this.state.numTrials >= 12) {
            setTimeout(this.buttonPress,100);
          }
        this.setState({timeoutHuh: false});
  }

  // handles the 10 second timeout - if ten seconds go by after the lever
  // is pulled, the food/signs hop to indicate that time is running out
  onTimeoutTwo = () => {
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
      return [grassCharacter,"grass"];
    } else if (diceRoll > 0.25 && diceRoll < 0.5) {
      return [canCharacter,"can"];
    } else if (diceRoll > 0.25 && diceRoll < 0.75){
      return [bugCharacter,"bug"];
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

  randomColor() {
    diceRoll = Math.random();
    if (diceRoll < 0.25) {
      return "green";
    } else if (diceRoll > 0.5 && diceRoll > 0.25) {
      return "blue";
    } else if (diceRoll < 0.75 && diceRoll > 0.5) {
      return "red";
    } else {
      return "yellow";
    }
  }

  // works the same way as the phase0 helper function but handles three
  // food sprites, instead of just two.
  selectFoodPhase1HelperNeutral(food,foodString) {
    diceRoll = Math.random();
    diceRoll2 = Math.random();
    c1 = this.randomColor();
    c2 = this.excludeColor(c1);
    if (diceRoll < 0.33) {
      this.setState({phase1Left: food,
                     phase1Middle: food,
                     phase1Right: this.excludeFoodType(foodString),
                     phase1Correct: ["correct","correct","incorrect"]});
      if (diceRoll2 < 0.5) {
        this.setState({spriteAnimationKey1: c1,
                       spriteAnimationKey2: c2,
                       spriteAnimationKey3: c2});
      } else {
        this.setState({spriteAnimationKey1: c2,
                       spriteAnimationKey2: c1,
                       spriteAnimationKey3: c2,});
      }
    } else if (diceRoll > 0.66){
      this.setState({phase1Left: this.excludeFoodType(foodString),
                     phase1Middle: food,
                     phase1Right: food,
                     phase1Correct: ["incorrect","correct","correct"]});
       if (diceRoll2 < 0.5) {
         this.setState({spriteAnimationKey1: c2,
                       spriteAnimationKey2: c1,
                       spriteAnimationKey3: c2});
        } else {
         this.setState({spriteAnimationKey1: c2,
                        spriteAnimationKey2: c2,
                        spriteAnimationKey3: c1,});
         }
    } else {
      this.setState({phase1Left: food,
                     phase1Middle: this.excludeFoodType(foodString),
                     phase1Right: food,
                     phase1Correct: ["correct","incorrect","correct"]});
      if (diceRoll2 < 0.5) {
        this.setState({spriteAnimationKey1: c2,
                       spriteAnimationKey2: c2,
                       spriteAnimationKey3: c1});
        } else {
          this.setState({spriteAnimationKey1: c1,
                         spriteAnimationKey2: c2,
                         spriteAnimationKey3: c2,});
        }
    }
  }

  selectFoodPhase1HelperOmnivore(color) {
    diceRoll = Math.random();
    color2 = this.excludeColor(color);
    f = this.randomFood2();
    char1 = f[0];
    char2 = this.excludeFoodType(f[1]);
    if (diceRoll < 0.16) {
      this.setState({phase1Left: char1,
                     phase1Middle: char1,
                     phase1Right: char2,
                     spriteAnimationKey1: color2,
                     spriteAnimationKey2: color,
                     spriteAnimationKey3: color,
                     phase1Correct: ["incorrect","correct","correct"]});
    } else if (diceRoll > 0.16 && diceRoll < 0.32) {
      this.setState({phase1Left: char1,
                     phase1Middle: char2,
                     phase1Right: char1,
                     spriteAnimationKey1: color2,
                     spriteAnimationKey2: color,
                     spriteAnimationKey3: color,
                     phase1Correct: ["incorrect","correct","correct"]});
    } else if (diceRoll > 0.32 && diceRoll < 0.48) {
      this.setState({phase1Left: char1,
                     phase1Middle: char2,
                     phase1Right: char1,
                     spriteAnimationKey1: color,
                     spriteAnimationKey2: color,
                     spriteAnimationKey3: color2,
                     phase1Correct: ["correct","correct","incorrect"]});
    } else if (diceRoll > 0.48 && diceRoll < 0.64) {
      this.setState({phase1Left: char2,
                     phase1Middle: char1,
                     phase1Right: char1,
                     spriteAnimationKey1: color,
                     spriteAnimationKey2: color,
                     spriteAnimationKey3: color2,
                     phase1Correct: ["correct","correct","incorrect"]});
    } else if (diceRoll > 0.64 && diceRoll < 0.8) {
      this.setState({phase1Left: char2,
                     phase1Middle: char1,
                     phase1Right: char1,
                     spriteAnimationKey1: color,
                     spriteAnimationKey2: color2,
                     spriteAnimationKey3: color,
                     phase1Correct: ["correct","incorrect","correct"]});
    } else {
      this.setState({phase1Left: char1,
                     phase1Middle: char1,
                     phase1Right: char2,
                     spriteAnimationKey1: color,
                     spriteAnimationKey2: color2,
                     spriteAnimationKey3: color,
                     phase1Correct: ["correct","incorrect","correct"]});
    }

  }

  generateFood() {
    diceRoll = Math.random();
      if (diceRoll < 0.25) {
        return [grassCharacter,"grass"];
      } else if (diceRoll > 0.25 && diceRoll < 0.5) {
        return [canCharacter,"can"];
     } else if (diceRoll > 0.5 && diceRoll < 0.75) {
       return [appleCharacter,"apple"];
     } else {
       return [bugCharacter,"bug"];
     }
   }

  // assigns food sprites for a phase1 trial
  selectFoodPhase1() {
    f = this.generateFood();
    switch (this.state.currentCreature) {
      case 1:
        this.selectFoodPhase1HelperNeutral(grassCharacter,"grass");
        break;
      case 2:
        this.selectFoodPhase1HelperNeutral(canCharacter,"can");
        break;
      case 3:
        this.selectFoodPhase1HelperNeutral(bugCharacter,"bug");
        break;
      case 4:
        this.selectFoodPhase1HelperOmnivore("green");
        break;
      case 5:
        this.selectFoodPhase1HelperOmnivore("blue");
        break;
      case 6:
        this.selectFoodPhase1HelperOmnivore("red");
        break;
      case 7:
        this.selectFoodPhase1HelperOmnivore("yellow");
        break;
    }
  }

  // onLeverTouch sets timeouts, selects new food sprites, and drops
  // the food sprites/signs down from the top of the screen so they're visible
  onLeverTouch = () => {
    if (!this.state.timeoutHuh && !this.state.foodFalling) {
        this.timeout1 = setTimeout(this.onTimeoutOne,15000);
        this.timeout2 = setTimeout(this.onTimeoutTwo,10000);
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
        this.setState({timeoutHuh: true,
                       showFood1: true, // resets all food so it's visible, just in case it's been changed in a previous trial
                       showFood2: true,
                       showFood3: true,});
    }
  }

  selectNewCreature() {
    previousCreature = this.state.previousCreature;
    currentCreature = this.state.currentCreature;
    if (previousCreature <=3 && currentCreature <=3) {
      this.setOmnivore(this.randomNumOmnivore());
    } else if (previousCreature >= 4 && currentCreature >= 4) {
      this.setNeutral(this.randomNumNeutral());
    } else if (previousCreature <=3 && currentCreature >= 4) {
      diceRoll = Math.random();
      if (diceRoll < 0.3) {
        r = this.randomNumOmnivore();
        if (r === this.state.currentCreature) {
          this.selectNewCreature();
        } else {
          this.setOmnivore(r);
        }
      } else {
        r = this.randomNumNeutral();
        this.setNeutral(r);
      }
    } else if (previousCreature >=4 && currentCreature <=3) {
      diceRoll = Math.random();
      if (diceRoll < 0.3) {
        r = this.randomNumNeutral();
        if (r === this.state.currentCreature) {
          this.selectNewCreature();
        } else {
          this.setNeutral(r);
        }
      } else {
        r = this.randomNumOmnivore();
        this.setOmnivore(r);
      }
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
    } else if (this.state.currentCreature === 3) {
      this.setState({
        creatureKey3: Math.random(),
        creatureTween3: tweenMove([Window.width*0.65,Window.height*0.4],
                                 [Window.width+500,Window.height*0.4])});
    } else if (this.state.currentCreature === 4) {
      this.setState({
        creatureKey4: Math.random(),
        creatureTween4: tweenMove(creatureEnd,creatureStart)});
    } else if (this.state.currentCreature === 5) {
      this.setState({
        creatureKey5: Math.random(),
        creatureTween5: tweenMove(creatureEnd,creatureStart)});
    } else if (this.state.currentCreature === 6) {
      this.setState({
        creatureKey6: Math.random(),
        creatureTween6: tweenMove(creatureEnd,creatureStart)});
    } else {
      this.setState({
        creatureKey7: Math.random(),
        creatureTween7: tweenMove(creatureEnd,creatureStart)});
    }
    if (this.state.numTrials >= 12) {
      this.buttonPress()
    } else {
      this.selectNewCreature();
    }
  }

  // helper functions that allow showFood variables to be switched using
  // setTimeout calls (setState cannot be called directly within a setTimeout)
  removeFood(num) {
    switch(num) {
      case 1:
        this.setState({showFood1: false});
        break;
      case 2:
        this.setState({showFood2: false});
        break;
      case 3:
        this.setState({showFood3: false});
        break;
    }
  }

  // Handles the events that need to occur when any food item is pressed
  onFoodPress = (spriteKey) => {
    readyToEat = true;
    xvalue = 0;
    // open current creature's mouth
    switch(this.state.currentCreature) {
      case 1:
        this.setState({creatureKey1: Math.random(),animation: "openMouth"})
        break;
      case 2:
        this.setState({creatureKey2: Math.random(),animation: "openMouth"})
        break;
      case 3:
        this.setState({creatureKey3: Math.random(), animation: "default"})
        break;
      case 4:
        this.setState({creatureKey4: Math.random(), animation: "openMouth"})
        break;
      case 5:
        this.setState({creatureKey5: Math.random(),animation: "openMouth"})
        break;
      case 6:
        this.setState({creatureKey6: Math.random(), animation: "openMouth"})
        break;
      case 7:
        this.setState({creatureKey7: Math.random(), animation: "openMouth"})
        break;

    }
    switch(spriteKey) {
      case 1: // (leftmost food sprite in phase 1)
         x = startLeft;
         this.setState({foodKey1: Math.random(),
                        foodTween11: tweenFall(x),
                        foodFalling: true,
                        phase1Pressed: "left"});
          clearTimeout(this.timeout1);
          clearTimeout(this.timeout2);
          this.setState({phase1AnsweredCorrectly: 0,
                         numTrials: this.state.numTrials+1});
      case 2: // (middle food sprite in phase 1)
         x = startLeft+spacing;
         this.setState({foodKey2: Math.random(),
                        foodTween12: tweenFall(x),
                        foodFalling: true,
                        phase1Pressed: "middle"});
         clearTimeout(this.timeout1);
         clearTimeout(this.timeout2);
         this.setState({timeoutHuh: false,
                         numTrials: this.state.numTrials+1});
      case 3:  // (rightmost food sprite in phase 1)
         x = startLeft+spacing*2;
         this.setState({foodKey3: Math.random(),
                        foodTween13: tweenFall(x),
                        foodFalling: true,
                        phase1Pressed: "right"});
         clearTimeout(this.timeout1);
         clearTimeout(this.timeout2);
         this.setState({timeoutHuh: false,
                        numTrials: this.state.numTrials+1});
         break;
    }
  }

  onTweenEndCreature = () => {
    switch(this.state.currentCreature) {
      case 1:
        this.setState({creatureTween1: tweenStatic(creatureEnd)})
        break;
      case 2:
        this.setState({creatureTween2: tweenStatic(creatureEnd)})
        break;
      case 3:
        this.setState({creatureTween3: tweenStatic(creatureEnd)})
        break;
      case 4:
        this.setState({creatureTween4: tweenStatic(creatureEnd)})
        break;
      case 5:
        this.setState({creatureTween5: tweenStatic(creatureEnd)})
        break;
      case 6:
        this.setState({creatureTween6: tweenStatic(creatureEnd)})
        break;
      case 7:
        this.setState({creatureTween7: tweenStatic(creatureEnd)})
        break;
    }
  }

  onTweenEndFood = () => {
    switch(this.state.currentCreature) {
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
      case 4:
      if (readyToEat) {
        this.setState({animation: "chew", creatureKey4: Math.random()})
      }
      case 5:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey5: Math.random()})
        }
        break;
      case 6:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey6: Math.random()})
        }
        break;
      case 7:
      if (readyToEat) {
        this.setState({animation: "chew", creatureKey7: Math.random()})
      }
    }
    readyToEat = false;
  }

  onAnimationFinish(animationKey) {
    switch(animationKey) {
      case "walk":
        this.setState({animation: "default"})
        break;
      case "celebrate":
        this.setState({foodFalling: false})
        this.setState({animation: "walk"})
        this.setState({signKey1: Math.random(),
                       signKey2: Math.random(),
                       signKey3: Math.random(),
                       foodKey1: Math.random(),
                       foodKey2: Math.random(),
                       foodKey3: Math.random(),
                       signTween2: tweenTimeout(signEndTop,startTop),
                       foodTween13: tweenTimeout(signEndTop, startTop),
                       foodTween12: tweenTimeout(foodEndTop,startTop),
                       foodTween11: tweenTimeout(foodEndTop,startTop)}),
         setTimeout(this.toggleCreature,500);
        break;
      case "disgust":
        this.setState({foodFalling: false,
                       animation: "default"});
        break;
      case "chew":
        if (this.state.phase1Pressed === "left") {
          if (this.state.phase1Correct[0] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(1);
        } else if (this.state.phase1Pressed === "middle") {
          if (this.state.phase1Correct[1] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(2)
        } else if (this.state.phase1Pressed === "right") {
          if (this.state.phase1Correct[2] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(3)
        }

      switch(this.state.currentCreature) {
        case 1:
          this.setState({creatureKey1: Math.random()})
          break;
        case 2:
          this.setState({creatureKey2: Math.random()})
          break;
        case 3:
          this.setState({creatureKey3: Math.random()})
          break;
        case 4:
          this.setState({creatureKey4: Math.random()})
          break;
        case 5:
          this.setState({creatureKey5: Math.random()})
          break;
        case 6:
          this.setState({creatureKey6: Math.random()})
          break;
        case 7:
          this.setState({creatureKey7: Math.random()})
          break;
        }
        break;
      case "openMouth":
      this.setState({animation: "readyToEat"})
        switch(this.state.currentCreature) {
          case 1:
            this.setState({creatureKey1: Math.random()})
            break;
          case 2:
            this.setState({creatureKey2: Math.random()})
            break;
          case 3:
            this.setState({creatureKey3: Math.random()})
            break;
          case 4:
            this.setState({creatureKey4: Math.random()})
            break;
          case 5:
            this.setState({creatureKey5: Math.random()})
            break;
          case 6:
            this.setState({creatureKey6: Math.random()})
            break;
          case 7:
            this.setState({creatureKey7: Math.random()})
            break;
        }
        break;
      case "eat":
        if (this.state.phase1Pressed === "left") {
          if (this.state.phase1Correct[0] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(1)
        } else if (this.state.phase1Pressed === "middle") {
          if (this.state.phase1Correct[1] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(2)
        } else if (this.state.phase1Pressed === "right") {
          if (this.state.phase1Correct[2] === "correct") {
            this.setState({animation: "celebrate"})
          } else {
            this.setState({animation: "disgust"})
          }
          this.removeFood(3)
        }

      switch(this.state.currentCreature) {
        case 1:
          this.setState({creatureKey1: Math.random()})
          break;
        case 2:
          this.setState({creatureKey2: Math.random()})
          break;
        case 3:
          this.setState({creatureKey3: Math.random()})
          break;
        case 4:
          this.setState({creatureKey4: Math.random()})
          break;
        case 5:
          this.setState({creatureKey5: Math.random()})
          break;
        case 6:
          this.setState({creatureKey6: Math.random()})
          break;
        case 7:
          this.setState({creatureKey7: Math.random()})
          break;
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
                <TouchableOpacity onPress={this.buttonPress}>
                <Text> numtrials: {this.state.numTrials} </Text>
                </TouchableOpacity>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: Window.width/4, height: Window.width/4}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween1}
                    key={this.state.creatureKey1}
                    character={mammalCharacter}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
                    size={{width: Window.width/4, height: Window.width/4}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween2}
                    key={this.state.creatureKey2}
                    character={goatCharacter}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: Window.height/2, height: Window.height/2}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween3}
                    key={this.state.creatureKey3}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    fps={10}
                    character={frogCharacter}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween4}
                    key={this.state.creatureKey4}
                    character={OmnivoreGreen}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween5}
                    key={this.state.creatureKey5}
                    character={OmnivoreBlue}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween6}
                    key={this.state.creatureKey6}
                    character={OmnivoreRed}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
                <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
                    size={{width: (Window.width/5)*1.344, height: Window.width/5}}
                    draggable={false}
                    tweenStart={"auto"}
                    tween={this.state.creatureTween7}
                    key={this.state.creatureKey7}
                    character={OmnivoreYellow}
                    spriteAnimationKey={this.state.animation}
                    loopAnimation={false}
                    onTweenFinish={this.onTweenEndCreature}
                    onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
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
                    loopAnimation={true}
                    onTweenFinish={this.onTweenEndFood}/>
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
                    character={this.state.phase1Middle}
                    key={this.state.foodKey2}
                    tweenStart="auto"
                    tween={this.state.foodTween12}
                    onPress={this.onFoodPress}
                    spriteKey={2}
                    spriteAnimationKey={this.state.spriteAnimationKey2}
                    loopAnimation={true}
                    onTweenFinish={this.onTweenEndFood}/>
                : null}
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
                    key={this.state.signKey3}
                    size={{width: Window.width/7, height: (Window.width/7)*1.596}}
                    draggable={false}
                    character={signCharacter}
                    tweenStart="auto"
                    tween={this.state.signTween2}/>
                {this.state.showFood3 ?
                <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
                    size={{width: Window.width/11, height: Window.width/11}}
                    draggable={false}
                    character={this.state.phase1Right}
                    key={this.state.foodKey3}
                    tweenStart="auto"
                    tween={this.state.foodTween13}
                    onPress={this.onFoodPress}
                    spriteKey={3}
                    spriteAnimationKey={this.state.spriteAnimationKey3}
                    loopAnimation={true}
                    onTweenFinish={this.onTweenEndFood}/>
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

export default GameTwo3
