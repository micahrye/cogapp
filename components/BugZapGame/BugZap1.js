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
import Background from '../../backgrounds/Game_1_Background_1280.png';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap1 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      tweenSettings: {},
      tweenIdle: {},
      tween2: {},
      zappedTooEarly: false,
      frogSpriteAnimationKey: 'idle',
      bugSpriteAnimationKey: 'fly'
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
    let xEnd = [];
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
    let bugColorChoice = Math.random();
    if(bugColorChoice < .5){
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'idle',
        tweenSettings: this.state.tweenIdle,
      });
    }
    else{
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'bubble',
        tweenSettings: this.state.tweenIdle,
      });
    }

    timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust(0);
      this.frogDisgust(1);
      clearTimeout(timeout2);
    }, 2000);
  }

  // switch to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
        bugSpriteAnimationKey: 'fly',
      tweenSettings: this.state.tween2,   
    }); 
  }

<<<<<<< Updated upstream
  frogTap = (frog) => {
    let bugColor = this.state.bugSpriteAnimationKey;
    if(this.state.showBug){ // if bug isn't already eaten
      if(bugColor === 'idle'){ 
        if(frog === 0){ // celebrate if right "color"
          this.frogCelebrate(frog);
        }
        else{ // wrong frog tapped for that "color"
          wrongFrogTapped(frog);
        }
      }
      else if(bugColor === 'bubble'){ 
        if(frog === 0){
          wrongFrogTapped(frog);
        }
        else{
          this.frogCelebrate(frog);
        }
=======
  frog1Tap = () => {
    let bugColor = this.state.bugSpriteAnimationKey;
    if(this.state.showBug){
      if(bugColor === 'idle'){ // celebrate if right "color" and bug isn't already eaten
        this.frogCelebrate(0);
      }
      else if(bugColor === 'bubble'){ // wrong choice
        this.bugFlyAway();
        this.frogDisgust(0);
        clearTimeout(timeout2); // so bugFlyAway isn't called again
>>>>>>> Stashed changes
      }
      else if(this.state.tweenSettings != this.state.tween2){ // zapped too early  
        this.frogDisgust(frog);
        this.setState({zappedTooEarly: true});
      }
    }
  }

<<<<<<< Updated upstream
  // frog is disgusted, bug flies away without idling
  wrongFrogTapped(frog){
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(timeout2); // so bugFlyAway isn't called again
=======
  frog2Tap = () => {
    let bugColor = this.state.bugSpriteAnimationKey;
    if(this.state.showBug){
      if(bugColor === 'bubble'){
        this.frogCelebrate(1);
      }
      else if(bugColor === 'idle'){
        this.bugFlyAway();
        this.frogDisgust(1);
        clearTimeout(timeout2);
      }
      else if(this.state.tweenSettings != this.state.tween2){
        this.frogDisgust(1);
        this.setState({zappedTooEarly: true});
      }
    }
>>>>>>> Stashed changes
  }

  // frog celebrates and bug is hidden
  frogCelebrate(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
    this.setState({showBug: false});
    clearTimeout(timeout2); // so that "bugFlyAway" function doesn't run after bug is "caught"
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
      id: 8,
    });
    clearTimeout(timeout0);
    clearTimeout(timeout1);
    //clearTimeout(timeout2);
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Go to Level 2</Text>
            </TouchableOpacity>

            {this.state.showBug ? 
              <AnimatedSprite
                key={this.state.bugKey}
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
              key={this.state.frogKey0}
              spriteKey={0}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={frogCharacter}
<<<<<<< Updated upstream
              spriteAnimationKey={this.state.frogSpriteAnimationKey} 
              onPress={(frog) => {this.frogTap(frog)}}/>
=======
              timeSinceMounted={this.frog1Tap}
              spriteAnimationKey={this.state.frogSpriteAnimationKey} />
>>>>>>> Stashed changes

            <View style={styles.flip}>
                <AnimatedSprite 
                  key={this.state.frogKey1}
                  spriteKey={1}
                  coordinates={{top: 0, left: 0}}
                  size={{width: 256, height: 256}}
                  draggable={false}
                  character={frogCharacter}
<<<<<<< Updated upstream
                  spriteAnimationKey={this.state.frogSpriteAnimationKey} 
                  onPress={(frog) => {this.frogTap(frog)}} />
=======
                  timeSinceMounted={this.frog2Tap}
                  spriteAnimationKey={this.state.frogSpriteAnimationKey} 
                  />
>>>>>>> Stashed changes
            </View>
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
  flip: {
    top: SCREEN_HEIGHT - 275,
    left: -50,
    width: 256,
    height: 256,
    transform: [{rotateY: '180deg'}],
    position: 'absolute',
  },
});

export default BugZap1;