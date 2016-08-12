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
      boxSpriteAnimationKey: 'default',
    }
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
      if(i === correctChoice){
        this.boxSpriteAnimationKey = 'green';
      }
      else{
        this.boxSpriteAnimationKey = 'red';
      }
      boxes.push(
        <AnimatedSprite
          key={i}
          spriteKey={i}
          coordinates={{top: 300, left: (i*90) + 10}}
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
            this.celebrate();
          }
          else{
            this.disgust();
          }
        }
      });
      this.setState({moveableBoxes: boxes});
    }
  }

  celebrate() {
    this.setState({mammalKey: Math.random(), mammalSpriteAnimationKey: 'celebrate'});
  }

  disgust() {
    this.setState({mammalKey: Math.random(), mammalSpriteAnimationKey: 'disgust'});
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
            coordinates={{top: 100, left: SCREEN_WIDTH-200}}
            size={{width: 256, height: 256}}
            draggable={false}
            character={mammalCharacter}
            spriteAnimationKey={this.state.mammalSpriteAnimationKey}
            />
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: 280,
    borderWidth: 3,
    left: SCREEN_WIDTH/2 - 140,
  },
  text: {
    fontSize: 45,
  },
});

export default GameFour;
