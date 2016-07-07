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
import frogCharacterFlipped from '../sprites/frog/frogCharacterFlipped';
import bugCharacter from '../sprites/bug/bugCharacter';
import AnimatedSprite from "./animatedSprite";
import Background from '../backgrounds/Game_1_Background_1280.png';


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap3 extends React.Component {
    componentDidMount() { }
    render(){
        const tweenSettings = {
                tweenType: "sine-wave",
                startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
                xTo: [-120],
                yTo: [0, 120, 40, 100, 10],
                duration: 5000,
                loop: true,
        };
        return (
            <View style={styles.container}>
                <Image source={require('../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                            size={{width: 128, height: 128}}
                            draggable={false}
                            character={bugCharacter}
                            tween={tweenSettings}
                            tweenStart="auto"/>
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                            size={{width: 256, height: 256}}
                            draggable={false}
                            character={frogCharacter} />
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 730}}
                            size={{width: 256, height: 256}}
                            draggable={false}
                            character={frogCharacterFlipped} />
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

export default BugZap3;
