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
import AnimatedSprite from "../animatedSprite";
import Background from '../../backgrounds/Game_1_Background_1280.png';


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {
    componentDidMount() { }

    // go to next level
    buttonPress = () => {
        this.props.navigator.push({
            id: 7,
        });
    }

    render(){
        // automatic sine wave from right to left across screen
        const tweenSettings = {
                tweenType: "sine-wave",
                startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
                xTo: [-120],
                yTo: [0, 120, 40, 100, 10],
                duration: 5000,
                loop: true,
        };

        let flies = [];
        for(let i = 0; i < 5; i++){
          const tweens = {...tweenSettings};
          tweens.yTo = [i*10, 20*i, 40+(i*5), 100+(4*i), 10];
          flies.push(
            <AnimatedSprite
              key={i}
              coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
              size={{width: 128, height: 128}}
              draggable={false}
              character={bugCharacter}
              tween={tweens}
              tweenStart="auto"/>
          );
        }

        return (
            <View style={styles.container}>
                <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
                  <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                      <Text>Go to Level 1</Text>
                    </TouchableOpacity>

                    <AnimatedSprite
                      coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                      size={{width: 128, height: 128}}
                      draggable={false}
                      character={bugCharacter}
                      tween={tweenSettings}
                      tweenStart="auto"/>

                    {flies}

                    <AnimatedSprite
                      coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                      size={{width: 256, height: 256}}
                      draggable={false}
                      character={frogCharacter} />
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
