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

// imports
import AnimatedSprite from "../animatedSprite";
// import characters for animatedsprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter"
import bubbleCharacter from "../../sprites/bubble/bubbleCharacterLarge";
import signCharacter from "../../sprites/sign/signCharacter";
import Background from '../../backgrounds/Game_1_Background_1280.png';

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
      tweenSettings: {},
      signTween: {},
      signTweenStart: ' ',
      zappedTooEarly: false,
      frogSpriteAnimationKey: 'default',
      bugSpriteAnimationKey: 'default',
      loop: true,
    }
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.timeoutPrettyBug = undefined;
    this.timeoutPrettyBugSave = undefined;
    this.prettyBug = true;

  }

  componentDidMount() {
    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});
    }, 500);

    this.timeoutBugIdle = setTimeout(()=>{
      if(!this.state.zappedTooEarly){ // after first tween is completed, bug idles
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
    let xEnd = 0;
    if(sequenceChoice < .25){
      xEnd = 200;
    }
    else if(sequenceChoice > .25 && sequenceChoice <.5){
      xEnd = 275;
    }
    else if(sequenceChoice > .5 && sequenceChoice <.75){
      xEnd = SCREEN_WIDTH - 400;
    }
    else{
      xEnd = SCREEN_WIDTH - 300;
    }

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [xEnd, 120],
      xTo: [xEnd],
      yTo: [120],
      duration: 0,
      loop: false,
    };

    // tween offscreen  
    this.tweenAway = { 
      tweenType: "sine-wave",
      startXY: [xEnd, 120],
      xTo: [-150],
      yTo: [0, 120, 0],
      duration: 2000,
      loop: false,
    };

    this.setState({
      tweenSettings: // initial tween onto screen
      {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
        xTo: [450, 500, xEnd],
        yTo: [0, 120, 0, 120],
        duration: 2000,
        loop: false,
      },
    });
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    let bugColorChoice = Math.random();
    //this.prettyBug = Boolean(Math.floor(Math.random() * 2));

    if(bugColorChoice < .5){
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'idle', // one type of bug color
        tweenSettings: this.tweenIdle,
      });
    }
    else{
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'bubble', // other type of bug color
        tweenSettings: this.tweenIdle,
      });
    }

    if(this.prettyBug){
      timeoutPrettyBug = setTimeout(() => {
        this.setState({
          bugKey: Math.random(),
          bugSpriteAnimationKey: 'prettyIdle', // 50% of time it changes to prettybug
        })
        timeoutPrettyBugSave = setTimeout(() => { // if frog isn't tapped, prettybug is saved on screen
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
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: animation,
      loop: false,
      tweenSettings: this.tweenAway,   
    });
    if(this.prettyBug){
      this.setState({
        loop: true,
      });
    }
  }

  // drop sign to put bug on
  saveBug(){
    this.signTween = {
      tweenType: "bounce-drop",
      startY: -75,
      endY: 0,
      duration: 3000,
      loop: false,
    }
    this.setState({
      signKey: Math.random(),
      signTweenStart: 'auto',
    })
  }

  frogTap = (frog) => {
    let bugType = this.state.bugSpriteAnimationKey;
    if(this.state.showBug){ // if bug isn't already eaten
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
      else if(this.state.tweenSettings != this.tweenAway){ // zapped too early  
        this.frogDisgust(frog);
        this.setState({zappedTooEarly: true});
      }
    }
  }

  // bug splats and is hidden, frog celebrates
  correctFrogTapped(frog){
    this.setState({
      bugKey: Math.random(), 
      bugSpriteAnimationKey: 'splat',
      loop: false, // so splat animation is not repeated
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
  }

  // once bug has finished specific animation
  onAnimationFinish(animationKey) {
    if(animationKey === "splat"){
      this.setState({showBug: false});
    }
  }

  frogCelebrate(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
  }

  frogDisgust(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'disgust'});
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'disgust'});
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
                coordinates={{top: -75, left: 100}}
                size={{width: 47, height: 75}}
                draggable={false}
                character={signCharacter}
                tween={this.signTween}
                tweenStart={this.state.signTweenStart}/> 

            {this.state.showBug ? 
              <AnimatedSprite
                key={this.state.bugKey}
                coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                size={{width: 128, height: 128}}
                draggable={false}
                character={bugCharacter}
                tween={this.state.tweenSettings}
                tweenStart='auto'
                spriteAnimationKey={this.state.bugSpriteAnimationKey}
                loopAnimation={this.state.loop}
                onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/> 
            : null}

            <AnimatedSprite
              key={this.state.frogKey0}
              spriteKey={0}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={frogCharacter}
              spriteAnimationKey={this.state.frogSpriteAnimationKey} 
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
              spriteAnimationKey={this.state.frogSpriteAnimationKey} 
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

