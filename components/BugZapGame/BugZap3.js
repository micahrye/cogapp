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

//import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import lightbulbCharacter from '../../sprites/lightbulb/lightbulbCharacter';
import Background from '../../backgrounds/Game_1_Background_1280.png';

import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap3 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      blackoutScreen: [],
      spotLightFlash: [],
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      tweenSettings: {},
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      showBug: false,
      loop: true,
    }
    this.bugSide = undefined;
    this.tweenAway = {};
    this.timeoutBlackout = undefined;
    this.timeoutSpotlight = undefined;
    this.timeoutRemoveSpotlight = undefined;
    this.timeoutRemoveBlackout = undefined;
    this.timeoutFlyAway = undefined;
    this.bulbTweenSettings = {
      tweenType: "bounce-drop",
      startY: -128,
      endY: 0,
      duration: 2000,
      loop: false,
    };
  }

  componentDidMount() {
    this.timeoutBlackout = setTimeout ( () => {
      this.setBlackout();
    }, 2500);
    this.setUpTweens();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutBlackout);
    clearTimeout(this.timeoutSpotlight);
    clearTimeout(this.timeoutRemoveSpotlight);
    clearTimeout(this.timeoutRemoveBlackout);
    clearTimeout(this.timeoutFlyAway);
  }

  // bug either appears on the left or the right
  setUpTweens() {
    let sideChoice = Math.random();
    let xStart = undefined;
    if(sideChoice < .5){
      this.bugSide = 'left';
      xStart = 150;
    }
    else{
      this.bugSide = 'right';
      xStart = SCREEN_WIDTH - 300;
    }

    // tween offscreen
    this.tweenAway = {
      tweenType: "sine-wave",
      startXY: [xStart, 120],
      xTo: [-150],
      yTo: [0, 120, 0],
      duration: 2000,
      loop: false,
    };

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
    });
  }

  // screen goes black
  setBlackout() {
    let blackout = [];
    blackout.push(<View key={0} style={styles.blackout}></View>);
    this.setState({blackoutScreen: blackout});
    this.timeoutSpotlight = setTimeout ( () => {
      this.flashSpotLight();
    }, 1000);
  }

  // spotlight is flashed briefly after blackout
  flashSpotLight() {
    let spotLight = [];
    let timeToRemoveBlackout = Math.random() * 2000; // average is 1 second
    spotLight.push(<View key={0} style={this.getSpotLightStyle()}></View>);
    this.setState({spotLightFlash: spotLight});
    this.timeoutRemoveSpotlight = setTimeout ( () => {
      this.setState({spotLightFlash: []});
      this.timeoutRemoveBlackout = setTimeout ( () => { // spotlight dissapears just before blackout does
        this.removeBlackout();
      }, timeToRemoveBlackout);
    }, 500);
  }

  // screen goes back to normal and bug appears
  removeBlackout() {
    let bug = [];
    this.setState({
      blackoutScreen: [],
      showBug: true,
      bugSpriteAnimationKey: 'idle',
    });
    this.timeoutFlyAway = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust(0);
      this.frogDisgust(1);
    }, 2000);
  }

  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'startFly',
      loop: false,
      tweenSettings: this.tweenAway,
    });
  }

  // once bug has splatted
  onAnimationFinish(animationKey) {
    if(animationKey === "splat"){
      this.setState({showBug: false});
    }
  }

  frogTap = (frog) => {
    if(this.state.bugSpriteAnimationKey === 'idle' && this.state.showBug){
      if(this.bugSide === 'right'){ // celebrate if correct side and bug isn't already eaten
        if(frog === 0){
          this.correctFrogTapped(frog);
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
          this.correctFrogTapped(frog);
        }
      }
    }
  }

  // bug splats and is hidden, frog celebrates
  correctFrogTapped(frog) {
    this.setState({
      bugKey: Math.random(), 
      bugSpriteAnimationKey: 'splat',
      loop: false,
    });
    this.frogCelebrate(frog);
    clearTimeout(this.timeoutFlyAway); // so that frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped(frog){
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
  }

  // frog celebrates and bug is hidden
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

  getSpotLightStyle() {
    let side = Math.random();
    let posX = 0;
    if(side < .5){
      posX = 150;
    }
    else{
      posX = SCREEN_WIDTH - 300
    }
    return(
      {
        flex: 1,
        backgroundColor: 'white',
        height: 150,
        width: 150,
        left: posX,
        top: 100,
        position: 'absolute',
        borderRadius: 100,
      }
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
            <Text>Go to Game 2</Text>
          </TouchableOpacity>

          <AnimatedSprite coordinates={{top: -128, left: SCREEN_WIDTH/2 -50}}
            size={{width: 128, height: 128}}
            draggable={false}
            character={lightbulbCharacter}
            tween={this.bulbTweenSettings}
            tweenStart="auto"/>
      
          {this.state.showBug ? 
            <AnimatedSprite
              key={this.state.bugKey}
              coordinates={{top: 0, left: 0}}
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
            coordinates={{top: SCREEN_HEIGHT - 275, left: -50}}
            size={{width: 256, height: 256}}
            rotate={[{rotateY: '180deg'}]}
            draggable={false}
            character={frogCharacter}
            spriteAnimationKey={this.state.frogSpriteAnimationKey} 
            onPress={(frog) => {this.frogTap(frog)}} 
            hitSlop={{top: -175, left: -65, bottom: -10, right: -55}}/>          

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
    left: 450,
    top: 100,
    position: 'absolute',
    borderRadius: 100,
  },
});

export default BugZap3;
