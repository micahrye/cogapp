import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import bubbleCharacter from "../sprites/bubble/bubbleCharacterLarge";
import frogCharacter from "../sprites/frog/frogCharacter";
import squareCharacter from "../sprites/square/squareCharacter";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let numberBoxes = [];

class GameFour extends React.Component {
    constructor(props){
        super(props);

        this.createBoxes();
    }

    componentDidMount() { }

    createBoxes() {
        for(let i=0; i < 12; i++){
            if(i < 8){
                numberBoxes.push(<View key={i} style={this.getBoxStyles(i)}><Text style={styles.text}>{i}</Text></View>);
            }
            else if(i === 8){
                numberBoxes.push(<View key={i} style={this.getBoxStyles(i)}></View>);
            }
            else{
                numberBoxes.push(
                    <AnimatedSprite style={this.testStyle} key={i} coordinates={{top: 300, left: ((i-9)*90) + 10}}
                    size={{width: 60, height: 60}}
                    draggable={true} 
                    character={squareCharacter}/>
                );
            }
        }
    }

    getBoxStyles(boxNum) {
        // let xOffset = yOffset;
        // if(xOffset%3 === 0){
        //     xOffset = 0;
        // }
        // else if (xOffset > 3 && xOffset <= 6){
        //     xOffset = yOffset - 3;
        // }
        // else if(yOffset > 6){
        //     xOffset = yOffset - 6;
        // }

        if(boxNum === 8){
            borderStyle = 'dashed';
        }
        else{
            borderStyle = 'solid';
        }
        return {
            borderWidth: 2,
            borderStyle: borderStyle,
            width: 60,
            height: 60,
            margin: 15,
            alignItems: 'center',
            //position: "absolute",
            // left: xOffset*(90),
            // top: (Math.floor(yOffset/3)*(90)),
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.boxContainer}>
                    {numberBoxes}     
                </View>
                <AnimatedSprite coordinates={{top: 100, left: SCREEN_WIDTH-200}}
                        size={{width: 256, height: 256}}
                        draggable={false} 
                        character={frogCharacter}/>
            </View>
        );
       
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: 280,
        borderWidth: 3,
        left: SCREEN_WIDTH/2 - 140,
    },
    box: {
        borderWidth: 2,
        width: 60,
        height: 60,
        margin: 15,
        alignItems: 'center',
    },
    text: {
        fontSize: 45,
    },
    testStyle: {
        borderWidth: 2,
        width: 10,
        height: 10,
    }
});

export default GameFour;
