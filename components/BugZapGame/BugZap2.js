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
import Background from '../../backgrounds/Game_1_Background_1280.png';

import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap2 extends React.Component {

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
    this.bugSide = undefined;
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.flyInDuration = undefined;
  }

  componentDidMount() {

    this.flyInDuration = Math.random() *  (4000 - 1500) + 1500;
    this.setUpTweens();

    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});

      this.timeoutBugIdle = setTimeout(()=>{
        if(!this.state.zappedTooEarly){ // after first tween is completed, bug idles
          this.bugIdle();
        }
        else{
          this.bugFlyAway('default'); // if bug is zapped too early, it just flies away, no idling
        }
      }, this.flyInDuration);
    }, 500);

    
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
  }

  // bug either appears on left or right
  setUpTweens() {
    let sideChoice = Math.random();
    let sequenceChoice = Math.random(); // to help choose two ways bug can approach both the right and left landing spots
    let flySequenceX = [];
    let flySequenceY = [0, yLand, 0, yLand];
    let yLand = 70;
    let xLand = undefined;

    if(sideChoice < .5){ // bug lands on left side
      this.bugSide = 'left';
      xLand = 200;
      flySequenceX = [300, 350, xLand];
      if(sequenceChoice < .5){
        flySequenceY = [200, 50, 100, 50, yLand];
      }
    }
    else{ // bug lands on right side
      this.bugSide = 'right'
      xLand = 350;
      flySequenceX = [450, 500, xLand];
      if(sequenceChoice < .5){
        flySequenceY = [200, 100, 50, yLand];
      }
    }
    

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [xLand],
      yTo: [yLand],
      duration: 0,
      loop: false,
    };

    // tween offscreen  
    this.tweenAway = { 
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [-150],
      yTo: [0, yLand, 0],
      duration: 2000,
      loop: false,
    };

    this.setState({
      tweenSettings: // initial tween onto screen
      {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
        xTo: flySequenceX,
        yTo: flySequenceY,
        duration: this.flyInDuration,
        loop: false,
      },
    });
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'idle',
      tweenSettings: this.tweenIdle,
    });

    this.timeoutFlyAway = setTimeout(()=>{
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

  frogTap = (frog) => {
    if(this.state.showBug){ // if bug is idling and not already eaten
      if(this.state.bugSpriteAnimationKey === 'idle'){  
        if(this.bugSide === 'right'){ 
          if(frog === 0){ // right side frog tapped
            this.correctFrogTapped(frog);
          }
          else{ // left frog tapped
            this.wrongFrogTapped(frog);
          }
        }
        else if(this.bugSide === 'left'){ 
          if(frog === 0){
            this.wrongFrogTapped(frog);
          }
          else{
            this.correctFrogTapped(frog);
          }
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
      loop: false, // so splat animation is not repeated
    });
    this.frogCelebrate(frog);
    clearTimeout(this.timeoutFlyAway); // so frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped(frog){
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
  }

  // once bug has splatted
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
      id: 'BugZap3',
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Go to Level 3</Text>
            </TouchableOpacity>

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

export default BugZap2;
