import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  AsyncStorage,
  Navigator,
  Image,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';


import BubblePopWinPage from './BubblePopWinPage';
import AnimatedSprite from '../animatedSprite';
import NextGamePage from './NextGamePage';
import bubbleCharacterLarge from '../../sprites/bubble/bubbleCharacterLarge';
import bubbleCharacterSmall from '../../sprites/bubble/bubbleCharacterSmall';
import poppedBubble from "../../sprites/bubble/bubbleCharacterSmall";
import frogCharacter from "../../sprites/frog/frogCharacter";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const NUM_BUBBLES = 15;
const BUBBLE_SIZE = 60;
const OFFSET = 60;

class BubblePop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        score: 0,
        popTime: 0,
        bubbleCharacters: [],
    }
  }


  componentDidMount () {
    // get old score from storage if there is one and set up the scene
    AsyncStorage.getItem('score').then((value) => {
    this.setUpScene(JSON.parse(value));
    }).done();
  }

  // set up scene based on score from storage
  setUpScene (score) {
    this.createBubbles(NUM_BUBBLES - score);
    this.setState({score});
    this.youLost(); // start game timeout
  }

  // game timeout
  youLost = () => {
    timeout = setTimeout ( () => {
      this.props.navigator.push({ // go to NextGamePage after game timeout
        id: 5,
        callback: this.resetGame,
      });
      return <NextGamePage />;
    }, 30000);
  }

  // populate array of bubbles
  createBubbles(numBubbles) {
    let bubbles = [];
    for(let i=0; i < numBubbles; i++){
      let size = {};
      let sequence = [];
      let startLeft = i*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/NUM_BUBBLES);

      if(i%2 == 0){ // every other bubble gets different size and x transition sequence
        size = {width: BUBBLE_SIZE, height: BUBBLE_SIZE}
        sequence = [startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET];
      }
      else{
        size = {width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20}
        for(let i=0; i < 4; i++){
          sequence.push(startLeft);
          sequence.push(startLeft + OFFSET);
        } // not sure if this or the above sequence assignment is better...both seem weird
      }

      const tweenSettings = {
        tweenType: "sine-wave",
        startXY: [startLeft, SCREEN_HEIGHT],
        xTo: sequence,
        yTo: [0, SCREEN_HEIGHT],
        duration: this.getDuration(),
        loop: true,
      };
      bubbles.push(
        <AnimatedSprite
          key={i}
          spriteKey={i}
          coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
          size={size}
          draggable={false}
          character={bubbleCharacterLarge}
          tween={tweenSettings}
          tweenStart="auto"
          timeSinceMounted={
            (spriteKey, duration)=>this.popBubble(spriteKey, duration)
          }
          soundOnTouch={true}
          soundFile="bubblePop"
        />

      );
    }
    this.setState({bubbleCharacters: bubbles});
  }

  // random duration
  getDuration () {
    return( Math.random() *  (12000 - 4000) + 4000 );
  }

  // remove bubble and record time it took to pop it
  popBubble = (bubblePos, popTime) => {
    let bubbles = [];

    this.state.bubbleCharacters.forEach((item)=>{
      if(bubblePos !== item.props.spriteKey){
        bubbles.push(item)
      }
     //  else{
     //    bubbles.push(item);
     //    console.log(bubbles[bubblePos].props.spriteKey);
     //    bubbles[bubblePos].props.spriteKey = 8;
     //    console.log(bubbles[bubblePos].props.spriteKey);

     //    // console.warn(item.props.spriteKey);
     //    // console.warn(item.props.character);
     //    // console.log(item);
     //    // item.props.character = {frogCharacter}
     //    //             console.log(item);
     //    // this.state.bubbleCharacters[bubblePos].props.character = frogCharacter;
     //    // //this.setState({bubbleCharacters[bubblePos].props.character: frogCharacter});

     //    // console.log(this.state.bubbleCharacters[bubblePos].props.character);

     //   // bubbles.push(item);
     //         // <AnimatedSprite
     //         //    key={Math.random()}
     //         //      coordinates={{top: SCREEN_HEIGHT - 100, left: item.props.spriteKey*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/NUM_BUBBLES)}}
     //         //      size={{width: 256, height: 256}}
     //         //      draggable={false}
     //         //      character={item.props.character} />
     //        // <AnimatedSprite
     //        //   key={item.props.spriteKey}
     //        //   spriteKey={item.props.spriteKey}
     //        //   coordinates={{top: SCREEN_HEIGHT, left: item.props.spriteKey*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/NUM_BUBBLES)}}
     //        //   size={{width: 200, height: 20}}
     //        //   draggable={true}
     //        //   character={bubbleCharacterLarge}
     //        //   timeSinceMounted={this.popBubble.bind(null, item.props.spriteKey)}/>

     //   // );
     // }
      });

      this.setState({bubbleCharacters: bubbles, popTime: popTime});
      this.updateScore();
  }

  updateScore = () => {
    newScore = this.state.score + 1;
    this.setState({score: newScore});
    this.saveScore(newScore);

    if(newScore > NUM_BUBBLES - 1){ // navigate to win page if all bubbles are popped
      clearTimeout(timeout); // reset the game timer
      this.props.navigator.push({
        id: 4,
        callback: this.resetGame,
      });
     // clearTimeout(timeout); // reset the game timer
    }
  }

  saveScore = (data) => {
    AsyncStorage.setItem('score', JSON.stringify(data));
  }

  // reset score, bubbles and game timer once game has been won
  resetGame = () => {
    this.setState({popTime: 0});
    this.setState({score: 0});
    newScore = 0;
    this.saveScore(newScore);
    this.createBubbles(NUM_BUBBLES);
    this.youLost();
  };

  render(){
    return (
      <Image source={require('../../backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>SCORE: {this.state.score} Seconds To Pop: {this.state.popTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameWorld}>
            {this.state.bubbleCharacters}
          </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  topLevel :{
    alignItems: 'center',
  },
  gameWorld: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  topBar: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 700,
    borderStyle: 'solid',
    borderWidth: 2,
  },
});

export default BubblePop;
