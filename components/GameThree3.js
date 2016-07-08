import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import frogCharacter from "../sprites/frog/frogCharacter";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameThree3 extends React.Component {
    


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

export default GameThree3;