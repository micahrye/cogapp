import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  Easing,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import squareCharacter from "../../sprites/square/squareCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
let fixedBoxes = [];

class GameFour extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      moveableBoxes: [],
      mammalKey: 0,
      mammalSpriteAnimationKey: 'default',
      showFood: false,
      loopAnimation: false,
    }
    this.boxSpriteAnimationKey = 'default';

  }

  componentDidMount() {
    this.createBoxes();
  }

  createBoxes() {
    // create fixed boxes
    for(let i=0; i < 9; i++){
      if(i < 8){ // put text in first 8 boxes
        fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}><Text style={styles.text}>{i}</Text></View>);
      }
      else if(i === 8){
        fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}></View>);
      }
    }

    // create moveable boxes at bottom of matrix
    let correctChoice = Math.floor(Math.random() * 3); // either 0, 1, or 2
    let boxes = [];
    for(let i=0; i < 3; i++){
      //if(i === correctChoice){
        this.boxSpriteAnimationKey = 'green';
      // }
      // else{
      //   this.boxSpriteAnimationKey = 'red';
      // }
      boxes.push(
        <AnimatedSprite
          key={i}
          spriteKey={i}
          coordinates={{top: 300, left: (i*90) + 15}}
          size={{width: 60, height: 60}}
          draggable={true}
          draggedTo={this.checkLocation.bind(null, i)}
          character={squareCharacter}
          spriteAnimationKey={this.boxSpriteAnimationKey}
          loopAnimation={true}/>
      );
    }
    this.setState({moveableBoxes: boxes});
  }

  // check if a moveable box has been dragged to dashed box and if true remove it
  checkLocation = (numBox, newX, newY) => {
    if((newX > 185 && newX < 205) && (newY > 190 && newY < 210)){
      let boxes = [];
      this.state.moveableBoxes.forEach((item)=>{
        if(numBox !== item.props.spriteKey){
          boxes.push(item)
        }
        else{
          if(item.props.spriteAnimationKey === 'green'){ // if correct box chosen
            this.foodFall();
          }
          else{
            this.disgust();
          }
        }
      });
      this.setState({moveableBoxes: boxes});
    }
  }

  foodFall() {
    this.setState({
      showFood: true,
      mammalKey: Math.random(), 
      mammalSpriteAnimationKey: 'openMouth',
    });
  }

  disgust() {
    this.setState({mammalKey: Math.random(), mammalSpriteAnimationKey: 'disgust'});
  }

  onTweenFinish(){
    // this.setState({
    //   mammalKey: Math.random(), 
    //   mammalSpriteAnimationKey: 'chew',
    //   //showFood: false,
    //   //loopAnimation: false,
    // })
  }

  onAnimationFinish(animation) {
    if(animation === 'eat'){
      this.setState({
        mammalKey: Math.random(), 
        mammalSpriteAnimationKey: 'celebrate',
      });
    }
    else if(animation === 'openMouth'){
      this.setState({
        mammalKey: Math.random(), 
        mammalSpriteAnimationKey: 'readyToEat',
        loopAnimation: true,
      });
    }
  }

  getBoxStyles(boxNum) {
    if(boxNum === 8){ // last fixed box is dashed
      borderStyle = 'dashed';
    }
    else{
      borderStyle = 'solid';
    }
    return {
      borderWidth: 2,
      borderStyle: borderStyle,
      width: 60,
      height: 60,
      margin: 15,
      alignItems: 'center',
    }
  }

  render(){
    return(
      <Image source={require('../../backgrounds/Game_4_Background_1280.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.boxContainer}>
            {fixedBoxes}
            {this.state.moveableBoxes}
          </View>
          <AnimatedSprite
            key={this.state.mammalKey}
            coordinates={{top: 300, left: 800}}
            size={{width: 256, height: 256}}
            draggable={false}
            character={mammalCharacter}
            spriteAnimationKey={this.state.mammalSpriteAnimationKey}
            onAnimationFinish={(animation) => this.onAnimationFinish(animation)}
            loopAnimation={this.state.loopAnimation}/>
        </View>
        {this.state.showFood ?
          <AnimatedSprite 
            key={Math.random()}
            coordinates={{top: 200, left: 770}}
            size={{width: 100, height: 100}}
            tween={{
              tweenType: 'curve-spin',
              startXY: [570, 200],
              endXY: [800, 300], 
              duration: 4000,
              loop: false,
            }}
            tweenStart='auto'
            onTweenFinish={(ended) => this.onTweenFinish()}
            character={grassCharacter}/>
          : null}
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
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: 280,
    height: 400,
    borderWidth: 3,
    left: 372,
    marginTop: 20,
  },
  text: {
    fontSize: 45,
  },
});

export default GameFour;
