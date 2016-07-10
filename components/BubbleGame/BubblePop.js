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
import AnimatedSprite from '../animatedSprite';
import NextGamePage from '../NextGamePage';
import bubbleCharacterLarge from '../../sprites/bubble/bubbleCharacterLarge';
import bubbleCharacterSmall from '../../sprites/bubble/bubbleCharacterSmall';

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let NUM_BUBBLES = 15;
let BUBBLE_SIZE = 60;
let OFFSET = 60;

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
            let startLeft = i*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/NUM_BUBBLES);

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
                startXY: [startLeft, SCREEN_HEIGHT],
                xTo: sequence,
                yTo: [0, SCREEN_HEIGHT],
                duration: this.getDuration(),
                loop: true,
            };
            bubbleCharacters.push(
                <AnimatedSprite
                  key={i}
                  spriteKey={i}
                  coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
                  size={size}
                  draggable={false}
                  character={bubbleCharacterLarge}
                  tween={tweenSettings}
                  tweenStart="auto"
                  timeSinceMounted={
                    (spriteKey, duration)=>this.popBubble(spriteKey, duration)
                  }
                />
            );
        }
    }

    // random duration
    getDuration () {
        return( Math.random() *  (12000 - 4000) + 4000 );
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
            clearTimeout(timeout); // reset the game timer
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
            <Image source={require('../../backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
              <View style={styles.topBar}>
                <Text>SCORE: {this.state.score} Seconds To Pop: {this.state.popTime}</Text>
              </View>
              <View style={styles.gameWorld}>
                {bubbleCharacters}
              </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    topLevel :{
        alignItems: 'center',
    },
    // sceneLevel : {
    //     height: SCREEN_HEIGHT - 70,
    //     width: SCREEN_WIDTH - 30,
    //     borderStyle: 'solid',
    //     borderWidth: 2,
    //     alignItems: 'center',
    //     flex: 1,
    // },
    gameWorld: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        borderStyle: 'solid',
        borderWidth: 2,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    topBar: {
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 700,
        borderStyle: 'solid',
        borderWidth: 2,
    },
});

export default BubblePop;
