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
import Sound from 'react-native-sound';

import AnimatedSprite from "../animatedSprite";
import monkeyCharacter from "../../sprites/monkey/monkeyCharacter";
import platformCharacter from "../../sprites/platform/platformCharacter";
import Tile from "./Tile";
import birdCharacter from "../../sprites/bird/birdCharacter";

let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LoadingTime = 3000;

class GameThree2 extends React.Component {

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
          id: 17,
      });
  }


    render() {

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
                  <Text>Go to Level 4</Text>
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
              <Tile top={70} left={190} width={88} height={20} />
              <Tile top={87} left={293} width={88} height={20}/>
              <Tile top={79} left={390} width={88} height={20}/>
              <Tile top={178} left={193} width={88} height={20}/>
              <Tile top={180} left={294} width={88} height={20}/>
              <Tile top={190} left={395} width={88} height={20}/>
              <Tile top={280} left={200} width={88} height={20}/>
              <Tile top={283} left={310} width={88} height={20}/>
              <Tile top={268} left={415} width={88} height={20}/>
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

export default GameThree2
