import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import Sound from 'react-native-sound';

import AnimatedSprite from "./animatedSprite";
import monkeyCharacter from "../sprites/monkey/monkeyCharacter";
import platformCharacter from "../sprites/platform/platformCharacter";


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;

// create a class for individual tiles so GameThree2's render will
// be neater and easier to read
class Tile extends Component {
  render() {

    const tweenOpts01 = {
      tweenType: "bounce",
      repeatable: true,
      loop: false,
    };

    return (
      <AnimatedSprite coordinates={{top: this.props.top, left: this.props.left}}
              size={{width: 88, height: 20}}
              draggable={false}
              character={platformCharacter}
              soundOnTouch={true}
              tweenStart="touch"
              tween={tweenOpts01}/>
    );
  }
}

class GameThree2 extends React.Component {

  buttonPress = () => {
      this.props.navigator.push({
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
            <Image source={require('../backgrounds/Game_3_Background_1280.png')} style={styles.backgroundImage}>
              <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                  <Text>Go to Level 4</Text>
              </TouchableOpacity>
              <AnimatedSprite coordinates={{top: 150, left: 10}}
                  size={{width: 100, height: 120}}
                  draggable={false}
                  character={monkeyCharacter}
                  tween={tweenSettings}
                  tweenStart="auto"/>
              <Tile top={70} left={190} />
              <Tile top={87} left={293} />
              <Tile top={79} left={390} />
              <Tile top={178} left={193} />
              <Tile top={180} left={294} />
              <Tile top={190} left={395} />
              <Tile top={280} left={200} />
              <Tile top={283} left={310} />
              <Tile top={268} left={415} />
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
    },
});

export default GameThree2
