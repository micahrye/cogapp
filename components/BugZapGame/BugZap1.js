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

const TRIAL_CYCLE = 3; // 3 trials = 1 cycle, before reset to 0

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
    this.timeoutPrettyBug = undefined;
    this.timeoutPrettyBugSave = undefined;
    this.timeoutNextTrial = undefined;
    this.prettyBug = undefined;
    this.bugSize = [128, 128];
    this.frogSpriteAnimationKey = 'default';
    this.bugSpriteAnimationKey = 'default';
    this.zappedTooEarly = false;
    this.loop = true;
    this.xLand = 350;
    this.yLand = 70;    
    this.flyInDuration = undefined;
    this.signs = [];
    this.farthestTag = 0;
    this.fail = false;
    this.numFails = 0;
    this.trialNumber = -(TRIAL_CYCLE - 1); // first TRIAL_CYCLE trials always run, then reset trialNumber to 0 every 3rd trial 
  }

  componentDidMount() {
    if(this.props.route.bugTags){
      this.createBugTags(this.props.route.bugTags);
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
    clearTimeout(this.timeoutPrettyBug);
    clearTimeout(this.timeoutPrettyBugSave);
    clearTimeout(this.timeoutNextTrial);
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
            size={{width: 70, height: 105}}
            draggable={false}
            character={signCharacter}/>

          <AnimatedSprite
            coordinates={{top: 40, left: 0}}
            size={{width: 70, height: 70}}
            draggable={false}
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
    let flySequenceX = [450, 500, this.xLand];
    let flySequenceY = [];

    if(sequenceChoice < .5){
      flySequenceY = [0, this.yLand, 0, this.yLand];
    }
    else{
      flySequenceY = [200, 100, 50, this.yLand];
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
      let timeToPrettyBugAppear = Math.random() * 400; // average is 200ms
      this.timeoutPrettyBug = setTimeout(() => {
        this.bugSpriteAnimationKey = 'prettyIdle'; 
        this.setState({bugKey: Math.random()});
        this.timeoutPrettyBugSave = setTimeout(() => { // if frog isn't tapped, prettybug is saved on screen
          this.saveBug();
        }, 1000);
      }, 400);
    }

    else{
      this.timeoutFlyAway = setTimeout(()=>{
        this.bugFlyAway('startFly');
        this.frogDisgust(0);
        this.frogDisgust(1);
      }, 2000);
    }
  }

  // switch to flying bug character and start next tween
  bugFlyAway(animation) {
    this.bugSpriteAnimationKey = animation;
    this.bugTween = this.tweenAway;

    if(!this.prettyBug){ // because non pretty bugs have a starting-to-fly animation that only loops once
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
        size={{width: 70, height: 105}}
        draggable={false}
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
      if(this.bugSpriteAnimationKey === 'idle'){
        if(this.prettyBug) {
          this.incorrectFrogTap();
        }
        else{
          this.correctFrogTap();
        }
      }
      else if(this.bugSpriteAnimationKey === 'prettyIdle'){ // frog is disgusted and prettybug flies away
        this.incorrectFrogTap();
      }
      else if(this.bugTween != this.tweenAway){ // zapped too early  
        this.frogDisgust();
        this.zappedTooEarly = true;
      }
    }
  }

  // bug splats and is hidden, frog celebrates
  correctFrogTap(){
    this.loop = false; // so splat animation is not repeated
    this.bugSpriteAnimationKey = 'splat';
    this.setState({bugKey: Math.random()}); // so that component re-render is triggered
    this.frogCelebrate();
    clearTimeout(this.timeoutFlyAway); // so frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, prettybug flies away
  incorrectFrogTap(){
    this.bugFlyAway('prettyFly');
    this.frogDisgust();
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
    clearTimeout(this.timeoutPrettyBugSave); // so bug isn't saved
    clearTimeout(this.timeoutPrettyBug); // in case frog was tapped before prettybug appeared on a prettybug trial
  }

  // once bug has finished specific animation
  onAnimationFinish(animationKey) {
    if(animationKey === 'splat'){
      this.setState({showBug: false});
    }
    else if(animationKey === 'celebrate'){
      this.goToNextTrial();
    }
  }

  frogCelebrate() {
    this.setState({frogKey: Math.random()});
    this.frogSpriteAnimationKey = 'celebrate';
  }

  frogDisgust() {
    this.setState({frogKey: Math.random()}) 
    this.frogSpriteAnimationKey = 'disgust';
    this.fail = true;
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.replace({
      id: 'BugZap2',
    });
  }

  // TODO: rework this, kind of a mess
  goToNextTrial() {
    if(this.props.route.numFails != undefined){
      if(this.fail){
        this.numFails = this.props.route.numFails + 1; // if trial was a failure, increase fails by one
      }
      else{
        this.numFails = this.props.route.numFails; // otherwise fails stays the same
      }
    }
    else if(this.fail){ // on first load, this.props.route.numFails is not defined
      this.numFails = 1;
    } // put this in its own function called from frogDisgust

    //MAYBE MAKE ALL THIS ONE FUNCTION CALLED FROM COMPONENTDIDMOUNT CALLED UPDATE/CHECKTRIAL (actually don't think you can bc of the fail checks, won't know until down here)
    if(this.props.route.trialNumber != undefined){
      this.trialNumber = this.props.route.trialNumber + 1; // increase number of completed trials by one
    } // put this in componentDidMount

    if(this.trialNumber === 0){ // after first TRIAL_CYCLE trials
      if(this.numFails === TRIAL_CYCLE){ // if first TRIAL_CYCLE trials are all fails, go to next bug game
        this.goToNextBugGame();
        return;
      }
      else{
        this.numFails = 0;
      }
    }

    if(this.trialNumber === TRIAL_CYCLE){
      if(this.numFails > TRIAL_CYCLE/2){ // if failure rate over 50% after 3 more trials, go to next bug game
        this.goToNextBugGame();
        return;
      }
      else{
        this.trialNumber = 0; // reset trial and fail counter if succesfully made it thru trial cycle
        this.numFails = 0;
      }
    }
    console.warn('trialnum' + this.trialNumber);
    console.warn('failnum' + this.numFails);
    

    this.props.navigator.push({
      id: 'NextTrial',
      getId: this.getCurrId,
      bugTags: this.state.bugTags.length,
      numFails: this.numFails,
      trialNumber: this.trialNumber,
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
              draggable={false}
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
            coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
            size={{width: 256, height: 256}}
            draggable={false}
            character={frogCharacter}
            spriteAnimationKey={this.frogSpriteAnimationKey} 
            onPress={(frog) => {this.frogTap(frog)}}
            hitSlop={{top: -175, left: -55, bottom: -10, right: -65}}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>

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
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 90,
    height: 30,
  },
});

export default BugZap1;

