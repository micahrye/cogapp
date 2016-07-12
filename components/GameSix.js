import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import frogCharacterIdle from "../sprites/frog/frogCharacter";
import frogCharacterCelebrate from "../sprites/frog/frogCharacterCelebrate"


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let fixedBoxes = [];

class GameSix extends React.Component {


    render(){
        return(
            <View style={styles.container}></View>
        );
       
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GameSix;
