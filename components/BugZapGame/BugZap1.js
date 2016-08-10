import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Navigator,
} from 'react-native';


// import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter"
import bubbleCharacter from "../../sprites/bubble/bubbleCharacterLarge";
import signCharacter from "../../sprites/sign/signCharacter";
import Background from '../../backgrounds/Game_1_Background_1280.png';

import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const TRIAL_CYCLE = 3; // 3 trials = 1 cycle, then reset to 0
const IDLE_DURATION = 750; // how long bug is catchable


class BugZap1 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 10,
      frogKey: 11,
      bugTags: [],
    }
    this.tweenIdle = {};
    this.tweenAway = {};
    this.bugTween = {};
    this.signTween = {};
    this.signTweenStart = ' ';
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.timeoutPrettyBugAppear = undefined;
    this.timeoutPrettyBugSave = undefined;
    //this.timeoutPrettyBugFlyAway = undefined;
    this.timeoutNextTrial = undefined;
    this.prettyBug = undefined;
    this.timeToPrettyBugAppear = 100;
    this.prettyBugHasAppeared = false;
    this.bugSize = [128, 128];
    this.frogSpriteAnimationKey = 'default';
    this.bugSpriteAnimationKey = 'default';
    this.zappedTooEarly = false;
    this.loop = true;
    this.xLand = 580;
    this.yLand = 120;    
    this.flyInDuration = undefined;
    this.signs = [];
    this.farthestTag = 0;
    this.numFails = 0;
    this.trialNumber = 1 - TRIAL_CYCLE; 
      // first TRIAL_CYCLE trials always run, then reset trialNumber to 0 every TRIAL_CYLE trials
      // this.trialNumber starts negative so the first TRIAL_CYCLE trials can be checked as their own separate case
  }

  componentDidMount() {
    if(this.props.route.numFails != undefined){ // on first load, this.props.route.* not defined
      this.numFails = this.props.route.numFails;
    }
    if(this.props.route.trialNumber != undefined){
      this.trialNumber = this.props.route.trialNumber + 1;
    }
    if(this.props.route.bugTags != undefined){
      this.createBugTags(this.props.route.bugTags);
    }
    if(this.props.route.timeToPrettyBugAppear != undefined){
      this.timeToPrettyBugAppear = this.props.route.timeToPrettyBugAppear;
    }
    if(this.props.route.prettyBugHasAppeared != undefined){
      this.prettyBugHasAppeared = this.props.route.prettyBugHasAppeared;
    }

    this.flyInDuration = Math.random() *  (4000 - 1500) + 1500;
    this.setUpTweens();

    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});
      
      this.timeoutBugIdle = setTimeout(()=>{
        if(!this.zappedTooEarly){ // after first tween is completed, bug idles
          this.bugIdle();
        }
        else{
          this.bugFlyAway('default'); // if bug is zapped too early, it just flies away, no idling
        }
      }, this.flyInDuration);

    }, 500);

  }

  componentWillUnmount() {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
    clearTimeout(this.timeoutPrettyBugAppear);
    clearTimeout(this.timeoutPrettyBugSave);
    clearTimeout(this.timeoutNextTrial);
    //clearTimeout(this.timeoutPrettyBugFlyAway);
  }

  // load bug tags with already caught pretty bugs
  createBugTags(numBugTags){
    let spacing = 90;
    if(numBugTags > 7){
      spacing = SCREEN_WIDTH/numBugTags - 20;
    }
    for(let i = 0; i < numBugTags; i++){
      this.signs.push(
        <View key={Math.random()} style={{left: spacing*i}}>
          <AnimatedSprite
            coordinates={{top: 0, left: 0}}
            size={{width: 70, height: 110}}
            character={signCharacter}/>

          <AnimatedSprite
            coordinates={{top: 40, left: 0}}
            size={{width: 70, height: 70}}
            character={bugCharacter}
            spriteAnimationKey='caught'
            loopAnimation={this.loop}/>
        </View> 
      );
    }
    this.farthestTag = spacing*numBugTags;
    this.setState({
      bugTags: this.signs,
    });
  }

  // two different ways bug can reach landing spot
  setUpTweens() {
    let sequenceChoice = Math.random();
    let flySequenceX = [680, 730, this.xLand];
    let flySequenceY = [];

    if(sequenceChoice < .5){
      flySequenceY = [50, this.yLand, 50, this.yLand];
    }
    else{
      flySequenceY = [250, 150, 100, this.yLand];
    }

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [this.xLand, this.yLand],
      xTo: [this.xLand],
      yTo: [this.yLand],
      duration: 0,
      loop: false,
    };

    // tween offscreen  
    this.tweenAway = { 
      tweenType: "sine-wave",
      startXY: [this.xLand, this.yLand],
      xTo: [-150],
      yTo: [0, this.yLand, 0],
      duration: 2000,
      loop: false,
    };

    // initial tween onto screen
    this.bugTween = {
      tweenType: "sine-wave",
      startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
      xTo: flySequenceX,
      yTo: flySequenceY,
      duration: this.flyInDuration,
      loop: false,
    };
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    this.bugSpriteAnimationKey = 'idle';
    this.bugTween = this.tweenIdle;
    this.setState({bugKey: Math.random()}); // so that component re-render is triggered

    this.prettyBug = Boolean(Math.floor(Math.random() * 2)); // 50% of time it changes to prettybug
    if(this.prettyBug){
      if(this.props.route.timeToPrettyBugAppear != undefined && this.prettyBugHasAppeared){ // if prettybug has already appeared once at 100ms delay
        this.timeToPrettyBugAppear = this.timeToPrettyBugAppear + 25;
      }
      this.timeoutPrettyBugAppear = setTimeout(() => {
        this.bugSpriteAnimationKey = 'prettyIdle';
        this.setState({bugKey: Math.random()});
        this.timeoutPrettyBugSave = setTimeout(() => { // if frog isn't tapped, prettybug is saved on screen
          this.saveBug();
        }, 1000);
      }, this.timeToPrettyBugAppear);
      this.prettyBugHasAppeared = true;
    }

    else{
      this.timeoutFlyAway = setTimeout(()=>{
        this.bugFlyAway('startFly');
        this.frogDisgust();
      }, IDLE_DURATION);
    }
  }

  // switch to flying bug character and start next tween
  bugFlyAway(animation) {
    this.bugSpriteAnimationKey = animation;
    this.bugTween = this.tweenAway;

    if(!this.prettyBug){ // need to loop prettybug fly
      this.loop = false;
    }
    this.setState({
      bugKey: Math.random(),
    });
    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial();
    }, 2000);
  }

  // drop sign and put bug on it
  saveBug(){
    this.signTween = {
      tweenType: "bounce-drop",
      startY: -105,
      endY: 0,
      duration: 1700,
      loop: false,
    };

    this.signs.push( // place new sign at end of row of existing signs
      <AnimatedSprite
        key={Math.random()}
        coordinates={{top: 0, left: this.farthestTag}}
        size={{width: 70, height: 110}}
        character={signCharacter}
        tween={this.signTween}
        tweenStart='auto'/>
    );

    this.bugTween = { // bug moves up to new sign
      tweenType: 'move',
      startXY: [this.xLand, this.yLand],
      endXY: [this.farthestTag, 40],
      duration: 2000,
      loop: false,
    };
    this.bugSize = [70, 70];

    this.setState({
      bugKey: Math.random(),
      bugTags: this.signs,
    });

    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial(); // pass number of existing bug tags through to next trial
    }, 3000);
  }

  frogTap = () => {
    if(this.state.showBug && this.bugSize[0] === 128){ // if bug isn't already eaten or saved
      if(this.bugSpriteAnimationKey === 'idle' || this.bugSpriteAnimationKey === 'prettyIdle'){
        this.frogEat();
        clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called if it shouldn't be
        if(this.prettyBug){
          clearTimeout(this.timeoutPrettyBugSave); // so bug isn't saved
        }
      }
      else if(this.bugTween != this.tweenAway){ // zapped too early  
        this.frogDisgust();
        this.zappedTooEarly = true;
      }
    }
  }

  // indicates which frame the animation is currently on
  getFrameIndex(animationKey, frameIndex) {
    if(animationKey === 'eat' && frameIndex === 5 && this.bugSpriteAnimationKey != 'prettyIdle'){
      this.bugSplat(); // when tongue has reached bug
    }
  }

  // triggered when certain animations finish
  onAnimationFinish(animationKey) {
    if(animationKey === 'splat'){
      this.setState({showBug: false});
    }
    else if(animationKey === 'eat'){
      if(this.bugSpriteAnimationKey != 'prettyIdle'){
       this.frogCelebrate();
      }
      else{ // if it's a prettybug 
        this.bugFlyAway('prettyFly');
        this.frogDisgust();
      }
    }
    else if(animationKey === 'celebrate'){
      this.goToNextTrial();
    }
  }

  bugSplat(){
    this.loop = false // so splat animation doesn't loop
    this.bugSpriteAnimationKey = 'splat';
    this.setState({bugKey: Math.random()}); // so component re-render is triggered
  }

  frogEat(){
    this.frogSpriteAnimationKey = 'eat';
    this.setState({frogKey: Math.random()});
  }

  frogCelebrate() {
    this.frogSpriteAnimationKey = 'celebrate';
    this.setState({frogKey: Math.random()});
  }

  frogDisgust() {
    this.frogSpriteAnimationKey = 'disgust';
    this.setState({frogKey: Math.random()}) 
    this.fail();
  }

  // increase number of fails for that trial cycle by one
  fail(){
    if(this.props.route.numFails != undefined){
      this.numFails = this.props.route.numFails + 1; // increase fails by one
    }
    else{ // on first load, this.props.route.numFails is not defined
      this.numFails = 1;
    }
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.replace({
      id: 'BugZap2',
    });
  }

  // if too many fails go to next bug game, reset trial counter if needed, go to next trial
  goToNextTrial() {
    if(this.trialNumber === 0){ // only runs after first TRIAL_CYCLE trials
      if(this.numFails === TRIAL_CYCLE){ // if first TRIAL_CYCLE trials are all fails, go to next bug game
        this.goToNextBugGame();
        return;
      }
      else{
        this.numFails = 0;
      }
    }

    else if(this.trialNumber === TRIAL_CYCLE){
      if(this.numFails > TRIAL_CYCLE/2){ // if failure rate over 50% after 3 more trials, go to next bug game
        this.goToNextBugGame();
        return;
      }
      else{
        this.trialNumber = 0; // reset trial and fail counter if succesfully made it thru trial cycle
        this.numFails = 0;
      }
    }    

    this.props.navigator.push({
      id: 'NextTrial',
      getId: this.getCurrId,
      bugTags: this.state.bugTags.length,
      numFails: this.numFails,
      trialNumber: this.trialNumber,
      timeToPrettyBugAppear: this.timeToPrettyBugAppear,
      prettyBugHasAppeared: this.prettyBugHasAppeared,
    });
  }

  getCurrId() {
    return 'BugZap1';
  }

  goToNextBugGame() {
    this.props.navigator.replace({
      id: 'BugZap2',
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          {this.state.bugTags}

          {this.state.showBug ? 
            <AnimatedSprite
              key={this.state.bugKey}
              coordinates={{top: 0, left: 0}}
              size={{width: this.bugSize[0], height: this.bugSize[1]}}
              character={bugCharacter}
              tween={this.bugTween}
              tweenStart='auto'
              spriteAnimationKey={this.bugSpriteAnimationKey}
              loopAnimation={this.loop}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/> 
          : null}

          <AnimatedSprite
            key={this.state.frogKey}
            spriteKey={0}
            coordinates={{top: 200, left: 500}}
            size={{width: 750, height: 375}}
            character={frogCharacter}
            spriteAnimationKey={this.frogSpriteAnimationKey}
            onPress={(frog) => {this.frogTap(frog)}}
            hitSlop={{top: -175, left: -55, bottom: -10, right: -65}}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}
            getFrameIndex={(animationKey, frameIndex) => {this.getFrameIndex(animationKey, frameIndex)}}/>

          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
            <Text>Go to Level 2</Text>
          </TouchableOpacity> 
        </Image> 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 600,
    width: 1024,
  },
  backgroundImage: {
    flex: 1,
    height: 600,
    width: 1024,
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 100,
    height: 30,
    justifyContent: 'center',
  },
});

export default BugZap1;