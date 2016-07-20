import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import frogCharacter from "../../sprites/frog/frogCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugCharacterIdle from "../../sprites/bug/bugCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const startLeft = 15;
const startTop = 35;
const spacing = 120;
const sprite1Start = [startLeft,startTop];
const sprite2Start = [startLeft+spacing,startTop];
const sprite3Start = [startLeft+spacing*2,startTop];

class GameSix extends React.Component {
  render(){
    return(
      <Image source={require('../../backgrounds/Game_6_Background_1280.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            <View style={styles.number}><Text style={styles.text}>1</Text></View>
            <View style={styles.circle}></View>
            <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
              size={{width: 50, height: 50}}
              draggable={true}
              character={appleCharacter}
              />
          </View>

          <View style={styles.itemContainer}>
            <View><Text style={styles.text}>2</Text></View>
            <View style={styles.circle}></View>
            <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
              size={{width: 50, height: 50}}
              draggable={true}
              character={canCharacter}
              tweenStart="touch"
              />
          </View>

          <View style={styles.itemContainer}>
            <View><Text style={styles.text}>3</Text></View>
            <View style={styles.circle}></View>
            <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
              size={{width: 50, height: 50}}
              draggable={true}
              character={bugCharacterIdle}
              tweenStart="touch"
              />
          </View>

          <View style={styles.itemContainer}>
            <View><Text style={styles.topText}>4</Text></View>
            <View style={styles.circle}></View>
            <AnimatedSprite coordinates={{top: startTop, left: startLeft}}
              size={{width: 50, height: 50}}
              draggable={true}
              character={canCharacter}
              tweenStart="touch"
              />
          </View>

          <AnimatedSprite coordinates={{top: 250, left: 30}}
            size={{width: 170, height: 120}}
            draggable={false}
            character={omnivoreCharacter}
            />

          <View style={styles.thoughtBubbles}>
            <View style={styles.bubble1}><Text style={styles.thoughtText}>1</Text></View>
            <View style={styles.bubble2} />
            <View style={styles.bubble3} />
          </View>
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  itemContainer:{
    top: 0,
    left: 275,
    alignItems: 'center',
    marginRight: 15,
    height: 150,
    width: 75,
 //   borderWidth: 2,
  },
  circle: {
    borderWidth: 3,
    borderRadius: 100,
    height: 75,
    width: 75,
  },
  topText: {
    fontSize: 15,
  },
  thoughtBubbles: {
    height: 200,
    width: 250,
  //  borderWidth: 2,
    top: 90,
    left: 55,
    position: 'absolute',
  },
  bubble1: {
    borderWidth: 1.5,
    borderRadius: 100,
    height: 120,
    width: 150,
    alignItems: 'center',
  },
  bubble2: {
    borderWidth: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    left: 150,
    top: -30,
  },
  bubble3: {
    borderWidth: .5,
    borderRadius: 100,
    height: 30,
    width: 30,
    left: 145,
    top: -20,
  },
  thoughtText: {
    fontSize: 50,
    top: 20,
  },
});

export default GameSix;
