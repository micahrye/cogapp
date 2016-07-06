import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import frogCharacter from "../sprites/frog/frogCharacter";
import greenDragonCharacter from "../sprites/dragon/greenDragonCharacter";
import AnimatedSprite from "./animatedSprite";

let Orientation = require('react-native-orientation');

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {
    componentDidMount() {
       // Orientation.lockToLandscape();
    }
    render(){
        return (
            <View style={styles.container}>
                <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 200, left: SCREEN_WIDTH - 150}}
                    size={{width: 150, height: 150}}
                    draggable={false}
                    character={frogCharacter} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default BugZap;
