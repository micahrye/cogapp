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

const startLeft = 15;
const startTop = 35;
const spacing = 600;
const sprite1Start = [startLeft,startTop];
const sprite2Start = [startLeft+spacing,startTop];
const sprite3Start = [startLeft+spacing*2,startTop];

class GameSix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetNumber: undefined,
      numbers: undefined,
      foodKey: Math.random(),
      omnivoreKey: Math.random(),
      thoughtBubbleKey: Math.random(),
      showText: false,
    };
    this.trialNum = 1;
    this.numbers = [];
    this.omnivoreSpriteAnimationKey = 'default';
    this.thoughtBubbleSpriteAnimationKey = 'default';
    this.showFood = [true, true, true, true]; // the 4 foods on the signs
  }

  componentDidMount() {
    if(this.trialNum === 1){
      this.gameTimeout = setTimeout(() => { // after game timeout return to homescreen
        this.props.navigator.replace({
          id: 'Main',
        });
      }, 120000);
    }
    if(this.props.route.trialNum != undefined){ // is undefined on first load
      this.trialNum = this.props.route.trialNum;
    }

    if(this.trialNum <= 3){ // first 3 trials only have 1 number
      this.setNumber();
    }
    else{
      for(let i = 0; i < 3; i++){ // on third trial, set up sequence of 3 numbers
        this.setNumber();
      }
    }

    if(this.trialNum === 1){ // on first trial, bubble appear animation occurs
      this.thoughtBubbleSpriteAnimationKey = 'appear';
      this.setState({thoughtBubbleKey: Math.random()});
    }
    else{
     // setTimeout(()=>{ // so that numbers appear after thought bubble
        this.setState({showText: true}); // numbers appear immediately on later trials
      //}, 100);
    } 

    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0], // first number in sequence is target number
    });
  }

  componentWillUnmount() {
    if(this.trialNum > 3){
      clearTimeout(this.gameTimeout); // only clear timeout if navigating away at end, not during first 3 trials
    }
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

  checkTarget(left, top, signKey){
    let withinRange = false;
    if(top > 370 && top < 530){
      if(signKey === 1 && left > 560 && left < 780){
        withinRange = true;
      }
      else if(signKey === 2 && left > 400 && left < 600){
        withinRange = true;
      }
      else if(signKey === 3 && left > 220 && left < 420){
        withinRange = true;
      }
      else if(signKey === 4 && left > 80 && left < 280){
        withinRange = true;
      }

      if(withinRange){
        if(signKey === this.state.targetNumber){
          this.eat(signKey);
          this.attempt = 'success';
        }
        else{
          this.attempt = 'fail';
          this.disgust(signKey);
        }
      }
    };
  }

  eat(signKey){
    this.omnivoreSpriteAnimationKey = 'eat';
    this.setState({omnivoreKey: Math.random()});
    this.showFood[signKey - 1] = false;
  }

  disgust(signKey){
    this.omnivoreSpriteAnimationKey = 'disgust';
    this.setState({omnivoreKey: Math.random()});
    this.showFood[signKey - 1] = false;
  }

  // remove target number, add new number to sequence, and set new target number
  shiftNumbers(){
    this.numbers.shift();
    this.setNumber();
    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0],
    });
    this.goToNextTrial();
  }

  onAnimationFinish(animationKey){
    if(animationKey === 'eat'){
      this.omnivoreSpriteAnimationKey = 'celebrate';
      this.setState({omnivoreKey: Math.random()});

    }
    else if(animationKey === 'celebrate' || animationKey === 'disgust'){
      this.shiftNumbers(); // get ready for next trial
    }
    else if(animationKey === 'appear'){
      this.setState({showText: true});
    }
  }

  goToNextTrial(){
    if(this.trialNum > 3){
      this.showFood = [true, true, true, true];
      this.setState({foodKey: Math.random()}); // so food returns to its sign
      return;
    }
    this.props.navigator.replace({
      id: "GameSix",
      trialNum: this.trialNum + 1,
    });
  }
  
  getBubbleStyle(){
    let width = undefined;
    let padding = undefined
    if(this.trialNum <= 3){
      width = 150;
      padding = 50;
    }
    else{
      width = 400;
      padding = 50;
    }
    return (
      {
        borderWidth: 1.5,
        borderRadius: 100,
        height: 120,
        width: width,
        left: 100,
        paddingLeft: padding,
      }
    );
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
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>
          
          <AnimatedSprite 
            key={this.state.thoughtBubbleKey}
            coordinates={{top: 196, left: 700}}
            size={{width: 330, height: 200}}
            character={thoughtBubbleCharacter}
            spriteAnimationKey={this.thoughtBubbleSpriteAnimationKey}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>
        
          {this.state.showText ?  
            <View style={styles.textHolder}>
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
            {this.showFood[0] ?
              <AnimatedSprite 
                key={this.state.foodKey}
                coordinates={{top: 95, left: 40}}
                size={{width: 70, height: 70}}
                draggable={true}
                draggedTo={(left, top) => this.checkTarget(left, top, 1)}
                character={appleCharacter}/>
            : null}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix2'
              loopAnimation={true}/>
            {this.showFood[1] ?
              <AnimatedSprite 
                key={this.state.foodKey}
                coordinates={{top: 90, left: 30}}
                size={{width: 90, height: 90}}
                draggable={true}
                draggedTo={(left, top) => this.checkTarget(left, top, 2)}
                character={canCharacter}/>
            : null}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix3'
              loopAnimation={true}/>
            {this.showFood[2] ?
              <AnimatedSprite 
                key={this.state.foodKey}
                coordinates={{top: 85, left: 20}}
                size={{width: 100, height: 100}}
                draggable={true}
                draggedTo={(left, top) => this.checkTarget(left, top, 3)}
                character={bugCharacter}
                spriteAnimationKey='stillIdle'
                loopAnimation={true}/>
            : null}
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix4'
              loopAnimation={true}/>
            {this.showFood[3] ?
              <AnimatedSprite 
                key={this.state.foodKey}
                coordinates={{top: 90, left: 30}}
                size={{width: 80, height: 80}}
                draggable={true}
                draggedTo={(left, top) => this.checkTarget(left, top, 4)}
                character={grassCharacter}/>
            : null}
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
    left: 80,
    alignItems: 'center',
    marginRight: 20,
    height: 250,
    width: 140,
    //borderWidth: 2,
  },
  circle: {
    borderWidth: 3,
    borderRadius: 100,
    height: 75,
    width: 75,
  },
  thoughtText: {
    fontSize: 66,
  },
  textHolder: {
    top: 240,
    left: 908,
    position: 'absolute'
  }
});

export default GameSix;
