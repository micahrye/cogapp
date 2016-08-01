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
import bubbleCharacter from '../../sprites/bubble/bubbleCharacterLarge';
import poppedBubble from "../../sprites/bubble/bubbleCharacterSmall";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BUBBLE_SIZE = 60;
const OFFSET = 80;

class BubblePop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        score: 0,
        popTime: 0,
        bubbleCharacters: [],
        targetBubbleKey: 0,
        showTargetBubble: true,
    }
    this.numBubbles = 15;
    this.targetLocation = SCREEN_WIDTH/2 - 100;
    this.targetSpriteAnimationKey = 'pop';

    this.targetSequence = [
      this.targetLocation + OFFSET/2,
      this.targetLocation - OFFSET/2, 
      this.targetLocation + OFFSET/2, 
      this.targetLocation - OFFSET/2
    ];
    this.targetTween = {
      tweenType: "sine-wave",
      startXY: [this.targetLocation, SCREEN_HEIGHT - 80],
      xTo: this.targetSequence,
      yTo: [-200],
      duration: 6000,
      loop: false,
      stopTweenOnTouch: true,
    };
  }

  componentDidMount () {
    this.createBackgroundBubbles();
    timeout = setTimeout ( () => { // start game timeout
      this.youLost(); 
    }, 30000);

  }
  
  // game timeout
  youLost = () => {
    this.goToNextTrial();
  }


  // populate array of bubbles
  createBackgroundBubbles() {
    let bubbles = [];
    for(let i=0; i < this.numBubbles; i++){
      let size = {};
      let sequence = [];
      let startLeft = i*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/this.numBubbles);

      if(i%2 == 0){ // every other bubble gets different size and x transition sequence
        size = {width: BUBBLE_SIZE, height: BUBBLE_SIZE}
        sequence = [startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft];
      }
      else{
        size = {width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20}
        sequence = [startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET];
      }

      let backgroundBubbleTween = {
        tweenType: "sine-wave",
        startXY: [startLeft, SCREEN_HEIGHT],
        xTo: sequence,
        yTo: [-60],
        duration: this.getRandomDuration(),
        loop: true,
      };

      bubbles.push(
        <AnimatedSprite
          key={i}
          spriteKey={i}
          coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
          size={size}
          draggable={false}
          character={bubbleCharacter}
          tween={backgroundBubbleTween}
          tweenStart="auto"
          soundOnTouch={true}
          soundFile="bubblePop"
          spriteAnimationKey='default'/>

      );
    }
    this.setState({bubbleCharacters: bubbles});
  }

  // random time for background bubbles to be on screen, between 2 and 6 seconds
  getRandomDuration () {
    return( Math.random() *  (6000 - 2000) + 2000 ); 
  }

  // remove bubble and record time it took to pop it
  popBubble = (popTime) => {
    this.targetSpriteAnimationKey = 'pop';
    this.setState({
      popTime: popTime,
      //showTargetBubble: false,
      //targetBubbleKey: Math.random(),
    });
    //this.goToNextTrial();
    //this.updateScore();
  }

  goToNextTrial(){
    this.props.navigator.replace({ 
      id: 'NextTrial',
      getId: this.getCurrId,
    });
  }

  getCurrId() {
    return 'BubblePop';
  }

  updateScore = () => {
    //newScore = this.state.score + 1;
    // this.setState({score: this.state.score + 1});
    // //this.saveScore(newScore);
    // if(this.state.score > this){ // navigate to win page if all bubbles are popped
    //   console.warn('here');
    //   clearTimeout(timeout); // reset the game timer
    //   this.props.navigator.replace({
    //     id: "BubblePopWinPage",
    //   });
    // }
  }

  

  // saveScore = (data) => {
  //   AsyncStorage.setItem('score', JSON.stringify(data));
  // }

  // reset score, bubbles and game timer once game has been won
  // resetGame = () => {
  //   this.setState({popTime: 0});
  //   this.setState({score: 0});
  //   newScore = 0;
  //   this.saveScore(newScore);
  //   this.createBubbles(NUM_BUBBLES);
  //   this.youLost();
  // };

  render(){
    return (
      <Image source={require('../../backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Seconds To Pop: {this.state.popTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameWorld}>
            {this.state.bubbleCharacters}
            {this.state.showTargetBubble ?
              <AnimatedSprite
                key={this.state.targetBubbleKey}
                coordinates={{top: SCREEN_HEIGHT, left: SCREEN_WIDTH/2 - 100}}
                size={{width: 200, height: 200}}
                draggable={false}
                character={bubbleCharacter}
                soundOnTouch={true}
                soundFile="bubblePop"
                tween={this.targetTween}
                tweenStart='auto'
                timeSinceMounted={(spriteKey, duration)=>this.popBubble(duration)}
                spriteAnimationKey={this.targetSpriteAnimationKey}/>
            : null}
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


    // //this.setState({bubbleKey: Math.random(), spriteAnimationKey: 'pop'});
  

    // //this.createBubbles(this.state.bubbleCharacters.length - 1);

    // this.state.bubbleCharacters.forEach((item)=>{
    //   if(bubblePos !== item.props.spriteKey){
    //     bubbles.push(item)
    //   }
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
      //});
