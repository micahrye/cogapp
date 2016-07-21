import React, { Component } from 'react';
import {
    Animated,
    AppRegistry,
    Easing,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import Tile from "./Tile";
import monkeyCharacter from "../../sprites/monkey/monkeyCharacter";
import platformCharacter from "../../sprites/platform/platformCharacter";
import birdCharacter from "../../sprites/bird/birdCharacter";

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LoadingTime = 3000;

class GameThree1 extends React.Component {

  constructor(props) {
    super(props);
    textOpacity = new Animated.Value(1.0);
    this.state = {
      loadingScreen: <View key={0} style={styles.loadingScreen}>
                       <Animated.View style={{opacity:textOpacity}}>
                         <Text style={{fontSize:60,fontWeight:'bold',
                                       color: 'lightcoral'}}>
                         LOADING</Text>
                       </Animated.View>
                     </View>,
    }
  }

  componentDidMount() {
    setTimeout(() => {this.setState({loadingScreen: []});},LoadingTime);
    Animated.sequence([
      Animated.timing(
        textOpacity,
        {
          toValue: 0.2,
          easing: Easing.linear,
          duration: LoadingTime/3,
        }
      ),
      Animated.timing(
        textOpacity,
        {
          toValue: 1.0,
          easing: Easing.linear,
          duration: LoadingTime/3,
        }
      ),
      Animated.timing(
        textOpacity,
        {
          toValue: 0,
          easing: Easing.linear,
          duration: LoadingTime/3
        }
      )
    ]).start();
  }

  buttonPress = () => {
      this.props.navigator.replace({
          id: 16,
      });
  }


    render(){
        const tweenSettings = {
            tweenType: "hop-forward",
                startXY: [10, 150],
                endXY:[450],
                yTo: [-100],
                duration: 3000,
                loop: false,
        }
        return(
          <View style={styles.container}>
            <Image source={require('../../backgrounds/Game_3_Background_1280.png')} style={styles.backgroundImage}>
              <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                  <Text>Go to Level 3</Text>
              </TouchableOpacity>
              <AnimatedSprite coordinates={{top: 150, left: 10}}
                  size={{width: 100, height: 120}}
                  draggable={false}
                  character={monkeyCharacter}
                  tween={tweenSettings}
                  tweenStart="auto"/>
              <AnimatedSprite coordinates={{top:180, left: 40}}
                  size={{width: 120,height: 80}}
                  draggable={false}
                  character={birdCharacter}/>
              <Tile top={80} left={235} width={220} height={50} />
              <Tile top={180} left={235} width={220} height={50} />
              <Tile top={280} left={235} width={220} height={50} />
              <View>
                  {this.state.loadingScreen}
              </View>
            </Image>
          </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    tile: {
        height: 100,
        width: 200,
        borderWidth: 2,
        top: (SCREEN_HEIGHT/2) - 50,
        transform: [{rotateX: '10deg'}],
    },
    button: {
        backgroundColor: '#4d94ff',
        borderRadius: 10,
        width: 90,
        height: 30,
        top:0,
        left:0,
        position: 'absolute',
    },
    loadingScreen: {
      backgroundColor: 'lightblue',
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default GameThree1
