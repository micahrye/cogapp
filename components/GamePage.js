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
let NUM_BUBBLES = 15;
let BUBBLE_SIZE = 60;
let bubbles = []; // maybe another way to do this instead of it being a global variable?

class GamePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            score: 0,
            popTime: 0,
        }
        this.createBubbles(NUM_BUBBLES);
    }

    componentDidMount () {
        AsyncStorage.getItem('score').then((value) => {
            this.setUpScene(JSON.parse(value));
        }).done();
    }

    setUpScene (score) {
        if (score > 0){
            this.createBubbles(NUM_BUBBLES - score);
            this.setState({score});
        }
        this.youLost();
    }

    youLost = () => {
        timeout = setTimeout ( () => {
            this.props.navigator.push({
                id: 5,
                callback: this.resetGame,
            });
            return <NextGamePage />;
        }, 10000);
    }

   // populate array of bubbles
    createBubbles(numBubbles) {
        bubbles = [];
        for(let i=0; i < numBubbles; i++){
            let startLeft = i*((SCREEN_WIDTH-110)/NUM_BUBBLES) + 2;
            let startTop = this.getStartTop();

            const tweenOpts01 = {
              tweenType: "sine-wave",
              startXY: [startLeft, startTop],
              xTo: [startLeft + 40, startLeft, startLeft + 40, startLeft],
              yTo: [0],
              duration: this.getDuration(),
              repeatable: true,
            };

            if(i%2 == 0){
                bubbles.push(
                    <AnimatedSprite key={i} coordinates={{top:startTop, left: startLeft}}
                    size={{width: BUBBLE_SIZE, height: BUBBLE_SIZE}}
                    draggable={false}
                    character={bubbleCharacter} 
                    touchTween={tweenOpts01} 
                    autoMove={true}
                    renderTime={Date.now()}                    
                    remove={this.popBubble.bind(null, i)}/>
                );
            }
            else{
                bubbles.push(
                    <AnimatedSprite key={i} coordinates={{top:startTop, left: startLeft}}
                    size={{width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20}}
                    draggable={false}
                    character={bubbleCharacter} 
                    touchTween={tweenOpts01} 
                    autoMove={true}
                    renderTime={Date.now()}
                    remove={this.popBubble.bind(null, i)}/>
                );
            }
        }

    }

    getStartTop () {
        return (Math.random() * ((SCREEN_HEIGHT+(NUM_BUBBLES*10)) - (SCREEN_HEIGHT - 153 - BUBBLE_SIZE)) + (SCREEN_HEIGHT - 153 - BUBBLE_SIZE));
    }

    getDuration () {
        return( Math.random() *  (NUM_BUBBLES*300 - (NUM_BUBBLES*1000)/5) + (NUM_BUBBLES*1000)/5 );
    }

    popBubble = (bubblePos, popTime) => {
        this.setState({popTime: popTime});
        delete bubbles[bubblePos];
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
            clearTimeout(timeout);
        }
    }

    saveScore = (data) => {
        AsyncStorage.setItem('score', JSON.stringify(data));
    }

    // reset score and bubbles once game has been won
    resetGame = () => {
        this.setState({score: 0});
        newScore = 0;
        this.saveScore(newScore);
        this.createBubbles(NUM_BUBBLES);
        this.youLost();
    };

    render(){
        
      //  AsyncStorage.clear();
        return (
             <View style={styles.topLevel}>
                <View style={styles.sceneLevel}>
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 20, marginTop: 10}}>Bubble Pop Game</Text>
                        <Text style={{fontSize: 15}}>Pop all the bubbles and win the game!</Text>
                        <Text>SCORE: {this.state.score} Seconds To Pop: {this.state.popTime}</Text>

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
