import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import frogCharacterFlipped from "../sprites/frog/frogCharacterFlipped";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameThree extends React.Component {
    


    render(){
        const tweenSettings = {
            tweenType: "hop-forward",
                startXY: [-20, 0],
                endXY:[400],
                yTo: [-100],
                duration: 1000,
                loop: true,
        }
        return(
            <View style={styles.container}>
                <AnimatedSprite coordinates={{top: 0, left: -20}}
                size={{width: 256, height: 256}}
                draggable={false}
                character={frogCharacterFlipped} 
                tween={tweenSettings}
                tweenStart="auto"/>

                <View style={styles.tile}></View>
            </View>
        );
       
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    tile: {
        height: 100,
        width: 200,
        borderWidth: 2,
        top: (SCREEN_HEIGHT/2) - 50,
    }
});

export default GameThree;
