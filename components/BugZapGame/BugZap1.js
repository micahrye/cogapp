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
import frogCharacterIdle from "../../sprites/frog/frogCharacter";
import frogCharacterCelebrate from "../../sprites/frog/frogCharacterCelebrate";
import frogCharacterDisgust from "../../sprites/frog/frogCharacterDisgust";
import bugCharacterIdle from '../../sprites/bug/bugCharacterIdle';
import bugCharacterFly from "../../sprites/bug/bugCharacterFly"
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
      frogKey1: 0,
      bugCharacter: bugCharacterFly,
      frogCharacter: frogCharacterIdle,
      tweenSettings: {},
      tweenIdle: {},
      tween2: {},
      zappedTooEarly: false,
      wrongTap: false,
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
        bugCharacter: bugCharacterIdle,
        tweenSettings: this.state.tweenIdle,
      });
    }
    else{
      this.setState({
        bugKey: Math.random(),
        bugCharacter: bubbleCharacter,
        tweenSettings: this.state.tweenIdle,
      });
    }

    timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      if(!this.state.wrongTap){ // both are disgusted if no taps attempted during idle
        this.frogDisgust(0);  
        this.frogDisgust(1);
      }
      clearTimeout(timeout2);
    }, 2000);
  }

  // switch to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      bugCharacter: bugCharacterFly,
      tweenSettings: this.state.tween2,   
    }); 
  }

  frog1Tap = () => {
    bugColor = this.state.bugCharacter;
    if(bugColor === bugCharacterIdle && this.state.showBug){ // celebrate if right "color" and bug isn't hidden
      this.frogCelebrate(0);
    }
    else if(bugColor === bubbleCharacter && this.state.showBug){
      this.frogDisgust(0);
      this.setState({wrongTap: true});
    }
    else if(this.state.tweenSettings != this.state.tween2 && this.state.showBug){
      this.frogDisgust(0);
      this.setState({zappedTooEarly: true});
    }
    else if(this.state.tweenSettings === this.state.tween2){ // did not zap in time
      this.frogDisgust(0);
    } // TODO can take this out or leave it, docs were not specific about whether frog should be disgusted when clicked as bug is flying away
  }

  frog2Tap = () => {
    bugColor = this.state.bugCharacter;
    if(bugColor === bubbleCharacter && this.state.showBug){ // celebrate if right "color" and bug isn't hidden
      this.frogCelebrate(1);
    }
    else if(bugColor === bugCharacterIdle && this.state.showBug){
      this.frogDisgust(1);
      this.setState({wrongTap: true});
    }
    else if(this.state.tweenSettings != this.state.tween2 && this.state.showBug){
      this.frogDisgust(1);
      this.setState({zappedTooEarly: true});
    }
    else if(this.state.tweenSettings === this.state.tween2){ // did not zap in time
      this.frogDisgust(1);
    } // TODO can take this out or leave it, docs were not specific about whether frog should be disgusted when clicked as bug is flying away
  }

  // load frog celebrate character, then stop celebrating
  frogCelebrate(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random(), frogCharacter: frogCharacterCelebrate});
     
      setTimeout( () => {
        this.setState({frogKey0: Math.random(), frogCharacter: frogCharacterIdle});
      }, 1400); // wait until celebrate animation is over (14 frames of animation at 100fps)
    }
    else{
      this.setState({frogKey1: Math.random(), frogCharacter: frogCharacterCelebrate});
     
      setTimeout( () => {
        this.setState({frogKey1: Math.random(), frogCharacter: frogCharacterIdle});
      }, 1400); // wait until celebrate animation is over (14 frames of animation at 100fps)
    }

    this.setState({showBug: false});
    clearTimeout(timeout2); // so that "bugFlyAway" function doesn't run after bug is "caught"
  }

  // load frog disgust character, then go back to idle
  frogDisgust(frog) {
    if(frog === 0){
      this.setState({frogKey0: Math.random(), frogCharacter: frogCharacterDisgust});

      setTimeout( () => {
        this.setState({frogKey0: Math.random(), frogCharacter: frogCharacterIdle});
      }, 300); 
    }
    else{
      this.setState({frogKey1: Math.random(), frogCharacter: frogCharacterDisgust});

      setTimeout( () => {
        this.setState({frogKey1: Math.random(), frogCharacter: frogCharacterIdle});
      }, 300); // TODO this should be 300, but that makes it too fast...why?
    }
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.push({
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
                character={this.state.bugCharacter}
                tween={this.state.tweenSettings}
                tweenStart="auto"/> 
            : null}

            <AnimatedSprite
              key={this.state.frogKey0}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={this.state.frogCharacter}
              timeSinceMounted={this.frog1Tap} />

            <View style={styles.flip}>
                <AnimatedSprite 
                  key={this.state.frogKey1}
                  coordinates={{top: 0, left: 0}}
                  size={{width: 256, height: 256}}
                  draggable={false}
                  character={this.state.frogCharacter}
                  timeSinceMounted={this.frog2Tap} 
                  />
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