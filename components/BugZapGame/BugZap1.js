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

class BugZap1 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      tweenSettings: {},
      tweenIdle: {},
      tween2: {},
      zappedTooEarly: false,
      bugSpriteAnimationKey: 'fly',
      frogSpriteAnimationKey: 'idle',
    }
  }

  componentWillMount() {
    // render bug after the rest of the scene
    timeout0 = setTimeout( () => {
      this.setState({showBug: true});
      clearTimeout(timeout0);
    }, 500);
  }

  componentDidMount() {
    timeout1 = setTimeout(()=>{
      if(!this.state.zappedTooEarly){ // after first tween is completed, bug idles
        this.bugIdle();
      }
      else{
        this.bugFlyAway(); // if bug is zapped too early, it just flies away, no idling
      }
      clearTimeout(timeout1);
    }, 2500);
    this.setUpTweens();
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
    else if (sequenceChoice > .5 && sequenceChoice <.75){
      xEnd = 325;
    }
    else{
      xEnd = 375;
    }

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
      tweenIdle: // when landed
      {
        tweenType: "sine-wave",
        startXY: [xEnd, 120],
        xTo: [xEnd],
        yTo: [120],
        duration: 0,
        loop: false,
      },
      tween2: // tween offscreen
      {
        tweenType: "sine-wave",
        startXY: [xEnd, 120],
        xTo: [-150],
        yTo: [0, 100, 0],
        duration: 2000,
        loop: false,
      }
    });
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.state.tweenIdle,
      bugSpriteAnimationKey: 'idle',
    });

    timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust();
      clearTimeout(timeout2);
    }, 2000);
  }

  // switch to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.state.tween2, 
      bugSpriteAnimationKey: 'fly',  
    });
  }

  frogTap = (frog) => {
    if(this.state.showBug){
      if(this.state.bugSpriteAnimationKey === 'idle'){ // bug has landed
        this.frogCelebrate();
      }
      else if(this.state.tweenSettings != this.state.tween2){ // bug has not landed yet
        this.frogDisgust();
        this.setState({zappedTooEarly: true}); // now bug doesn't land, just keeps flying offscreen
      }
    }
  }

  frogCelebrate() {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'celebrate'});

    this.setState({showBug: false});
    clearTimeout(timeout2); // so that "bugFlyAway" function doesn't run after bug is "caught"
  }

  frogDisgust() {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'disgust'});
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.push({
      id: 7,
    });
    clearTimeout(timeout0);
    clearTimeout(timeout1);
    // clearTimeout(timeout2);
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
                loopAnimation={true}/>
            : null}

            <AnimatedSprite
              key={this.state.frogKey}
              spriteKey={1}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              character={frogCharacter}
              onPress={(frog) => {this.frogTap(frog)}}
              spriteAnimationKey={this.state.frogSpriteAnimationKey} 
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

export default BugZap1;