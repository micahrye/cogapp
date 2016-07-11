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
import frogCharacterCelebrate from "../sprites/frog/frogCharacterCelebrate"
import squareCharacter from "../sprites/square/squareCharacter";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let fixedBoxes = [];

class GameFour extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            moveableBoxes: [],
            currFrogCharacter: frogCharacter,
        }
    }

    componentDidMount() { 
        this.createBoxes();
    }

    createBoxes() {
        // create fixed boxes
        for(let i=0; i < 9; i++){
            if(i < 8){ // put text in first 8 boxes
                fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}><Text style={styles.text}>{i}</Text></View>);
            }
            else if(i === 8){
                fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}></View>);
            }
        }

        // create moveable boxes at bottom
        let boxes = [];
        for(let i=0; i < 3; i++){
            boxes.push(
                    <AnimatedSprite 
                    style={this.testStyle} 
                    key={i}
                    spriteKey={i} 
                    coordinates={{top: 300, left: (i*90) + 10}}
                    size={{width: 60, height: 60}}
                    draggable={true} 
                    draggedTo={this.checkLocation.bind(null, i)}
                    character={squareCharacter}/>
                );
        }
        this.setState({moveableBoxes: boxes});
    }

    // check if a moveable box has been dragged to dashed box and if true remove it
    checkLocation = (numBox, newX, newY) => {
        if((newX > 185 && newX < 205) && (newY > 190 && newY < 210)){
            let boxes = [];
            this.state.moveableBoxes.forEach((item)=>{
                if(numBox !== item.props.spriteKey){
                    boxes.push(item)
                }
            });
            this.setState({moveableBoxes: boxes, currFrogCharacter: frogCharacterCelebrate});
            console.warn(this.state.currFrogCharacter);
            // setTimeout( () => {
            //     this.setState({frogCharacter: frogCharacter});
            // }, 1400);
        }
    }

    getBoxStyles(boxNum) {
        if(boxNum === 8){ // last fixed box is dashed
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
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.boxContainer}>
                    {fixedBoxes}
                    {this.state.moveableBoxes}    
                </View>
                <AnimatedSprite coordinates={{top: 100, left: SCREEN_WIDTH-200}}
                        size={{width: 256, height: 256}}
                        draggable={false}
                        character={this.state.currFrogCharacter}/>
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
    // box: {
    //     borderWidth: 2,
    //     width: 60,
    //     height: 60,
    //     margin: 15,
    //     alignItems: 'center',
    // },
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
