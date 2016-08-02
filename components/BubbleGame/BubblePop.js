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
    this.numBubbles = 15;
    this.targetSpriteAnimationKey = 'default';
    this.timeoutGameOver = undefined;
    this.timeoutAfterBubblePop = undefined;
    this.stopValues = undefined;
    this.foodTween = {};

    this.targetSequence = [
      this.targetLocation + OFFSET/2,
      this.targetLocation - OFFSET/2, 
      this.targetLocation + OFFSET/2, 
      this.targetLocation - OFFSET/2
    ];
    // this.foodSequence = [
    //   this.foodLocation + OFFSET/2,
    //   this.foodLocation - OFFSET/2, 
    //   this.foodLocation + OFFSET/2, 
    //   this.foodLocation - OFFSET/2
    // ];

    if(this.props.route.targetDuration){
      this.targetDuration = this.props.route.targetDuration - 500;
    }
    else{
      this.targetDuration = 5000;
    }

    this.targetTween = {
      tweenType: "sine-wave",
      startXY: [this.targetLocation, SCREEN_HEIGHT - 69],
      xTo: this.targetSequence,
      yTo: [-200],
      duration: this.targetDuration,
      loop: false,
      delay: 500,
    };

    this.state = {
      popTime: 0,
      bubbleCharacters: [],
      targetBubbleKey: 0,
      foodKey: 1,
      showTargetBubble: true,
      showFood: false,
      targetTween: this.targetTween,
      // foodTween: {
      //   tweenType: "sine-wave",
      //   startXY: [this.foodLocation, SCREEN_HEIGHT - 10],
      //   xTo: this.foodSequence,
      //   yTo: [-200],
      //   duration: this.targetDuration,
      //   loop: true,
      // },
    }
  }

  componentDidMount () {
    this.createBackgroundBubbles();
    this.timeoutBubbleRepeat = setInterval(() => { // so bubble repeats its tween up the screen if not popped
      this.setState({
        targetTween: this.targetTween,
        targetBubbleKey: Math.random(),
      })
    }, this.targetDuration);

    this.timeoutGameOver = setTimeout(() => { // start trial timeout
      this.props.navigator.replace({
        id: "GameOverPage",
      });
    }, 15000); // game over when 15 seconds go by without bubble being popped

  }

  componentWillUnmount(){
    clearTimeout(this.timeoutGameOver);
    clearTimeout(this.timeoutAfterBubblePop);
    clearInterval(this.timeoutBubbleRepeat);
  }

  // populate array of background bubbles
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

  // make bubble pop and record time it took to pop it
  popBubble = (popTime) => {
    clearTimeout(this.timeoutGameOver); // so game timeout screen doesn't load
    clearInterval(this.timeoutBubbleRepeat); // so bubble tween doesn't repeat up the screen anymore
    this.targetSpriteAnimationKey = 'pop';
    this.setState({
      popTime: popTime,
      targetTween: { // so bubble stays in place
        tweenType: "sine-wave",
        startXY: [this.stopValues[0], this.stopValues[1]],
        xTo: [this.stopValues[0]],
        yTo: [this.stopValues[1]],
        duration: 5000,
        loop: false,
      },
      targetBubbleKey: Math.random(),
    });

    this.foodFall();
  }

  // food falls out of bubble and down to character
  foodFall(){
    this.foodTween = {
      tweenType: 'curve-fall',
      startXY: [this.stopValues[0] +50 , this.stopValues[1] +50],
      endXY: [500, 200],
      duration: 2000,
      loop: false,
    }
    this.setState({showFood: true});
  }

  // triggered when an animation finishes
  onAnimationFinish(animationKey){
    if(animationKey === 'pop'){ // after bubble pops, go to next trial or game over
      if(this.targetDuration === 1000){ //if bubble is popped at 1 second duration, game is over
        this.props.navigator.replace({
          id: "GameOverPage",
        });
      }
      else{ // otherwise, next trial is started
        this.goToNextTrial();
      }
    }
  }

  goToNextTrial(){
    this.props.navigator.replace({ 
      id: 'NextTrial',
      getId: this.getCurrId, // to return back to this page
      targetDuration: this.targetDuration, // pass current target duration along route
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
                coordinates={{top: SCREEN_HEIGHT - 69, left: this.targetLocation}}
                size={{width: 200, height: 200}}
                draggable={false}
                character={bubbleCharacter}
                tween={this.state.targetTween}
                tweenStart='auto'
                stopTweenOnTouch={(stopValues) => this.stopValues = stopValues}
                soundOnTouch={true}
                soundFile="bubblePop"
                timeSinceMounted={(spriteKey, duration)=>this.popBubble(duration)}
                spriteAnimationKey={this.targetSpriteAnimationKey}
                onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>
            : null}
            {this.state.showFood ?
              <AnimatedSprite
                key={this.state.foodKey}
                coordinates={{top: this.stopValues[0] + 50 , left: this.stopValues[1] + 50}}
                size={{width: 100, height: 100}}
                draggable={false}
                character={canCharacter}
                tween={this.foodTween}
                tweenStart='auto'
                timeSinceMounted={(spriteKey, duration)=>this.popBubble(duration)}
                spriteAnimationKey='default'/>
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
