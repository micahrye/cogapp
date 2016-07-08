import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameFour extends React.Component {
    componentDidMount() { }


    render(){
        return(
            <Text>hi</Text>
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
    button: {
        backgroundColor: '#4d94ff',
        borderRadius: 10,
        width: 90,
        height: 30,

    },
});

export default GameFour;
