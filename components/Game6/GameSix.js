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
    };
    this.trialNum = 1;
    this.numbers = [];
  }

  componentDidMount() {
    if(this.trialNum === 1){
      this.gameTimeout = setTimeout(() => {
        this.props.navigator.replace({
          id: 'Main',
        });
      }, 120000);
    }
    if(this.props.route.trialNum != undefined){
      this.trialNum = this.props.route.trialNum;
    }
    if(this.trialNum <= 3){
      this.setNumber();
    }
    else{
      for(let i = 0; i < 3; i++){
        this.setNumber();
      }
    }
    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0],
    });
  }

  componentWillUnmount() {
    if(this.trialNum > 3){
      clearTimeout(this.gameTimeout);
    }
  }

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
    // console.warn(left);
    // console.warn(top);
    let withinRange = false;
    if(top > 380 && top < 520){
      if(signKey === 1 && left > 640 && left < 870){
        withinRange = true;
      }
      else if(signKey === 2 && left > 480 && left < 670){
        withinRange = true;
      }
      else if(signKey === 3 && left > 300 && left < 470){
        withinRange = true;
      }
      else if(signKey === 4 && left > 160 && left < 370){
        withinRange = true;
      }
      if(withinRange && signKey === this.state.targetNumber){
        this.attempt();
        //console.warn('SUCCESS');
      }
      else{
        this.attempt();
        //console.warn("FAILLLLLLL");
      }
    };
  }

  attempt(){
    this.numbers.shift();
    this.setNumber();
    this.setState({
      numbers: this.numbers,
      targetNumber: this.numbers[0],
      foodKey: Math.random(),
    });
    this.goToNextTrial();
  }

  goToNextTrial(){
    if(this.trialNum > 3){
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
          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix1'
              loopAnimation={true}/>
            <AnimatedSprite 
              key={this.state.foodKey}
              coordinates={{top: 95, left: 40}}
              size={{width: 70, height: 70}}
              draggable={true}
              draggedTo={(left, top) => this.checkTarget(left, top, 1)}
              character={appleCharacter}
              />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix2'
              loopAnimation={true}/>
            <AnimatedSprite 
              key={this.state.foodKey}
              coordinates={{top: 90, left: 30}}
              size={{width: 90, height: 90}}
              draggable={true}
              draggedTo={(left, top) => this.checkTarget(left, top, 2)}
              character={canCharacter}
              />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix3'
              loopAnimation={true}/>
            <AnimatedSprite 
              key={this.state.foodKey}
              coordinates={{top: 85, left: 20}}
              size={{width: 100, height: 100}}
              draggable={true}
              draggedTo={(left, top) => this.checkTarget(left, top, 3)}
              character={bugCharacter}
              spriteAnimationKey='stillIdle'
              loopAnimation={true}
              />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              coordinates={{top: -10, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              character={signCharacter}
              spriteAnimationKey='gameSix4'
              loopAnimation={true}/>
            <AnimatedSprite 
              key={this.state.foodKey}
              coordinates={{top: 90, left: 30}}
              size={{width: 80, height: 80}}
              draggable={true}
              draggedTo={(left, top) => this.checkTarget(left, top, 4)}
              character={grassCharacter}
              />
          </View>

          <AnimatedSprite coordinates={{top: 410, left: 810}}
            size={{width: 210, height: 160}}
            character={omnivoreCharacter}/>

          <View style={styles.thoughtBubbles}>
            <View style={this.getBubbleStyle()}><Text style={styles.thoughtText}>{this.state.numbers}</Text></View>
            <View style={styles.bubble2} />
            <View style={styles.bubble3} />
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
  thoughtBubbles: {
    height: 200,
    width: 500,
    //borderWidth: 2,
    top: 210,
    left: 750,
    position: 'absolute',
  },
  bubble2: {
    borderWidth: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    left: 65,
    top: -20,
  },
  bubble3: {
    borderWidth: .5,
    borderRadius: 100,
    height: 30,
    width: 30,
    left: 100,
    top: -10,
  },
  thoughtText: {
    fontSize: 70,
    top: 10,
  },
});

export default GameSix;
