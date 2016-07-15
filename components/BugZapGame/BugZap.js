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
      bugCharacter: bugCharacterFly,
      frogCharacter: frogCharacterIdle,
      tweenSettings: {},
      tweenIdle: {},
      tween2: {},
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
    // after first tween is completed, bug idles
    timeout1 = setTimeout(()=>{
      this.bugIdle();
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
    this.setState({
      bugKey: Math.random(),
      bugCharacter: bugCharacterIdle,
      tweenSettings: this.state.tweenIdle,
    });

    timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      clearTimeout(timeout2);
    }, 2000);
  }

  // switch back to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      bugCharacter: bugCharacterFly,
      tweenSettings: this.state.tween2,   
    });   
  }

  frogTap = () => {
    if(this.state.bugCharacter === bugCharacterIdle){
      this.frogCelebrate();
    }
    else{
      this.frogDisgust();
    }
  }

  // load frog celebrate character, then stop celebrating
  frogCelebrate() {
    this.setState({frogKey: Math.random(), frogCharacter: frogCharacterCelebrate});
   
    setTimeout( () => {
      this.setState({frogKey: Math.random(), frogCharacter: frogCharacterIdle});
    }, 1400); // wait until celebrate animation is over (14 frames of animation at 100fps)

    this.setState({showBug: false});
  }

  // load frog disgust character, then go back to idle
  frogDisgust() {
    this.setState({frogKey: Math.random(), frogCharacter: frogCharacterDisgust});

    setTimeout( () => {
      this.setState({frogKey: Math.random(), frogCharacter: frogCharacterIdle});
    }, 600); // this should be 300, but that makes it too fast...why?
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
                coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                size={{width: 128, height: 128}}
                draggable={false}
                character={this.state.bugCharacter}
                tween={this.state.tweenSettings}
                tweenStart="auto"/> 
            : null}

            <AnimatedSprite
              key={this.state.frogKey}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={this.state.frogCharacter}
              timeSinceMounted={this.frogTap} 
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
