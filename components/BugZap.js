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

import frogCharacter from "../sprites/frog/frogCharacter";
import AnimatedSprite from "./animatedSprite";
import Background from '../backgrounds/Game_1_Background_1280.png';

let Orientation = require('react-native-orientation');

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {
    componentDidMount() {
        Orientation.lockToLandscape();
    }

    buttonPress = () => {
        this.props.navigator.push({
            id: 7,
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <Image source={require('../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
                        <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                            <Text>Go to Level 2</Text>        
                        </TouchableOpacity>
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
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

export default BugZap;
