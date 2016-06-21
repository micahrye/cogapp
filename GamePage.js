import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    AsyncStorage,
    Navigator,
} from 'react-native';

import Bubble from './Bubble';
import GameWinPage from './GameWinPage';

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let NUM_BUBBLES = 10;
let bubbles = []; // maybe another way to do this instead of it being a global variable?

class GamePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            score: 0,
        };
        this.createBubbles(NUM_BUBBLES);
    }

    componentDidMount(){
        // get value of score from async storage
        AsyncStorage.getItem('score').then((value) => {
        this.setUpOldScene(JSON.parse(value));
        }).done();
    }

    // set up old scene from async storage on app reopen
    setUpOldScene (score) {
        if(score > 0){
            this.createBubbles(NUM_BUBBLES - score);
            this.setState({score: score});
        }
    };

    // populate array of bubbles
    createBubbles(numBubbles) {
        bubbles = [];
        console.log(bubbles);
        for(let i=0; i < numBubbles; i++){
            delete bubbles[i];
            bubbles.push( <Bubble text={i} key={i} id={i} handlePress={this.popBubble.bind(null, i)}/>);
        }
    }

    // delete bubble from array when popped
    popBubble = (bubblePos) => {
        delete bubbles[bubblePos];
        this.updateScore();
    }

    // update score on bubble pop
    updateScore = () => {
        newScore = this.state.score + 1;
        this.setState({score: newScore});
        this.saveScore(newScore);

        if(newScore > NUM_BUBBLES - 1){ // navigate to win page if all bubbles are popped
            this.props.navigator.push({
                id: 4,
                callback: this.resetGame,
            });
            return <GameWinPage />;
        }
    };

    // save score in async storage
    saveScore = (data) => {
        AsyncStorage.setItem('score', JSON.stringify(data));
        
    };

    // reset score and bubbles once game has been won
    resetGame = () => {    
        this.setState({score: 0});
        newScore = 0;
        this.saveScore(newScore);
        this.createBubbles(NUM_BUBBLES);
    };

    render(){
        return (
             <View style={styles.topLevel}>
                <Text>Top Level</Text>
                <View style={styles.sceneLevel}>
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 20, marginTop: 10}}>Bubble Pop Game</Text>
                        <Text style={{fontSize: 15}}>Pop all the bubbles and win the game!</Text>
                        <Text>SCORE: {this.state.score}</Text>
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
    gameWorld :{
        width: SCREEN_WIDTH - 30,
        borderStyle: 'solid',
        borderWidth: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: .87,
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