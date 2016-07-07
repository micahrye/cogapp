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


import BubblePopWinPage from './BubblePopWinPage';
import AnimatedSprite from './animatedSprite';
import NextGamePage from './NextGamePage';
import bubbleCharacterLarge from '../sprites/bubble/bubbleCharacterLarge';
import bubbleCharacterSmall from '../sprites/bubble/bubbleCharacterSmall';

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let NUM_BUBBLES = 15;
let BUBBLE_SIZE = 60;
let OFFSET = 40;

class BubblePop extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            score: 0,
            popTime: 0,
        }
        let bubbleCharacters = [];
        this.createBubbles(NUM_BUBBLES);
    }

    componentDidMount () {
        AsyncStorage.getItem('score').then((value) => {
            this.setUpScene(JSON.parse(value));
        }).done();
    }

    // set up old scene from storage
    setUpScene (score) {
        if (score > 0){
            this.createBubbles(NUM_BUBBLES - score);
            this.setState({score});
        }
        this.youLost(); // start game timeout
    }

    // game timeout
    youLost = () => {
        timeout = setTimeout ( () => {
            this.props.navigator.push({
                id: 5,
                callback: this.resetGame,
            });
            return <NextGamePage />;
        }, 30000);
    }

    // populate array of bubbles
    createBubbles(numBubbles) {
        bubbleCharacters = [];
        for(let i=0; i < numBubbles; i++){
            let size = {};
            let sequence = [];
            let startLeft = i*((SCREEN_WIDTH-15-OFFSET-BUBBLE_SIZE)/NUM_BUBBLES);
            let startTop = SCREEN_HEIGHT - 153;
        
            if(i%2 == 0){ 
                size = {width: BUBBLE_SIZE, height: BUBBLE_SIZE} // vary size of bubbles
                sequence = [startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET];
                // vary bubble's x transition sequence
            }
            else{
                size = {width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20}
                for(let i=0; i < 4; i++){
                    sequence.push(startLeft);
                    sequence.push(startLeft + OFFSET);
                } // not sure if this or the above sequence assignment is better...both seem weird
            }

            const tweenSettings = {
                tweenType: "sine-wave",
                startXY: [startLeft, startTop],
                xTo: sequence,
                yTo: [0, startTop],
                duration: this.getDuration(),
                loop: true,
            };
            bubbleCharacters.push(
                <AnimatedSprite key={i} coordinates={{top:500, left: startLeft}}
                size={size}
                draggable={false}
                character={bubbleCharacterLarge} 
                tween={tweenSettings} 
                tweenStart="auto"
                renderTime={Date.now()}                    
                onPress={this.popBubble.bind(null, i)}/>
            );
        }
    }

    // random value for y starting location
    getStartTop () {
        let startTop = Math.random() * ((SCREEN_HEIGHT+(NUM_BUBBLES*10)) - (SCREEN_HEIGHT - 70)) + (SCREEN_HEIGHT - 70);
        return (startTop);
    }

    // random duration
    getDuration () {
        return( Math.random() *  (11000 - 3000) + 3000 );
    }

    // remove bubble and record time it took to pop it
    popBubble = (bubblePos, popTime) => {
        this.setState({popTime: popTime});
        delete bubbleCharacters[bubblePos];
        this.updateScore();
    }

    updateScore = () => {
        newScore = this.state.score + 1;
        this.setState({score: newScore});
        this.saveScore(newScore);

        if(newScore > NUM_BUBBLES - 1){ // navigate to win page if all bubbles are popped
            this.props.navigator.push({
                id: 4,
                callback: this.resetGame,
            });
            clearTimeout(timeout); // reset the game timer
        }
    }

    saveScore = (data) => {
        AsyncStorage.setItem('score', JSON.stringify(data));
    }

    // reset score, bubbles and game timer once game has been won
    resetGame = () => {
        this.setState({popTime: 0});
        this.setState({score: 0});
        newScore = 0;
        this.saveScore(newScore);
        this.createBubbles(NUM_BUBBLES);
        this.youLost();
    };

    render(){
        return (
            <View style={styles.topLevel}>
                <View style={styles.sceneLevel}>
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 20, marginTop: 10}}>Bubble Pop Game</Text>
                        <Text style={{fontSize: 15}}>Pop all the bubbles and win the game!</Text>
                        <Text>SCORE: {this.state.score} Seconds To Pop: {this.state.popTime}</Text>
                    </View>
                    <View style={styles.gameWorld}>
                        {bubbleCharacters}
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
    sceneLevel : {
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

export default BubblePop;
