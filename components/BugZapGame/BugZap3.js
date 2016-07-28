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

class BugZap3 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      signKey: 3,
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
    this.prettyBug = undefined;
    this.bugSaveSpot = undefined;
    this.bugSize = [128, 128];
    this.frogSpriteAnimationKey = 'default';
    this.bugSpriteAnimationKey = 'default';
    this.zappedTooEarly = false;
    this.loop = true;
    this.xEnd = undefined;
  }

  componentDidMount() {
    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});
    }, 500);

    this.timeoutBugIdle = setTimeout(()=>{
      if(!this.zappedTooEarly){ // after first tween is completed, bug idles
        this.bugIdle();
      }
      else{
        this.bugFlyAway('default'); // if bug is zapped too early, it just flies away, no idling
      }
    }, 2500);
    this.setUpTweens();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
    clearTimeout(this.timeoutPrettyBug);
    clearTimeout(this.timeoutPrettyBugSave);
  }

  // 4 different spots for bug to land
  setUpTweens() {
    let sequenceChoice = Math.random();
    this.xEnd = 0;
    if(sequenceChoice < .25){
      this.xEnd = 200;
    }
    else if(sequenceChoice > .25 && sequenceChoice <.5){
      this.xEnd = 275;
    }
    else if(sequenceChoice > .5 && sequenceChoice <.75){
      this.xEnd = SCREEN_WIDTH - 400;
    }
    else{
      this.xEnd = SCREEN_WIDTH - 300;
    }

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [this.xEnd, 120],
      xTo: [this.xEnd],
      yTo: [120],
      duration: 0,
      loop: false,
    };

    // tween offscreen  
    this.tweenAway = { 
      tweenType: "sine-wave",
      startXY: [this.xEnd, 120],
      xTo: [-150],
      yTo: [0, 120, 0],
      duration: 2000,
      loop: false,
    };

    // initial tween onto screen
    this.bugTween = {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
        xTo: [450, 500, this.xEnd],
        yTo: [0, 120, 0, 120],
        duration: 2000,
        loop: false,
      };
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    let bugColorChoice = Math.random();
    this.prettyBug = Boolean(Math.floor(Math.random() * 2));

    if(bugColorChoice < .5){
      this.bugSpriteAnimationKey = 'idle'; // one type of bug color
    }
    else{
      this.bugSpriteAnimationKey = 'bubble'; // other type of bug color
    }
    this.bugTween = this.tweenIdle;
    this.setState({
      bugKey: Math.random(),
    });

    if(this.prettyBug){
      timeoutPrettyBug = setTimeout(() => {
        this.bugSpriteAnimationKey = 'prettyIdle'; // 50% of time it changes to prettybug
        this.setState({
          bugKey: Math.random(),
        });

        this.timeoutPrettyBugSave = setTimeout(() => { // if frog isn't tapped, prettybug is saved on screen
          this.saveBug();
        }, 1000);
      }, 250);
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

    if(!this.prettyBug){
      this.loop = false;
    }
    this.setState({
      bugKey: Math.random(),
    });
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
    this.signTweenStart = 'auto';
    this.bugTween = {
      tweenType: 'move',
      startXY: [this.xEnd, 120],
      endXY: [100, 40],
      duration: 2000,
      loop: false,
    };
    this.bugSize = [70, 70];

    this.setState({
      signKey: Math.random(),
      bugKey: Math.random(),
    });
  }

  frogTap = (frog) => {
    let bugType = this.bugSpriteAnimationKey;
    if(this.state.showBug && this.bugSize[0] === 128){ // if bug isn't already eaten or saved
      if(bugType === 'idle'){ 
        if(frog === 0){ // celebrate if right "color"
          this.correctFrogTapped(frog);
        }
        else{ // wrong frog tapped for that "color"
          this.incorrectFrogTap(frog);
        }
      }
      else if(bugType === 'bubble'){ 
        if(frog === 0){
          this.incorrectFrogTap(frog);
        }
        else{
          this.correctFrogTapped(frog);
        }
      }
      else if(bugType === 'prettyIdle'){ // frog is disgusted and prettybug flies away
        this.incorrectFrogTap(frog);
      }
      else if(this.bugTween != this.tweenAway){ // zapped too early  
        this.frogDisgust(frog);
        this.zappedTooEarly = true;
      }
    }
  }

  // bug splats and is hidden, frog celebrates
  correctFrogTapped(frog){
    this.loop =false; // so splat animation is not repeated
    this.bugSpriteAnimationKey = 'splat';
    this.setState({
      bugKey: Math.random(), 
    });

    this.frogCelebrate(frog);
    clearTimeout(this.timeoutFlyAway); // so frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  incorrectFrogTap(frog){
    if(this.prettyBug){
      this.bugFlyAway('prettyFly');
    }
    else{
      this.bugFlyAway('startFly');
    }
    this.frogDisgust(frog);
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
    clearTimeout(this.timeoutPrettyBugSave); // so bug isn't saved
  }

  // once bug has finished specific animation
  onAnimationFinish(animationKey) {
    if(animationKey === "splat"){
      this.setState({showBug: false});
    }
  }

  frogCelebrate(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random()});
      this.frogSpriteAnimationKey = 'celebrate';
    }
    else{
      this.setState({frogKey1: Math.random()}); 
      this.frogSpriteAnimationKey = 'celebrate';
    }
  }

  frogDisgust(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random()}) 
      this.frogSpriteAnimationKey = 'disgust';
    }
    else{
      this.setState({frogKey1: Math.random()});
      this.frogSpriteAnimationKey = 'disgust';
    }
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.replace({
      id: 'GameTwo',
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Go to Game Two</Text>
            </TouchableOpacity>

            <AnimatedSprite
                key={this.state.signKey}
                coordinates={{top: -105, left: 100}}
                size={{width: 70, height: 105}}
                draggable={false}
                character={signCharacter}
                tween={this.signTween}
                tweenStart={this.signTweenStart}/> 

            {this.state.showBug ? 
              <AnimatedSprite
                key={this.state.bugKey}
                coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
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
              key={this.state.frogKey0}
              spriteKey={0}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={frogCharacter}
              spriteAnimationKey={this.frogSpriteAnimationKey} 
              onPress={(frog) => {this.frogTap(frog)}}
              hitSlop={{top: -175, left: -55, bottom: -10, right: -65}}/>

            <AnimatedSprite 
              key={this.state.frogKey1}
              spriteKey={1}
              coordinates={{top: SCREEN_HEIGHT - 275, left: - 50}}
              size={{width: 256, height: 256}}
              rotate={[{rotateY: '180deg'}]}
              draggable={false}
              character={frogCharacter}
              spriteAnimationKey={this.frogSpriteAnimationKey} 
              onPress={(frog) => {this.frogTap(frog)}} 
              hitSlop={{top: -175, left: -65, bottom: -10, right: -55}}/>
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

export default BugZap3;

