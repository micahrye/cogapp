import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";
import bubbleCharacter from "../sprites/bubble/bubbleCharacterLarge";
import frogCharacter from "../sprites/frog/frogCharacter";


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
                    <AnimatedSprite key={i} coordinates={{top: 300, left: ((i-9)*80) + 10}}
                    size={{width: 60, height: 60}}
                    draggable={true} 
                    character={bubbleCharacter}/>
                );
            }
        }
    }

    getBoxStyles(xOffset) {
        let yOffset = xOffset;
        if(yOffset%3 === 0){
            yOffset = 0;
        }
        else if (yOffset > 3 && yOffset <= 6){
            yOffset = xOffset - 3;
        }
        else if(yOffset > 6){
            yOffset = xOffset - 6;
        }

        if(xOffset === 8){
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
            position: "absolute",
            left: yOffset*(80),
            top: (Math.floor(xOffset/3)*(80)),
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
        width: 260,
        borderWidth: 3,
        left: SCREEN_WIDTH/2 - 130,
    },
    box: {
        borderWidth: 2,
        width: 60,
        height: 60,
        margin: 15,
        alignItems: 'center',
       // position: "absolute",
    },
    text: {
        fontSize: 45,
    },
    emptyBox: {
        top: 198,
        left: 402,
        borderWidth: 2,
        width: 60,
        height: 60,
        margin: 15,
        alignItems: 'center',
        borderStyle: 'dashed',
        position: 'absolute',
    },
});

export default GameFour;
