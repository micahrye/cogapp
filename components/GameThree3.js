import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import frogCharacterFlipped from "../sprites/frog/frogCharacterFlipped";
import monkeyCharacter from "../sprites/monkey/monkeyCharacter";
import platformCharacter from "../sprites/platform/platformCharacter";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameThree3 extends React.Component {

  buttonPress = () => {
      this.props.navigator.push({
          id: 18,
      });
  }



    render(){
        const tweenSettings = {
            tweenType: "hop-forward",
                startXY: [10, 150],
                endXY:[450],
                yTo: [-100],
                duration: 3000,
                loop: false,
        }
        return(
          <View style={styles.container}>
            <Image source={require('../backgrounds/Game_3_Background_1280.png')} style={styles.backgroundImage}>
              <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                  <Text>Go to Level 5</Text>
              </TouchableOpacity>
              <AnimatedSprite coordinates={{top: 150, left: 10}}
                  size={{width: 100, height: 120}}
                  draggable={false}
                  character={monkeyCharacter}
                  tween={tweenSettings}
                  tweenStart="auto"/>
              <AnimatedSprite coordinates={{top: 200, left: 250}}
                      size={{width: 220, height: 50}}
                      draggable={false}
                      character={platformCharacter}/>
            </Image>
          </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    tile: {
        height: 100,
        width: 200,
        borderWidth: 2,
        top: (SCREEN_HEIGHT/2) - 50,
        transform: [{rotateX: '10deg'}],
    },
    button: {
        backgroundColor: '#4d94ff',
        borderRadius: 10,
        width: 90,
        height: 30,
    },
});

export default GameThree3
