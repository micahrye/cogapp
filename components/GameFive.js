import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Easing,
  Navigator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';

// imports

import AnimatedSprite from "./animatedSprite";
import Tweener from "./Tweener";

// import different characters to feed to animated sprite
import chuteCharacter from "../sprites/chute/chuteCharacter";
import omnivoreCharacter from "../sprites/omnivore/omnivoreCharacter";
import monkeyCharacter from "../sprites/monkey/monkeyCharacter";
import canCharacter from "../sprites/can/canCharacter";
import appleCharacter from "../sprites/apple/appleCharacter";

const Window = Dimensions.get('window');


class GameFive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rotation : new Animated.Value(16),
    }
  }


  buttonPress = () => {

  }




  render() {



    return (
      <View style={styles.container}>
        <Image source={require('../backgrounds/Game_5_Background_1280.png')} style={styles.backgroundImage}>
        <AnimatedSprite coordinates={{top: 77, left: 460}}
            size={{width: 150, height: 165}}
            draggable={false}
            character={monkeyCharacter}/>
        <AnimatedSprite coordinates={{top: -20, left: 250}}
            size={{width: 200, height: 220}}
            draggable={false}
            character={chuteCharacter}/>
        <AnimatedSprite coordinates={{top: 260 , left: 60}}
            size={{width: 170, height: 120}}
            draggable={false}
            character={omnivoreCharacter}/>
        <AnimatedSprite
            coordinates={{top: 10, left: 270}}
            size={{width: 60, height: 60}}
            draggable={false}
            character={appleCharacter}/>
        <AnimatedSprite
            coordinates={{top: 90, left: 270}}
            size={{width: 60, height: 60}}
            draggable={false}
            character={canCharacter}/>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // styles for background png image/basic black backgroundColor
  // to go behind it
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
  // style for navigation button
  button: {
      backgroundColor: '#4d94ff',
      borderRadius: 10,
      width: 90,
      height: 30,

  },
})

export default GameFive
