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


import GameWinPage from './GameWinPage';
import AnimatedSprite from './animatedSprite';
import NextGamePage from './NextGamePage';
import bubbleCharacter from '../sprites/bubble/bubbleCharacter';

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let NUM_BUBBLES = 10;
let BUBBLE_SIZE = 60;
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
            let startX = i*((SCREEN_WIDTH-110)/NUM_BUBBLES) + 2;
            let startY = SCREEN_HEIGHT - 153 - BUBBLE_SIZE;

            const tweenOpts01 = {
              tweenType: "sine-wave",
              startXY: [startX, startY],
              xTo: [startX + 40, startX, startX + 40, startX],
              yTo: [0],
              duration: 3000,
              repeatable: true,
            };

            if(i%2 == 0){
                bubbles.push(
                    <AnimatedSprite key={i} coordinates={{top:startY, left: startX}}
                    size={{width: BUBBLE_SIZE, height: BUBBLE_SIZE}}
                    draggable={false}
                    character={bubbleCharacter} 
                    touchTween={tweenOpts01} 
                    autoMove={true}/>
                );
            }
            else{
                bubbles.push(
                    <AnimatedSprite key={i} coordinates={{top:startY, left: startX}}
                    size={{width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20}}
                    draggable={false}
                    character={bubbleCharacter} 
                    touchTween={tweenOpts01} 
                    autoMove={true}/>
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
        height: SCREEN_HEIGHT - 153,
        borderStyle: 'solid',
        borderWidth: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        height: SCREEN_HEIGHT - 600,
        borderStyle: 'solid',
        borderWidth: 2,
    },
});

export default GamePage;
