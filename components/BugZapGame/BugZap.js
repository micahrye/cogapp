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
import bugCharacterIdle from '../../sprites/bug/bugCharacterIdle';
import bugCharacterFly from "../../sprites/bug/bugCharacterFly"
import Background from '../../backgrounds/Game_1_Background_1280.png';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      renderBug: false,
      nextAnim: false,
    }
  }

  componentWillMount() {
    setTimeout( () => {
      this.setState({renderBug: true})
    }, 750);
  }

  componentDidMount() { 

  }

  // go to next level
  buttonPress = () => {
    this.props.navigator.push({
      id: 7,
    });
  }

  frogTap() {
    console.warn("in frog tap");
  }

  getTweenSettings() {
    console.warn(this.state.nextAnim);
    timeout = setTimeout(()=>{
      this.setState({nextAnim: true});
      clearTimeout(timeout);
    }, 2000);

    if(this.state.nextAnim){
      console.warn("here");
      return(
        {
          tweenType: "sine-wave",
          startXY: [500, 120],
          xTo: [0],
          yTo: [0, 120],
          duration: 3000,
          loop: false,
        }
      );
    }
    else{
      return(
        {
          tweenType: "sine-wave",
          startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
          xTo: [475, 500, 400],
          yTo: [0, 120],
          duration: 1500,
          loop: false,
        }
      );
    }
  }

  render(){
    console.warn("in render");
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>Go to Level 1</Text>
            </TouchableOpacity>

            {this.state.renderBug ? 
              <AnimatedSprite
                coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                size={{width: 128, height: 128}}
                draggable={false}
                character={bugCharacterFly}
                tween={this.getTweenSettings()}
                tweenStart="auto"/> 
            : null}

            

            <AnimatedSprite
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 256, height: 256}}
              draggable={false}
              character={frogCharacter}
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
