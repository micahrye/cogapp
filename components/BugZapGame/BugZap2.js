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

import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import lightbulbCharacter from '../../sprites/lightbulb/lightbulbCharacter';
import AnimatedSprite from "../animatedSprite";
import Background from '../../backgrounds/Game_1_Background_1280.png';


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap2 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      blackoutScreen: [],
      spotLightFlash: [],
      bugSpriteAnimationKey: 'idle',
      frogSpriteAnimationKey: 'idle',
      tweenSettings: {},
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      showBug: false,
      side: "right",
    }
  }

  componentDidMount() {
    timeout0 = setTimeout ( () => {
      this.setBlackout();
      clearTimeout(timeout0);
    }, 3500);
    this.setUpTween();
  }

  // bug either appears on the left or the right
  setUpTween() {
    let sideChoice = Math.random();
    let xStart = 0;
    if(sideChoice < .5){
      this.setState({side: "left"});
      xStart = 150;
    }
    else{
      xStart = 375;
    }

    this.setState({
      tweenSettings: // idle tween
      {
        tweenType: "sine-wave",
        startXY: [xStart, 120],
        xTo: [xStart],
        yTo: [120],
        duration: 2000,
        loop: false,
      },
      tweenAway: // tween offscreen
      {
        tweenType: "sine-wave",
        startXY: [xStart, 120],
        xTo: [-150],
        yTo: [0, 100, 0],
        duration: 2000,
        loop: false,
      }
    });
  }

  // screen goes black
  setBlackout() {
    let blackout = [];
    blackout.push(<View key={0} style={styles.blackout}></View>);
    this.setState({blackoutScreen: blackout});
    timeout1 = setTimeout ( () => {
      this.flashSpotLight();
      clearTimeout(timeout1);
    }, 1000);
  }

  // spotlight is flashed briefly after blackout
  flashSpotLight() {
    let spotLight = [];
    spotLight.push(<View key={0} style={styles.spotLight}></View>);
    this.setState({spotLightFlash: spotLight});
    timeout2 = setTimeout ( () => {
      this.setState({spotLightFlash: []});
      timeout3 = setTimeout ( () => { // spotlight dissapears just before blackout does
        this.removeBlackout();
        clearTimeout(timeout3);
      }, 200);
      clearTimeout(timeout2);
    }, 500);
  }

  // screen goes back to normal and bug appears
  removeBlackout() {
    let bug = [];
    this.setState({blackoutScreen: []});
    this.setState({showBug: true});
    timeout4 = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust(0);
      this.frogDisgust(1);
      clearTimeout(timeout4);
    }, 2000);
  }

  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'fly',
      tweenSettings: this.state.tweenAway,
    });
  }

  frogTap = (frog) => {
    let bugSide = this.state.side;
    if(this.state.bugSpriteAnimationKey === 'idle' && this.state.showBug){
      if(bugSide === 'right'){ // celebrate if correct side and bug isn't already eaten
        if(frog === 0){
          this.frogCelebrate(frog);
        }
        else{
          this.wrongFrogTapped(frog);
        }
      }
      else { // bug landed on left side
        if(frog === 0){
          this.wrongFrogTapped(frog);
        }
        else{
          this.frogCelebrate(frog)
        }
      }
    }
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped(frog){
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(timeout4); // so bugFlyAway isn't called again
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
    clearTimeout(timeout4); // so that "bugFlyAway" function doesn't run after bug is "caught"
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
      id: 9,
    });
  }

  render(){
    console.log(this.state.tweenSettings);
    const bulbTweenSettings = {
      tweenType: "bounce-drop",
      startXY: [SCREEN_WIDTH-400, -128],
      endXY: [SCREEN_WIDTH-400, 0],
      duration: 3000,
      loop: false,
    };
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
            <Text>Go to Level 3</Text>
          </TouchableOpacity>

          <AnimatedSprite coordinates={{top: -128, left: SCREEN_WIDTH - 400}}
            size={{width: 128, height: 128}}
            draggable={false}
            character={lightbulbCharacter}
            tween={bulbTweenSettings}
            tweenStart="auto"/>
      
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
            spriteAnimationKey={this.state.frogSpriteAnimationKey} 
            onPress={(frog) => {this.frogTap(frog)}}/>

          <View style={styles.flip}>
              <AnimatedSprite 
                key={this.state.frogKey1}
                spriteKey={1}
                coordinates={{top: 0, left: 0}}
                size={{width: 256, height: 256}}
                draggable={false}
                character={frogCharacter}
                spriteAnimationKey={this.state.frogSpriteAnimationKey} 
                onPress={(frog) => {this.frogTap(frog)}} />
          </View>

          <View>
            {this.state.blackoutScreen}
          </View>
          <View>
            {this.state.spotLightFlash}
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
    position: 'absolute',
  },
  blackout: {
    flex: 1,
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  spotLight: {
    flex: 1,
    backgroundColor: 'white',
    height: 150,
    width: 150,
    left: 400,
    top: 100,
    position: 'absolute',
    borderRadius: 100,
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

export default BugZap2;
