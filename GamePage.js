import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    AsyncStorage,
    Navigator,
    Image,
} from 'react-native';


import Bubble from './Bubble';
import GameWinPage from './GameWinPage';
import AnimatedSprite from './components/animatedSprite';
import NextGamePage from './NextGamePage';
import Tweener from './components/Tweener'
import greenDragonCharacter from "./sprites/dragon/greenDragonCharacter";

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let NUM_BUBBLES = 15;
let bubbles = []; // maybe another way to do this instead of it being a global variable?

class GamePage extends React.Component {
    constructor(props){
        super(props);
        
        this.createBubbles(NUM_BUBBLES);
    }

    componentDidMount(){

    }

    // populate array of bubbles
    createBubbles(numBubbles) {
        bubbles = [];
        for(let i=0; i < numBubbles; i++){
            if(i%2 == 0){
                bubbles.push(
                    
                );
            }
            else{
                bubbles.push(
                    
                );
            }
        }

    }


    render(){
        return (
             <View style={styles.topLevel}>
                <View style={styles.sceneLevel}>
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 20, marginTop: 10}}>Bubble Pop Game</Text>
                        <Text style={{fontSize: 15}}>Pop all the bubbles and win the game!</Text>
                    </View>
                    <View style={styles.gameWorld}>
                        {bubbles}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topLevel :{
        alignItems: 'center',
    },
    sceneLevel :{
        height: SCREEN_HEIGHT - 70,
        width: SCREEN_WIDTH - 30,
        borderStyle: 'solid',
        borderWidth: 2,
        alignItems: 'center',
        flex: 1,
    },
    gameWorld: {
        width: SCREEN_WIDTH - 30,
        borderStyle: 'solid',
        borderWidth: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: .87,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        opacity: .1,
    },
    topBar: {
        alignItems: 'center',
        width: SCREEN_WIDTH - 30,
        height: 80,
        borderStyle: 'solid',
        borderWidth: 2,
        flex: .13,
    },
});

export default GamePage;
