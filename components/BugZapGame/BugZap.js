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
import bugCharacter from '../../sprites/bug/bugCharacter';
import Background from '../../backgrounds/Game_1_Background_1280.png';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      tweenSettings: {},
      zappedTooEarly: false,
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      loop: true,
    }
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeout0 = undefined;
    this.timeout1 = undefined;
    this.timeout2 = undefined;
    this.timeout3 = undefined;
  }

  componentDidMount() {
    // render bug after the rest of the scene
    this.timeout0 = setTimeout( () => {
      this.setState({showBug: true});
    }, 500);

    this.timeout1 = setTimeout(()=>{
      if(!this.state.zappedTooEarly){ // after first tween is completed, bug idles
        this.bugLand();
        //this.bugIdle();
      }
      else{
        this.bugFlyAway(); // if bug is zapped too early, it just flies away, no idling
      }
    }, 3500);
    this.setUpTweens();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout0);
    clearTimeout(this.timeout1);
    if(this.timeout2 !== undefined){
      clearTimeout(this.timeout2);
    }
    if(this.timeout3 !== undefined){
      clearTimeout(this.timeout3);
    }
  }

  // 4 different spots for bug to land
  setUpTweens() {
    let sequenceChoice = Math.random();
    let xEnd = 0;
    if(sequenceChoice < .25){
      xEnd = 200;
    }
    else if (sequenceChoice > .25 && sequenceChoice <.5){
      xEnd = 275;
    }
    else if (sequenceChoice > .5 && sequenceChoice <.75){
      xEnd = SCREEN_WIDTH - 400;
    }
    else{
      xEnd = SCREEN_WIDTH - 300;
    }

    // landing
    this.tweenLanding = {
      tweenType: "sine-wave",
      startXY: [xEnd + 10, 120],
      xTo: [xEnd],
      yTo: [130],
      duration: 125,
      loop: false,
    }

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [xEnd, 130],
      xTo: [xEnd],
      yTo: [130],
      duration: 0,
      loop: false,
    };

    // tween offscreen
    this.tweenAway = {
      tweenType: "sine-wave",
      startXY: [xEnd, 120],
      xTo: [-150],
      yTo: [0, 100, 0],
      duration: 2000,
      loop: false,
    };

    this.setState({
      tweenSettings: // initial tween onto screen
      {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
        xTo: [xEnd],
        yTo: [0, 120, 0, 120],
        duration: 3000,
        loop: false,
      },
    });
  }

  bugLand() {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'landing',
      tweenSettings: this.tweenLanding,
    });
    this.timeout25 = setTimeout(() => {
      this.bugIdle();
    }, 125);
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.tweenIdle,
      bugSpriteAnimationKey: 'idle',
    });
    this.timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust();
    }, 3000);
  }

  // switch to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.tweenAway,
      bugSpriteAnimationKey: 'startFly',
      loop: false,
    });
    timeout3 = setTimeout(() => {
      this.goToNextTrial();
    }, 2000);
  }

  frogTap = () => {
    if(this.state.showBug){
      if(this.state.bugSpriteAnimationKey === 'default'){ // bug has landed
        this.catchBug();
      }
      else if(this.state.tweenSettings != this.tweenAway){ // bug has not landed yet
        this.frogDisgust();
        this.setState({zappedTooEarly: true}); // now bug doesn't land, just keeps flying offscreen
      }
    }
  }

  catchBug(){
    this.setState({
      bugKey: Math.random(), 
      bugSpriteAnimationKey: 'splat',
      loop: false,
    });
    this.frogCelebrate();
    clearTimeout(this.timeout2); // so that "bugFlyAway" function doesn't run after bug is "caught"
  }

  frogCelebrate() {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'celebrate'});
  }

  frogDisgust() {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'disgust'});
  }

  
  onAnimationFinish(animationKey) {
    if(animationKey === 'splat'){
      this.setState({showBug: false}); // once bug has splatted
    }
    if(animationKey === 'celebrate'){
      this.goToNextTrial(); // once bug is done celebrating
    }
    // if(animationKey == 'landing'){
    //   this.bugIdle();
    // }
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.replace({
      id: 7,
    });
  }

  goToNextTrial() {
    this.props.navigator.replace({
      id: 23,
      getId: this.getCurrId,
    });
  }

  getCurrId() {
    return 6;
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Go to Level 1</Text>
            </TouchableOpacity>

            {this.state.showBug ?
              <AnimatedSprite
                key={this.state.bugKey}
                spriteKey={0}
                coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                size={{width: 128, height: 128}}
                draggable={false}
                character={bugCharacter}
                tween={this.state.tweenSettings}
                tweenStart="auto"
                spriteAnimationKey={this.state.bugSpriteAnimationKey}
                loopAnimation={this.state.loop}
                onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}/>
            : null}

            <AnimatedSprite
              key={this.state.frogKey}
              spriteKey={1}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              character={frogCharacter}
              onPress={this.frogTap}
              spriteAnimationKey={this.state.frogSpriteAnimationKey}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey)}}
              />
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
export default BugZap;
