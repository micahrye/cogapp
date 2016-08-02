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

import AnimatedSprite from '../animatedSprite';
import bubbleCharacter from '../../sprites/bubble/bubbleCharacterLarge';
import canCharacter from '../../sprites/can/canCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BUBBLE_SIZE = 60;
const OFFSET = 80;

class BubblePop extends React.Component {
  constructor(props){
    super(props);
    this.targetLocation = SCREEN_WIDTH/2 - 100;
    this.foodLocation = SCREEN_WIDTH/2 - 40; 
    this.targetSequence = [
      this.targetLocation + OFFSET/2,
      this.targetLocation - OFFSET/2, 
      this.targetLocation + OFFSET/2, 
      this.targetLocation - OFFSET/2
    ];
    this.foodSequence = [
      this.foodLocation + OFFSET/2,
      this.foodLocation - OFFSET/2, 
      this.foodLocation + OFFSET/2, 
      this.foodLocation - OFFSET/2
    ];

    if(this.props.route.targetDuration){
      this.targetDuration = this.props.route.targetDuration - 500;
    }
    else{
      this.targetDuration = 5000;
    }

    this.state = {
        score: 0,
        popTime: 0,
        bubbleCharacters: [],
        targetBubbleKey: 0,
        foodKey: 1,
        showTargetBubble: true,
        showFood: true,
        targetTween: {
          tweenType: "sine-wave",
          startXY: [this.targetLocation, SCREEN_HEIGHT - 80],
          xTo: this.targetSequence,
          yTo: [-200],
          duration: this.targetDuration,
          loop: true,
        },
        foodTween: {
          tweenType: "sine-wave",
          startXY: [this.foodLocation, SCREEN_HEIGHT - 10],
          xTo: this.foodSequence,
          yTo: [-200],
          duration: this.targetDuration + this.targetDuration/50,
          loop: true,
        },
    }
    this.numBubbles = 15;
    this.targetSpriteAnimationKey = 'default';
    this.timeoutGameOver = undefined;
    this.timeoutAfterBubblePop = undefined;
  }

  componentDidMount () {
    
    this.createBackgroundBubbles();
    this.timeoutGameOver = setTimeout ( () => { // start trial timeout
      this.props.navigator.replace({
        id: "BubblePopWinPage",
      });
    }, 15000); // game over when 15 seconds go by without bubble being popped

  }

  componentWillUnmount(){
    clearTimeout(this.timeoutGameOver);
    clearTimeout(this.timeoutAfterBubblePop);
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
          coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
          size={size}
          draggable={false}
          character={bubbleCharacter}
          tween={backgroundBubbleTween}
          tweenStart="auto"
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
    // this.targetSpriteAnimationKey = 'pop';
    clearTimeout(this.timeoutGameOver);
    this.setState({
      popTime: popTime,
      showTargetBubble: false,
      showFood: false,
    });
    this.timeoutAfterBubblePop = setTimeout(() => {
      if(this.targetDuration === 1000){ //if bubble is popped at 1 second duration, game is over
        this.props.navigator.replace({
          id: "BubblePopWinPage",
        });
      }
      else{
        this.goToNextTrial();
      }
    }, 500)
  }

  goToNextTrial(){
    this.props.navigator.replace({ 
      id: 'NextTrial',
      getId: this.getCurrId,
      targetDuration: this.targetDuration,
    });
  }

  getCurrId() {
    return 'BubblePop';
  }

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
                coordinates={{top: SCREEN_HEIGHT - 80, left: this.targetLocation}}
                size={{width: 200, height: 200}}
                draggable={false}
                character={bubbleCharacter}
                soundOnTouch={true}
                soundFile="bubblePop"
                tween={this.state.targetTween}
                tweenStart='auto'
                timeSinceMounted={(spriteKey, duration)=>this.popBubble(duration)}
                spriteAnimationKey={this.targetSpriteAnimationKey}/>
            : null}
            {this.state.showFood ?
              <AnimatedSprite
                key={this.state.foodKey}
                coordinates={{top: SCREEN_HEIGHT - 40, left: this.targetLocation + 200}}
                size={{width: 100, height: 100}}
                draggable={false}
                character={canCharacter}
                tween={this.state.foodTween}
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

// updateScore = () => {
//     //newScore = this.state.score + 1;
//     // this.setState({score: this.state.score + 1});
//     // //this.saveScore(newScore);
//     // if(this.state.score > this){ // navigate to win page if all bubbles are popped
//     //   console.warn('here');
//     //   clearTimeout(timeout); // reset the game timer
//     //   this.props.navigator.replace({
//     //     id: "BubblePopWinPage",
//     //   });
//     // }
//   }

  

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
