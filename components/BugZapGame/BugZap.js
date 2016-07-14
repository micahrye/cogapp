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
const TWEEN_1 = {
  tweenType: "sine-wave",
  startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
  xTo: [475, 500, 400],
  yTo: [0, 120],
  duration: 1500,
  loop: false,
}
const TWEEN_IDLE = {
  tweenType: "sine-wave",
  startXY: [400, 120],
  xTo: [400],
  yTo: [120],
  duration: 0,
  loop: false,
}
const TWEEN_2 = {
  tweenType: "sine-wave",
  startXY: [400, 120],
  xTo: [-150],
  yTo: [0, 120],
  duration: 2000,
  loop: false,
}

class BugZap extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      currBugCharacter: bugCharacterFly,
      currFrogCharacter: frogCharacterIdle,
      currTweenSettings: TWEEN_1,
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
    }, 2000);
  }

  // switch to idle bug character and pause tweening
  bugIdle() {
    this.setState({
      key: Math.random(),
      currBugCharacter: bugCharacterIdle,
      currTweenSettings: TWEEN_IDLE,
    });
    this.setState({bugKey: this.state.key});

    timeout2 = setTimeout(()=>{
      this.bugFlyAway();
      clearTimeout(timeout2);
    }, 1000);
  }

  // switch back to flying bug character and start next tween
  bugFlyAway() {
    this.setState({
      bugKey: Math.random(),
      currBugCharacter: bugCharacterFly,
      currTweenSettings: TWEEN_2,   
    });   
  }

  frogTap = () => {
    if(this.state.currBugCharacter === bugCharacterIdle){
      this.frogCelebrate();
    }
    else{
      this.frogDisgust();
    }
  }

  // load frog celebrate character, then stop celebrating
  frogCelebrate() {
    this.setState({frogKey: Math.random(), currFrogCharacter: frogCharacterCelebrate});
   
    setTimeout( () => {
      this.setState({frogKey: Math.random(), currFrogCharacter: frogCharacterIdle});
    }, 1400); // wait until celebrate animation is over (14 frames of animation at 100fps)

    this.setState({showBug: false});
  }

  // load frog disgust character, then go back to idle
  frogDisgust() {
    this.setState({frogKey: Math.random(), currFrogCharacter: frogCharacterDisgust});

    setTimeout( () => {
      this.setState({frogKey: Math.random(), currFrogCharacter: frogCharacterIdle});
    }, 500); // this should be 300, but that's too fast...why?
  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.push({
      id: 7,
    });
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
                character={this.state.currBugCharacter}
                tween={this.state.currTweenSettings}
                tweenStart="auto"/> 
            : null}

            

            <AnimatedSprite
              key={this.state.frogKey}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={this.state.currFrogCharacter}
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

// // array holding fly sprites
        // let flies = [];
        // // declare 5 fly variables, store them in flies
        // for(let i = 0; i < 5; i++){
        //   const tweens = {...tweenSettings};
        //   tweens.yTo = [i*10, 20*i, 40+(i*5), 100+(4*i), 10];
        //   flies.push(
        //     <AnimatedSprite
        //       key={i}
        //       coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
        //       size={{width: 128, height: 128}}
        //       draggable={false}
        //       character={bugCharacterFly}
        //       tween={tweens}
        //       tweenStart="auto"/>
        //   );

export default BugZap;
