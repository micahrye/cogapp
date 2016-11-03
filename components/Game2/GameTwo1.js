// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   Image,
//   Easing,
//   Navigator,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Text,
//   View,
//   Animated,
//   Dimensions,
// } from 'react-native';
//
// // imports
// import AnimatedSprite from "../animatedSprite";
// import Tweener from "../Tweener";
// import mammalCharacter from "../../sprites/mammal/mammalCharacter";
// import goatCharacter from "../../sprites/goat/goatCharacter";
// import frogCharacter from "../../sprites/frog/frogCharacter";
// import canCharacter from "../../sprites/can/canCharacter";
// import appleCharacter from "../../sprites/apple/appleCharacter";
// import grassCharacter from "../../sprites/grass/grassCharacter";
// import bugfoodCharacter from "../../sprites/bugfood/bugfoodCharacter";
// import leverCharacter from "../../sprites/lever/leverCharacter";
// import signCharacter from "../../sprites/sign/signCharacter";
//
// // window dimensions
// const Window = Dimensions.get('window');
// // destination for falling food items (should be close to where creature sits)
// const endCoordinates = [Window.width*0.65,Window.height*0.5];
// const endCoordinates2 = [Window.width*0.6,Window.height*0.4]; // slightly different end coordinates for when the frog is onscreen
// // these constants specify the initial/final locations and spacing
// // and signs of the food items
// const startLeft = Window.width*0.25;
// const startLeft2 = Window.width*0.35;
// const startTop = -250;
// const spacing = 200;
// const foodEndTop = Window.height*0.2;
// const signEndTop = -15;
// // start/end for goat and mammal (frog has different dimensions and uses slightly
// // different start amd end coordinates)
// const creatureStart = [Window.width+500,Window.height*0.5];
// const creatureEnd = [Window.width*0.65,Window.height*0.5];
//
// class GameTwo1 extends Component {
//
//   constructor(props) {
//     super(props);
//     // tweening constant for falling food/signs
//     tweenDown = function(startTop,endTop) {
//       return (
//         {
//           tweenType: "bounce-drop",
//           startY: startTop,
//           endY: endTop,
//           duration: 800,
//           repeatable: false,
//           loop: false,
//         }
//       );
//     }
//     // tweening constant for returning food/signs to just beyond the top of
//     // the screen
//     tweenTimeout = function(startTop,endTop) {
//       return (
//         {
//           tweenType: "basic-back",
//           startY: startTop,
//           endY: endTop,
//           duration: 750,
//           repeatable: false,
//           loop: false,
//         }
//       );
//     }
//     // tweening constant for food/signs - warns of impending timeout
//     tweenHop = function(startTop) {
//       return (
//         {
//           tweenType: "hop",
//           startY: startTop,
//           endY: startTop,
//           yTo: startTop - 70,
//           duration: 1000,
//           loop: false,
//         }
//       );
//     }
//     // tweening constant used by food that has been pressed
//     tweenFall = function (leftValue){
//       return(
//         {
//           tweenType: "curve-spin-disappear",
//           startXY: [leftValue,foodEndTop],
//           endXY: endCoordinates,
//           duration: 750,
//           repeatable: false,
//           loop: false,
//         }
//       );
//     }
//     // tweening constant for moving creature characters on/off screen
//     tweenMove = function(start,end) {
//       return(
//         {
//           tweenType: "move",
//           startXY: start,
//           endXY: end,
//           duration: 1500,
//           repeatable: false,
//           loop: false,
//         }
//       );
//     }
//     // a simple hop animation given to offscreen components on mounting
//     // to avoid error (can't just give them null)
//     tweenInitial = {
//        tweenType: "hop",
//        startY: startTop,
//        endY: startTop,
//        yTo: startTop - 70,
//        duration: 1000,
//        loop: false,
//     };
//     // keeps creature onscreen during trials when character animations are playing
//     tweenStatic = function(pos) {
//       return(
//         {
//          tweenType: "move",
//          startXY: pos,
//          endXY: pos,
//          duration: 0,
//          repeatable: false,
//          loop: false,
//         }
//       );
//     }
//     // initial state declarations
//     // **NOTE** -> phase0 refers to the initial part of this trial where two items appear,
//     // phase1 is the second part, where there are three food items to choose from.  The state
//     // variable gamePhase dictates whether the game is in phase0 or phase1 - true: phase0, false: phase1
//     this.state = {
//       foodKey1: Math.random(), //keys for food,signs,creatures
//       foodKey2: Math.random(),
//       foodKey3: Math.random(),
//       foodKey4: Math.random(),
//       foodKey5: Math.random(),
//       signKey1: Math.random(),
//       signKey2: Math.random(),
//       signKey3: Math.random(),
//       signKey4: Math.random(),
//       signKey5: Math.random(),
//       creatureKey1: Math.random(),
//       creatureKey2: Math.random(),
//       creatureKey3: Math.random(),
//       phase0Left: grassCharacter, // variables that hold food sprites for phase0
//       phase0Right: grassCharacter,
//       phase0Pressed: "left", // holds information on which food item has been pressed in a phase0 trial
//       phase1Left: grassCharacter, // variables that hold food sprites in phase1
//       phase1Middle: grassCharacter,
//       phase1Right: grassCharacter,
//       phase1Correct: ["incorrect","incorrect","incorrect"], // tells which sprites are correct in phase1
//       phase1Pressed: "left", //holds information on which food item has been pressed in a phase1 trial
//       phase1AnsweredCorrectly: false, // prevents the game from moving on after 1 correct answer in a phase1 trial (2 are needed to progress)
//       foodFalling: false, // prevents other food items from being pressed while 1 is falling/the creature is reacting to it
//       foodTween01: tweenInitial, // holds tweens for food/signs (initialized with dummy animation)
//       foodTween02: tweenInitial,
//       foodTween11: tweenInitial,
//       foodTween12: tweenInitial,
//       foodTween13: tweenInitial,
//       signTween01: tweenInitial,
//       signTween2: tweenInitial,
//       creatureTween1: tweenMove(creatureStart,creatureEnd), // holds tweens for creatures
//       creatureTween2: tweenMove(creatureStart,creatureStart),
//       creatureTween3: tweenMove(creatureStart,creatureStart),
//       currentCreature: 1, // indicates which kind of creature is currently on screen (starts with mammal) mammal=1,goat=2,frog=3
//       timeoutHuh: false,  // these two prevent lever from activating new trial prematurely
//       gamePhase: true, // true = phase0, false= phase1 - let's the game know which phase it's in
//       numTrials: 0, // keeps track of number of trials done so far (moves to next phase at 9)
//       showFood1: true, // allows food sprites in phase 1 to be turned on/off
//       showFood2: true,
//       showFood3: true,
//       showFood4: true,
//       showFood5: true,
//       spriteAnimationKey1: "blue", // controls colors for food items in phase 1 trials
//       spriteAnimationKey2: "blue",
//       spriteAnimationKey3: "blue",
//       animation: "default",  // dictates what animation the creature character should be displaying
//     }
//     this.timeout1 = undefined; // hold the two different timeouts
//     this.timeout2 = undefined;
//     readyToEat = false;
//   }
//
//   componentDidMount() {
//     // mammal character goes out first
//     this.setState({animation: "walk", creatureKey1: Math.random()});
//     console.warn('here');
//   }
//
//   // clear timeouts on unmounting
//   componentWillUnmount() {
//     clearTimeout(this.timeout1);
//     clearTimeout(this.timeout2);
//   }
//
//   // moves the app to game 2, level 2
//   buttonPress = () => {
//       this.props.navigator.replace({
//           id: 'GameTwo2',
//       });
//   }
//
//   // handles the fifteen second timeout - if 15 seconds go by after
//   // the lever is pulled the food/signs return to above the top of the screen
//   // and toggleCreature() is called, displaying a new creature that needs
//   // to be fed (this marks the start of a new trial so onTimeoutOne
//   // increments numTrials as well)
//   onTimeoutOne = () => {
//       if (this.state.gamePhase) {
//           this.setState({foodTween01: tweenTimeout(foodEndTop,startTop),
//                          foodTween02: tweenTimeout(foodEndTop,startTop),
//                          signTween01: tweenTimeout(signEndTop,startTop),
//                          foodKey4: Math.random(),
//                          foodKey5: Math.random(),
//                          signKey4: Math.random(),
//                          signKey5: Math.random(),
//                          timeoutHuh: false});
//           this.toggleCreature();
//         } else {
//           this.setState({foodTween11: tweenTimeout(foodEndTop,startTop),
//                          foodTween12: tweenTimeout(foodEndTop,startTop),
//                          foodTween13: tweenTimeout(foodEndTop,startTop),
//                          signTween2: tweenTimeout(signEndTop,startTop),
//                          foodKey1: Math.random(),
//                          foodKey2: Math.random(),
//                          foodKey3: Math.random(),
//                          signKey1: Math.random(),
//                          signKey2: Math.random(),
//                          signKey3: Math.random(),
//                          numTrials: this.state.numTrials+1,
//                          timeoutHuh: false,
//                          foodPressed: false,});
//           this.toggleCreature();
//           // move on to next level if 9 trials have been completed (a timeout counts as a trial)
//           if (this.state.numTrials >= 9) {
//             setTimeout(this.buttonPress,100);
//           }
//         }
//         this.setState({timeoutHuh: false});
//   }
//
//   // handles the 10 second timeout - if ten seconds go by after the lever
//   // is pulled, the food/signs hop to indicate that time is running out
//   onTimeoutTwo = () => {
//       if (this.state.gamePhase) {
//         this.setState({foodTween01: tweenHop(foodEndTop),
//                        foodTween02: tweenHop(foodEndTop),
//                        signTween01: tweenHop(signEndTop),
//                        foodKey4: Math.random(),
//                        foodKey5: Math.random(),
//                        signKey4: Math.random(),
//                        signKey5: Math.random()});
//       } else {
//         this.setState({foodTween11: tweenHop(foodEndTop),
//                        foodTween12: tweenHop(foodEndTop),
//                        foodTween13: tweenHop(foodEndTop),
//                        signTween2: tweenHop(signEndTop),
//                        foodKey1: Math.random(),
//                        foodKey2: Math.random(),
//                        foodKey3: Math.random(),
//                        signKey1: Math.random(),
//                        signKey2: Math.random(),
//                        signKey3: Math.random()});
//       }
//   }
//
//   // takes three items as input, selects 1 randomly - used by excludeFoodType
//   randomFood(food1,food2,food3) {
//     diceRoll = Math.random();
//     if (diceRoll < 0.33) {
//       return food1;
//     } else if (diceRoll > 0.66) {
//       return food2;
//     } else {
//       return food3;
//     }
//   }
//
//   // used in selecting food sprites for each trial: given a certain kind of food,
//   // excludeFoodType will select one of the remaining three types at random.
//   excludeFoodType(type) {
//     switch(type) {
//       case "bug":
//         return this.randomFood(grassCharacter,canCharacter,appleCharacter);
//         break;
//       case "apple":
//         return this.randomFood(grassCharacter,canCharacter,bugfoodCharacter);
//         break;
//       case "can":
//         return this.randomFood(grassCharacter,bugfoodCharacter,appleCharacter);
//         break;
//       case "grass":
//         return this.randomFood(bugfoodCharacter,canCharacter,appleCharacter);
//         break;
//     }
//   }
//
//   // randomly determines whether the correct food sprite appears on the left
//   // or right in phase0.  Uses excludeFoodType to randomly select an incorrect
//   // food sprite to go with the correct one.
//   selectFoodPhase0Helper(food,foodString) {
//     diceRoll = Math.random();
//     if (diceRoll <= 0.5) {
//       this.setState({phase0Left: food,
//                      phase0Right: this.excludeFoodType(foodString),
//                      phase0Correct: "left"});
//     } else {
//       this.setState({phase0Left: this.excludeFoodType(foodString),
//                      phase0Right: food,
//                      phase0Correct: "right"});
//     }
//   }
//
//   // assigns correct food sprite for a phase0 trial using the value
//   // of currentCreature, ensuring that the food and creature match
//   selectFoodPhase0() {
//     switch(this.state.currentCreature) {
//       case 1:
//         this.selectFoodPhase0Helper(grassCharacter,"grass");
//         break;
//       case 2:
//         this.selectFoodPhase0Helper(canCharacter,"can");
//         break;
//       case 3:
//         this.selectFoodPhase0Helper(bugfoodCharacter,"bug");
//         break;
//     }
//   }
//
//   // given a certain color, randomly choose one of the three remaining colors
//   excludeColor(color) {
//     switch(color) {
//       case "green":
//         return this.randomFood("blue","red","yellow");
//         break;
//       case "blue":
//         return this.randomFood("green","red","yellow");
//         break;
//       case "red":
//         return this.randomFood("green","blue","yellow");
//         break;
//       case "yellow":
//         return this.randomFood("green","blue","red");
//         break;
//     }
//   }
//
//   // select one of the four available colors at random
//   randomColor() {
//     diceRoll = Math.random();
//     if (diceRoll < 0.25) {
//       return "green";
//     } else if (diceRoll > 0.5 && diceRoll > 0.25) {
//       return "blue";
//     } else if (diceRoll < 0.75 && diceRoll > 0.5) {
//       return "red";
//     } else {
//       return "yellow";
//     }
//   }
//
//   // works the same way as the phase0 helper function but handles three
//   // food sprites, instead of just two.  Also randomly chooses the colors
//   // of the food items in a way meant to be misleading - the correct food item
//   // will always be the same color as one of the incorrect food items
//   selectFoodPhase1Helper(food,foodString) {
//     diceRoll = Math.random();
//     diceRoll2 = Math.random();
//     c1 = this.randomColor();
//     c2 = this.excludeColor(c1);
//     if (diceRoll < 0.33) {
//       this.setState({phase1Left: food,
//                      phase1Middle: this.excludeFoodType(foodString),
//                      phase1Right: this.excludeFoodType(foodString),
//                      phase1Correct: ["correct","incorrect","incorrect"]});
//       if (diceRoll2 < 0.5) {
//         this.setState({spriteAnimationKey1: c2,
//                        spriteAnimationKey2: c1,
//                        spriteAnimationKey3: c2});
//       } else {
//         this.setState({spriteAnimationKey1: c2,
//                        spriteAnimationKey2: c2,
//                        spriteAnimationKey3: c1,});
//       }
//     } else if (diceRoll > 0.66){
//       this.setState({phase1Left: this.excludeFoodType(foodString),
//                      phase1Middle: food,
//                      phase1Right: this.excludeFoodType(foodString),
//                      phase1Correct: ["incorrect","correct","incorrect"]});
//        if (diceRoll2 < 0.5) {
//          this.setState({spriteAnimationKey1: c1,
//                        spriteAnimationKey2: c2,
//                        spriteAnimationKey3: c2});
//         } else {
//          this.setState({spriteAnimationKey1: c2,
//                         spriteAnimationKey2: c2,
//                         spriteAnimationKey3: c1,});
//          }
//     } else {
//       this.setState({phase1Left: this.excludeFoodType(foodString),
//                      phase1Middle: this.excludeFoodType(foodString),
//                      phase1Right: food,
//                      phase1Correct: ["incorrect","incorrect","correct"]});
//       if (diceRoll2 < 0.5) {
//         this.setState({spriteAnimationKey1: c2,
//                        spriteAnimationKey2: c1,
//                        spriteAnimationKey3: c2});
//         } else {
//           this.setState({spriteAnimationKey1: c1,
//                          spriteAnimationKey2: c2,
//                          spriteAnimationKey3: c2,});
//         }
//     }
//   }
//
//   // assigns food sprites for a phase1 trial
//   selectFoodPhase1() {
//     switch(this.state.currentCreature) {
//       case 1:
//         this.selectFoodPhase1Helper(grassCharacter,"grass");
//         break;
//       case 2:
//         this.selectFoodPhase1Helper(canCharacter,"can");
//         break;
//       case 3:
//         this.selectFoodPhase1Helper(bugfoodCharacter,"bug");
//         break;
//     }
//   }
//
//   // onLeverTouch sets timeouts, selects new food sprites, and drops
//   // the food sprites/signs down from the top of the screen so they're visible
//   onLeverTouch = () => {
//     if (!this.state.timeoutHuh && !this.state.foodFalling) {
//         this.timeout1 = setTimeout(this.onTimeoutOne,15000);
//         this.timeout2 = setTimeout(this.onTimeoutTwo,10000);
//         if (this.state.gamePhase) {
//           this.selectFoodPhase0();
//           this.setState({foodTween01: tweenDown(startTop,foodEndTop),
//                          foodTween02: tweenDown(startTop, foodEndTop),
//                          signTween01: tweenDown(startTop,signEndTop),
//                          foodKey4: Math.random(),
//                          foodKey5: Math.random(),
//                          signKey4: Math.random(),
//                          signKey5: Math.random()});
//         } else {
//           this.selectFoodPhase1();
//           this.setState({foodTween11: tweenDown(startTop,foodEndTop),
//                          foodTween12: tweenDown(startTop,foodEndTop),
//                          foodTween13: tweenDown(startTop,foodEndTop),
//                          signTween2: tweenDown(startTop,signEndTop),
//                          foodKey1: Math.random(),
//                          foodKey2: Math.random(),
//                          foodKey3: Math.random(),
//                          signKey1: Math.random(),
//                          signKey2: Math.random(),
//                          signKey3: Math.random(),
//                          phase1AnsweredCorrectly: false}); // reset
//         }
//         this.setState({timeoutHuh: true, // reset
//                        showFood1: true, // resets all food so it's visible, just in case it's been changed in a previous trial
//                        showFood2: true,
//                        showFood3: true,
//                        showFood4: true,
//                        showFood5: true});
//     }
//   }
//
//   // moves the current creature off the screen and sends a new, different one on
//   toggleCreature = () => {
//     // this part moves the current creature off to the right
//     if (this.state.currentCreature === 1) {
//       this.setState({
//         creatureKey1: Math.random(),
//         creatureTween1: tweenMove(creatureEnd,creatureStart)});
//     } else if (this.state.currentCreature === 2) {
//       this.setState({
//         creatureKey2: Math.random(),
//         creatureTween2: tweenMove(creatureEnd,creatureStart)});
//     } else {
//       this.setState({
//         creatureKey3: Math.random(),
//         creatureTween3: tweenMove([Window.width*0.65,Window.height*0.4],
//                                   [Window.width+500,Window.height*0.4])});
//     }
//     diceRoll = Math.random();
//     // move on to game 2, part 2 if 9 trials have been completed
//     if (this.state.numTrials >= 9) {
//       this.buttonPress();
//     } else {
//       // this part ensures the same creature is not selected twice in a row
//     switch(this.state.currentCreature) {
//       case 1:
//         if (diceRoll < 0.5) {
//           this.setState({
//             creatureKey2: Math.random(),
//             creatureTween2: tweenMove(creatureStart, creatureEnd),
//             currentCreature: 2,
//           });
//         } else {
//           this.setState({
//             creatureKey3: Math.random(),
//             creatureTween3: tweenMove([Window.width+500,Window.height*0.4],
//                                       [Window.width*0.65,Window.height*0.4]),
//             currentCreature: 3,
//           });
//         }
//         break;
//       case 2:
//       if (diceRoll < 0.5) {
//         this.setState({
//           creatureKey1: Math.random(),
//           creatureTween1: tweenMove(creatureStart, creatureEnd),
//           currentCreature: 1,
//         });
//       } else {
//         this.setState({
//           creatureKey3: Math.random(),
//           creatureTween3: tweenMove([Window.width+500,Window.height*0.4],
//                                     [Window.width*0.65,Window.height*0.4]),
//           currentCreature: 3,
//         });
//       }
//         break;
//       case 3:
//       if (diceRoll < 0.5) {
//         this.setState({
//           creatureKey1: Math.random(),
//           creatureTween1: tweenMove(creatureStart, creatureEnd),
//           currentCreature: 1,
//         });
//       } else {
//         this.setState({
//           creatureKey2: Math.random(),
//           creatureTween2: tweenMove(creatureStart, creatureEnd),
//           currentCreature: 2,
//         });
//       }
//         break;
//     }
//     }
//   }
//
//   // helper function that allows showFood variables to be switched off when needed
//   removeFood(num) {
//     switch(num) {
//       case 1:
//         this.setState({showFood1: false});
//         break;
//       case 2:
//         this.setState({showFood2: false});
//         break;
//       case 3:
//         this.setState({showFood3: false});
//         break;
//       case 4:
//         this.setState({showFood4: false});
//         break;
//       case 5:
//         this.setState({showFood5: false});
//         break;
//     }
//   }
//
//   // Handles the events that need to occur when any food item is pressed - opening the
//   // creature's mouth, incrementing numTrials, clearing the timeouts, etc.
//   onFoodPress = (spriteKey) => {
//     readyToEat = true;
//     // open current creature's mouth
//     switch(this.state.currentCreature) {
//       case 1:
//         this.setState({creatureKey1: Math.random(),animation: "openMouth"})
//         break;
//       case 2:
//         this.setState({creatureKey2: Math.random(),animation: "openMouth"})
//         break;
//       case 3:
//         this.setState({creatureKey3: Math.random()})
//         break;
//     }
//     xvalue = 0;
//     switch(spriteKey) {
//       case 1: // (leftmost food sprite in phase 1)
//          if (!this.state.foodFalling) {
//            this.setState({foodFalling: true})
//            x = startLeft;
//            this.setState({foodKey1: Math.random(),
//                           foodTween11: tweenFall(x),
//                           phase1Pressed: "left"});
//           if (this.state.phase1Correct[0] === "correct") {
//             clearTimeout(this.timeout1);
//             clearTimeout(this.timeout2);
//             this.setState({timeoutHuh: false,
//                            numTrials: this.state.numTrials+1,
//                            phase1AnsweredCorrectly: true});
//            }
//          }
//          break;
//       case 2: // (middle food sprite in phase 1)
//          if (!this.state.foodFalling) {
//            this.setState({foodFalling: true})
//          x = startLeft+spacing;
//          this.setState({foodKey2: Math.random(),
//                         foodTween12: tweenFall(x),
//                         phase1Pressed: "middle"});
//          //setTimeout(this.removeFood2,750);
//          if (this.state.phase1Correct[1] === "correct") {
//              clearTimeout(this.timeout1);
//              clearTimeout(this.timeout2);
//              this.setState({timeoutHuh: false,
//                             numTrials: this.state.numTrials+1,
//                             phase1AnsweredCorrectly: true});
//            }
//          }
//          break;
//       case 3:  // (rightmost food sprite in phase 1)
//          if (!this.state.foodFalling) {
//            this.setState({foodFalling: true})
//          x = startLeft+spacing*2;
//          this.setState({foodKey3: Math.random(),
//                         foodTween13: tweenFall(x),
//                         phase1Pressed: "right"});
//          //setTimeout(this.removeFood3,750);
//          if (this.state.phase1Correct[2] === "correct") {
//              clearTimeout(this.timeout1);
//              clearTimeout(this.timeout2);
//              this.setState({timeoutHuh: false,
//                             numTrials: this.state.numTrials+1,
//                             phase1AnsweredCorrectly: true});
//            }
//          }
//          break;
//       case 4:  // (left food sprite in phase 0)
//          if (!this.state.foodFalling) {
//            this.setState({foodFalling: true})
//            x = startLeft2;
//            this.setState({foodKey4: Math.random(),
//                           foodTween01: tweenFall(x),
//                           timeoutHuh: false,
//                           phase0Pressed: "left"});
//           clearTimeout(this.timeout1);
//           clearTimeout(this.timeout2);
//           this.setState({numTrials: this.state.numTrials+1});
//         }
//         break;
//       case 5: // (right food sprite in phase 0)
//          if (!this.state.foodFalling) {
//            this.setState({foodFalling: true})
//            x= startLeft2+spacing;
//            this.setState({foodTween02: tweenFall(x),
//                           foodKey5: Math.random(),
//                           timeoutHuh: false,
//                           phase0Pressed: "right"});
//             clearTimeout(this.timeout1);
//             clearTimeout(this.timeout2);
//             this.setState({numTrials: this.state.numTrials+1});
//           }
//           break;
//     }
//   }
//
//   // called after the creature character finishes any tween.  Ensures that
//   // the creature stays put during trials
//   onTweenEndCreature = () => {
//     switch(this.state.currentCreature) {
//       case 1:
//         this.setState({creatureTween1: tweenStatic(creatureEnd)})
//         break;
//       case 2:
//         this.setState({creatureTween2: tweenStatic(creatureEnd)})
//         break;
//       case 3:
//         this.setState({creatureTween3: tweenStatic([Window.width*0.65,Window.height*0.4])})
//         break;
//     }
//   }
//
//   // onTweenEndFood only does anything when the food has finished its descent toward the creature's
//   // mouth (thanks to the readyToEat boolean).  Starts the chew/eat animation in the
//   // current creature character
//   onTweenEndFood = () => {
//     switch(this.state.currentCreature) {
//       case 1:
//         if (readyToEat) {
//           this.setState({animation: "chew", creatureKey1: Math.random()})
//         }
//         break;
//       case 2:
//         if (readyToEat) {
//           this.setState({animation: "chew", creatureKey2: Math.random()})
//         }
//         break;
//       case 3:
//         if (readyToEat) {
//           this.setState({animation: "eat", creatureKey3: Math.random()})
//         }
//         break;
//     }
//     readyToEat = false;
//   }
//
//   // dictates what needs to happen after each different creature animation
//   onAnimationFinish(animationKey) {
//     switch(animationKey) {
//       case "walk":
//         this.setState({animation: "default"})
//         break;
//       case "celebrate":
//       // if the creature is celebrating it means that the subtrial has been
//       // completed successfully and the game can move on to the next creature
//       this.setState({foodFalling: false})
//         if (this.state.gamePhase) {
//           this.setState({animation: "walk"})
//           this.setState({signKey4: Math.random(),
//                          signKey5: Math.random(),
//                          foodKey4: Math.random(),
//                          foodKey5: Math.random(),
//                          signTween01: tweenTimeout(signEndTop,startTop),
//                          foodTween01: tweenTimeout(foodEndTop,startTop),
//                          foodTween02: tweenTimeout(foodEndTop,startTop),
//                          })
//           if (this.state.numTrials >= 3) {
//             this.setState({gamePhase: false})
//           }
//           setTimeout(this.toggleCreature.bind(this),500);
//         } else {
//           this.setState({animation: "default"})
//           if (this.state.phase1AnsweredCorrectly) {
//           this.setState({signKey1: Math.random(),
//                          signKey2: Math.random(),
//                          signKey3: Math.random(),
//                          foodKey1: Math.random(),
//                          foodKey2: Math.random(),
//                          foodKey3: Math.random(),
//                          signTween2: tweenTimeout(signEndTop,startTop),
//                          foodTween13: tweenTimeout(foodEndTop,startTop),
//                          foodTween12: tweenTimeout(foodEndTop,startTop),
//                          foodTween11: tweenTimeout(foodEndTop,startTop)}),
//             setTimeout(this.toggleCreature.bind(this),500);
//           }
//         }
//         break;
//       case "disgust":
//         //disgust means that an incorrect choice has been made.  In phase 0, this
//         // still moves the game onto a new trial, but in phase 1 the character remains
//         // onscreen
//         this.setState({foodFalling: false})
//           if (this.state.gamePhase) {
//             this.setState({animation: "walk"})
//             this.setState({signKey4: Math.random(),
//                            signKey5: Math.random(),
//                            foodKey4: Math.random(),
//                            foodKey5: Math.random(),
//                            signTween01: tweenTimeout(signEndTop,startTop),
//                            foodTween01: tweenTimeout(foodEndTop,startTop),
//                            foodTween02: tweenTimeout(foodEndTop,startTop)})
//             if (this.state.numTrials >= 3) {
//               this.setState({gamePhase: false})
//             }
//             setTimeout(this.toggleCreature.bind(this),500);
//           } else {
//             this.setState({animation: "default"})
//             if (this.state.phase1AnsweredCorrectly) { // is this ever getting called?
//             this.setState({signKey1: Math.random(),
//                            signKey2: Math.random(),
//                            signKey3: Math.random(),
//                            foodKey1: Math.random(),
//                            foodKey2: Math.random(),
//                            foodKey3: Math.random(),
//                            signTween2: tweenTimeout(signEndTop,startTop),
//                            foodTween13: tweenTimeout(foodEndTop,startTop),
//                            foodTween12: tweenTimeout(foodEndTop,startTop),
//                            foodTween11: tweenTimeout(foodEndTop,startTop)})
//               setTimeout(this.toggleCreature.bind(this),500);
//             }
//           }
//         break;
//       case "chew":
//         // the boolean logic under this determines whether a correct choice has been
//         // made by comparing the location of the pressed food item to the locations
//         // of the correct food items, which are stored in state at the start of each new trials
//         // If a correct choice has been made, celebrate is called next.  Otherwise, disgust
//         // is called
//         if (this.state.gamePhase) {
//         if (this.state.phase0Pressed === "left") {
//           if (this.state.phase0Correct === "left") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//           this.removeFood(4)
//         } else {
//           if (this.state.phase0Correct === "left") {
//             this.setState({animation: "disgust"})
//           } else {
//             this.setState({animation: "celebrate"})
//           }
//           this.removeFood(5)
//         }
//       } else {
//         if (this.state.phase1Pressed === "left") {
//           if (this.state.phase1Correct[0] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         } else if (this.state.phase1Pressed === "middle") {
//           if (this.state.phase1Correct[1] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         } else if (this.state.phase1Pressed === "right") {
//           if (this.state.phase1Correct[2] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         }
//       }
//         switch(this.state.currentCreature) {
//           case 1:
//             this.setState({creatureKey1: Math.random()})
//             break;
//           case 2:
//             this.setState({creatureKey2: Math.random()})
//             break;
//           case 3:
//             this.setState({creatureKey3: Math.random()})
//             break;
//         }
//         break;
//       case "openMouth":
//         // once creature opens its mouth, it should hold it open until the food
//         // has fallen in
//         this.setState({animation: "readyToEat"})
//         switch(this.state.currentCreature) {
//           case 1:
//             this.setState({creatureKey1: Math.random()})
//             break;
//           case 2:
//             this.setState({creatureKey2: Math.random()})
//             break;
//           case 3:
//             this.setState({creatureKey3: Math.random()})
//             break;
//         }
//         break;
//         case "eat":
//         // works the same way as chew
//         if (this.state.gamePhase) {
//         if (this.state.phase0Pressed === "left") {
//           if (this.state.phase0Correct === "left") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//           this.removeFood(4)
//         } else {
//           if (this.state.phase0Correct === "left") {
//             this.setState({animation: "disgust"})
//           } else {
//             this.setState({animation: "celebrate"})
//           }
//           this.removeFood(5)
//         }
//       } else {
//         if (this.state.phase1Pressed === "left") {
//           if (this.state.phase1Correct[0] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         } else if (this.state.phase1Pressed === "middle") {
//           if (this.state.phase1Correct[1] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         } else if (this.state.phase1Pressed === "right") {
//           if (this.state.phase1Correct[2] === "correct") {
//             this.setState({animation: "celebrate"})
//           } else {
//             this.setState({animation: "disgust"})
//           }
//         }
//       }
//       // reassign keys so animation will display
//       switch(this.state.currentCreature) {
//         case 1:
//           this.setState({creatureKey1: Math.random()})
//           break;
//         case 2:
//           this.setState({creatureKey2: Math.random()})
//           break;
//         case 3:
//           this.setState({creatureKey3: Math.random()})
//           break;
//       }
//           break;
//     }
//
//   }
//
//   render() {
//    // simple bounce tween to let player know when they have pressed the lever
//     const tweenOptsLever = {
//       tweenType: "bounce",
//       startY: 80,
//       repeatable: true,
//       loop: false,
//     };
//
//     return (
//       <View style={styles.container}>
//         <Image source={require('../../backgrounds/Game_2_Background_1280.png')} style={styles.backgroundImage}>
//                 <TouchableOpacity onPress={this.buttonPress}>
//                 <Text> numtrials: {this.state.numTrials} </Text>
//                 </TouchableOpacity>
//                 <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
//                     size={{width: Window.width/4, height: Window.width/4}}
//                     draggable={false}
//                     tweenStart={"auto"}
//                     tween={this.state.creatureTween1}
//                     key={this.state.creatureKey1}
//                     character={mammalCharacter}
//                     spriteAnimationKey={this.state.animation}
//                     loopAnimation={false}
//                     onTweenFinish={this.onTweenEndCreature}
//                     onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
//                 <AnimatedSprite coordinates={{top: Window.height - 190, left: Window.width - 120}}
//                     size={{width: Window.width/4, height: Window.width/4}}
//                     draggable={false}
//                     tweenStart={"auto"}
//                     tween={this.state.creatureTween2}
//                     key={this.state.creatureKey2}
//                     character={goatCharacter}
//                     rotate={[{rotateY:"180deg"}]}
//                     spriteAnimationKey={this.state.animation}
//                     loopAnimation={false}
//                     onTweenFinish={this.onTweenEndCreature}
//                     onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
//                 <AnimatedSprite coordinates={{top: Window.height - 50, left: Window.width - 120}}
//                     size={{width: Window.height/2, height: Window.height/2}}
//                     draggable={false}
//                     tweenStart={"auto"}
//                     tween={this.state.creatureTween3}
//                     key={this.state.creatureKey3}
//                     character={frogCharacter}
//                     spriteAnimationKey={this.state.animation}
//                     loopAnimation={false}
//                     onTweenFinish={this.onTweenEndCreature}
//                     onAnimationFinish={(spriteAnimationKey) => {this.onAnimationFinish(spriteAnimationKey)}}/>
//                 <AnimatedSprite coordinates={{top:100,left:-5}}
//                     size={{width:Window.width/6,height:(Window.width/6)*0.878}}
//                     draggable={false}
//                     character={leverCharacter}
//                     tweenStart="touch"
//                     tween={tweenOptsLever}
//                     onPress={this.onLeverTouch}/>
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft-30}}
//                     key={this.state.signKey1}
//                     size={{width: Window.width/7, height: (Window.width/7)*1.596}}
//                     draggable={false}
//                     character={signCharacter}
//                     tweenStart="auto"
//                     tween={this.state.signTween2}/>
//                 {this.state.showFood1 ?
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
//                     size={{width: Window.width/11, height: Window.width/11}}
//                     draggable={false}
//                     character={this.state.phase1Left}
//                     key={this.state.foodKey1}
//                     tweenStart="auto"
//                     tween={this.state.foodTween11}
//                     onPress={this.onFoodPress}
//                     onTweenFinish={this.onTweenEndFood}
//                     spriteKey={1}
//                     spriteAnimationKey={this.state.spriteAnimationKey1}
//                     loopAnimation={true}/>
//                 : null}
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing-30}}
//                     key={this.state.signKey2}
//                     size={{width: Window.width/7, height: (Window.width/7)*1.596}}
//                     draggable={false}
//                     character={signCharacter}
//                     tweenStart="auto"
//                     tween={this.state.signTween2}/>
//                 {this.state.showFood2 ?
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing}}
//                     size={{width: Window.width/11, height: Window.width/11}}
//                     draggable={false}
//                     character={this.state.phase1Middle}
//                     key={this.state.foodKey2}
//                     tweenStart="auto"
//                     tween={this.state.foodTween12}
//                     onPress={this.onFoodPress}
//                     onTweenFinish={this.onTweenEndFood}
//                     spriteKey={2}
//                     spriteAnimationKey={this.state.spriteAnimationKey2}
//                     loopAnimation={true}/>
//                 : null}
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2-30}}
//                     key={this.state.signKey3}
//                     size={{width: Window.width/7, height: (Window.width/7)*1.596}}
//                     draggable={false}
//                     character={signCharacter}
//                     tweenStart="auto"
//                     tween={this.state.signTween2}/>
//                 {this.state.showFood3 ?
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft+spacing*2}}
//                     size={{width: Window.width/11, height: Window.width/11}}
//                     draggable={false}
//                     character={this.state.phase1Right}
//                     key={this.state.foodKey3}
//                     tweenStart="auto"
//                     tween={this.state.foodTween13}
//                     onPress={this.onFoodPress}
//                     onTweenFinish={this.onTweenEndFood}
//                     spriteKey={3}
//                     spriteAnimationKey={this.state.spriteAnimationKey3}
//                     loopAnimation={true}/>
//                 : null}
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft2-30}}
//                     key={this.state.signKey4}
//                     size={{width: Window.width/7, height: (Window.width/7)*1.596}}
//                     draggable={false}
//                     character={signCharacter}
//                     tweenStart="auto"
//                     tween={this.state.signTween01}/>
//                 {this.state.showFood4 ?
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft2}}
//                     size={{width: Window.width/11, height: Window.width/11}}
//                     draggable={false}
//                     character={this.state.phase0Left}
//                     key={this.state.foodKey4}
//                     tweenStart="auto"
//                     tween={this.state.foodTween01}
//                     onPress={this.onFoodPress}
//                     onTweenFinish={this.onTweenEndFood}
//                     spriteKey={4}/>
//                 : null}
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing-30}}
//                     key={this.state.signKey5}
//                     size={{width: Window.width/7, height: (Window.width/7)*1.596}}
//                     draggable={false}
//                     character={signCharacter}
//                     tweenStart="auto"
//                     tween={this.state.signTween01}/>
//                 {this.state.showFood5 ?
//                 <AnimatedSprite coordinates={{top: startTop, left: startLeft2+spacing}}
//                     size={{width: Window.width/11, height: Window.width/11}}
//                     draggable={false}
//                     character={this.state.phase0Right}
//                     key={this.state.foodKey5}
//                     tweenStart="auto"
//                     tween={this.state.foodTween02}
//                     onPress={this.onFoodPress}
//                     onTweenFinish={this.onTweenEndFood}
//                     spriteKey={5}/>
//                 : null}
//         </Image>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   // styles for background png image/basic black backgroundColor
//   // to go behind it
//   container: {
//       flex: 1,
//       backgroundColor: 'black',
//   },
//   backgroundImage: {
//       flex: 1,
//       width: null,
//       height: null,
//   },
// })
//
// export default GameTwo1
