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
      zappedTooEarly: false,
      frogSpriteAnimationKey: 'default',
      bugSpriteAnimationKey: 'default',
      loop: true,
    }
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeout0 = undefined;
    this.timeout1 = undefined;
    this.timeout2 = undefined;
  }

  componentDidMount() {
    // render bug after the rest of the scene
    this.timeout0 = setTimeout( () => {
      this.setState({showBug: true});
    }, 500);

    this.timeout1 = setTimeout(()=>{
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
    clearTimeout(this.timeout0);
    clearTimeout(this.timeout1);
    if(this.timeout2 !== undefined){
      clearTimeout(this.timeout2);
    }
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
    if(bugColorChoice < .5){
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'idle',
        tweenSettings: this.tweenIdle,
      });
    }
    else{
      this.setState({
        bugKey: Math.random(),
        bugSpriteAnimationKey: 'bubble',
        tweenSettings: this.tweenIdle,
      });
    }

    this.timeout2 = setTimeout(()=>{
      this.bugFlyAway('startFly');
      this.frogDisgust(0);
      this.frogDisgust(1);
    }, 2000);
  }

  // switch to flying bug character and start next tween
  bugFlyAway(animation) {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: animation,
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
    let bugColor = this.state.bugSpriteAnimationKey;
    if(this.state.showBug){ // if bug isn't already eaten
      if(bugColor === 'idle'){ 
        if(frog === 0){ // celebrate if right "color"
          this.correctFrogTapped(frog);
        }
        else{ // wrong frog tapped for that "color"
          this.wrongFrogTapped(frog);
        }
      }
      else if(bugColor === 'bubble'){ 
        if(frog === 0){
          this.wrongFrogTapped(frog);
        }
        else{
          this.correctFrogTapped(frog);
        }
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
      loop: false,
    });
    this.frogCelebrate(frog);
    clearTimeout(this.timeout2); // so frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped(frog){
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(this.timeout2); // so bugFlyAway isn't called again
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
      id: 8,
    });
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
              onPress={(frog) => {this.frogTap(frog)}}/>

            <AnimatedSprite 
              key={this.state.frogKey1}
              spriteKey={1}
              coordinates={{top: SCREEN_HEIGHT - 275, left: - 50}}
              size={{width: 256, height: 256}}
              rotate={[{rotateY: '180deg'}]}
              draggable={false}
              character={frogCharacter}
              spriteAnimationKey={this.state.frogSpriteAnimationKey} 
              onPress={(frog) => {this.frogTap(frog)}} />
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
