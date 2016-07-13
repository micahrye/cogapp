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
import frogCharacterFlipped from '../../sprites/frog/frogCharacterFlipped';
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../animatedSprite";
import Background from '../../backgrounds/Game_1_Background_1280.png';


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;


class BugZap1 extends React.Component {
    componentDidMount() { }

    buttonPress = () => {
        this.props.navigator.push({
            id: 8,
        });
    }

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
                <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
                        <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                            <Text>Go to Level 2</Text>
                        </TouchableOpacity>
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                            size={{width: 128, height: 128}}
                            draggable={false}
                            character={bugCharacter}
                            tween={tweenSettings}
                            tweenStart="auto"
                            />
                        <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                            size={{width: 256, height: 256}}
                            draggable={false}
                            character={frogCharacter} 
                            />
                        <View style={styles.flip}>
                            <AnimatedSprite coordinates={{top: 0, left: 0}}
                                size={{width: 256, height: 256}}
                                draggable={false}
                                character={frogCharacter} 
                                />
                        </View>
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
        position: 'absolute',
    },
    flip: {
        top: SCREEN_HEIGHT - 275,
        left: -50,
        width: 256,
        height: 256,
        transform: [{rotateY: '180deg'}],
        position: 'absolute',
    },
});

export default BugZap1;
