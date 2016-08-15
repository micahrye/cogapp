import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import frogCharacter from "../../sprites/frog/frogCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import thoughtBubbleCharacter from "../../sprites/thoughtBubble/thoughtBubbleCharacter";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameSix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetNumber: undefined,
      numbers: undefined,
      omnivoreKey: Math.random(),
      thoughtBubbleKey: Math.random(),
      showText: false,
      apples: [],
      cans: [],
      bugs: [],
      grass: [],
    };
    this.trialNum = 1;
    this.numbers = [];
    this.omnivoreSpriteAnimationKey = 'default';
    this.thoughtBubbleSpriteAnimationKey = 'default';
    this.gameTimeout = undefined;
    this.timeoutNumberAppear = undefined;
    this.foodTween = null;
    this.apples = [];
    this.cans = [];
    this.bugs = [];
    this.grass = [];
    this.fail = undefined;
  }

  componentDidMount() {
    this.gameTimeout = setTimeout(() => { // after game timeout return to homescreen
      this.props.navigator.replace({
        id: 'Main',
      });
    }, 120000);

    for(let i = 0; i < 4; i++){ // set up 4 foods on tags
      this.setUpFood(i+1);
    }
      
    this.setNumber();
    this.thoughtBubbleSpriteAnimationKey = 'appear';  
    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0], // first number in sequence is target number
      thoughtBubbleKey: Math.random(),
    });
  }

  componentWillUnmount() {
    clearTimeout(this.gameTimeout);
    clearTimeout(this.timeoutNumberAppear);
  }

  // make individualized tweens for each food
  getFoodTween(startX, startY, endX){
    return({
      tweenType: "curve-spin",
      startXY: [startX, startY], // start on their tags
      endXY: [endX, 400], // end at character
      duration: 1000,
      loop: false,
    });
  }

  // place new food on specified tag
  setUpFood(spriteKey) {
    if(spriteKey === 1){
      this.apples.push(
        <AnimatedSprite 
          key={Math.random()}
          spriteKey={1}
          coordinates={{top: 95, left: 40}}
          size={{width: 70, height: 70}}
          character={appleCharacter}
          onPress={(spriteKey) => this.foodPress(1)}
          tween={this.getFoodTween(95, 40, 650)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(1)}/>
      );
    }
    else if(spriteKey === 2){
      this.cans.push(
        <AnimatedSprite 
          key={Math.random()}
          spriteKey={2}
          coordinates={{top: 90, left: 30}}
          size={{width: 90, height: 90}}
          character={canCharacter}
          onPress={(spriteKey) => this.foodPress(2)}
          tween={this.getFoodTween(90, 30, 500)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(2)}/>
      );
    }
    else if(spriteKey === 3){
      this.bugs.push(
        <AnimatedSprite 
          key={Math.random()}
          spriteKey={3}
          coordinates={{top: 85, left: 20}}
          size={{width: 100, height: 100}}
          character={bugCharacter}
          onPress={(spriteKey) => this.foodPress(3)}
          tween={this.getFoodTween(85, 20, 350)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(3)}
          spriteAnimationKey='stillIdle'
          loopAnimation={true}/>
      );
    }
    else{
      this.grass.push(
        <AnimatedSprite 
          key={Math.random()}
          spriteKey={4}
          coordinates={{top: 90, left: 30}}
          size={{width: 80, height: 80}}
          character={grassCharacter}
          onPress={(spriteKey) => this.foodPress(4)}
          tween={this.getFoodTween(90, 30, 180)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(4)}/>
      );
    }
    this.setState({
      apples: this.apples,
      cans: this.cans,
      bugs: this.bugs,
      grass: this.grass,
    });
  }

  // next number randomly chosen between 1 2 3 and 4
  setNumber() {
    let choice = Math.random();
    if(choice <= .25){
      this.numbers.push(1);
    }
    else if(choice > .25 && choice <= .5){
      this.numbers.push(2);
    }
    else if(choice > .5 && choice <= .75){
      this.numbers.push(3);
    }
    else{
      this.numbers.push(4);
    }
  }

  // triggered when food item is pressed
  foodPress(spriteKey) {
    this.setUpFood(spriteKey); // add another food item to tag while first one is tweening down
    
    if(spriteKey === this.state.targetNumber){ // correct press
      this.omnivoreSpriteAnimationKey = 'readyToEat'; // animal opens it's mouth for food
      this.setState({
        omnivoreKey: Math.random(),
      });
      this.fail = false;
    }
    else{ // incorrect press
      this.fail = true;
    }
    this.shiftNumbers();
    this.trialNum++;
  }


  onAnimationFinish(animationKey){
    if(animationKey === 'appear'){
      this.timeoutNumberAppear = setTimeout(()=>{ // so number appears after thought bubble is set
        this.setState({showText: true});
      }, 200)  
    }
  }

  // after food tweens down to animal
  onTweenFinish(spriteKey) {
    this.removeFood(spriteKey);
    if(this.fail){
      this.omnivoreSpriteAnimationKey = 'disgust';
      this.setState({
        omnivoreKey: Math.random(),
      });
    }
  }

  // remove specified food from its array
  removeFood(spriteKey){
    if(spriteKey === 1){
      this.apples.shift();
      this.setState({apples: this.apples})
    }
    else if(spriteKey === 2){
      this.cans.shift();
      this.setState({cans: this.cans})
    }
    else if(spriteKey === 3){
      this.bugs.shift();
      this.setState({bugs: this.bugs})
    }
    else {
      this.grass.shift();
      this.setState({grass: this.grass})
    }
  }

  // remove target number, add new number to sequence, and set new target number
  shiftNumbers(){
    this.numbers.shift();
    if(this.trialNum === 3){
      for(let i = 0; i < 3; i++){ // on 4th trial, set up sequence of 3 numbers
        this.setNumber();
      }
    }
    else{
      this.setNumber();
    }
    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0],
    });
  }

  getTextHolderStyle() {
    let left = undefined;
    if(this.trialNum < 4){
      left = 940;
    }
    else{
      left = 908;
    }
    return(
      {
        top: 240,
        left: left,
        position: 'absolute'
      }
    )
  }

  getThoughtTextStyle() {

  }

  render(){
    return(
      <Image source={require('../../backgrounds/Game_6_Background_1280.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <AnimatedSprite 
            key={this.state.omnivoreKey}
            coordinates={{top: 320, left: 650}}
            size={{width: 275, height: 275}}
            character={omnivoreCharacter}
            spriteAnimationKey={this.omnivoreSpriteAnimationKey}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}
            loopAnimation={this.state.loopAnimation}/>
          
          <AnimatedSprite 
            key={this.state.thoughtBubbleKey}
            coordinates={{top: 196, left: 700}}
            size={{width: 330, height: 200}}
            character={thoughtBubbleCharacter}
            spriteAnimationKey={this.thoughtBubbleSpriteAnimationKey}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>
        
          {this.state.showText ?  
            <View style={this.getTextHolderStyle()}>
              <Text style={styles.thoughtText}>{this.state.numbers}</Text>
            </View>
          : null}

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix1'
              loopAnimation={true}/>
            {this.state.apples}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix2'
              loopAnimation={true}/>
            {this.state.cans}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix3'
              loopAnimation={true}/>
            {this.state.bugs}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix4'
              loopAnimation={true}/>
            {this.state.grass}
          </View>
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
    width: 1024,
    flexDirection: 'row',
  },
  backgroundImage: {
    width: 1024,
    height: 600,
  },
  itemContainer:{
    top: 0,
    left: 50,
    alignItems: 'center',
    marginRight: 20,
    height: 250,
    width: 140,
  },
  thoughtText: {
    fontSize: 66,
  },
});

export default GameSix;
