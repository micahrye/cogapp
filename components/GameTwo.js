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

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "./animatedSprite";
import greenDragonCharacter from "../sprites/dragon/greenDragonCharacter";
import Tweener from "./Tweener";

class GameTwo extends Component {

  constructor(props) {
    super(props);
  }

  render() {



    const tweenOpts01 = {
      tweenType: "hop",
      startXY: [40, 400],
      repeatable: true,
      loop: true,
    };





    return (
      <View>
      <TouchableOpacity style={styles.container}
                        hitSlop={{top:0,left:0,bottom:-150,right:-150}}>
        <View style={{left: 0, top: 0, height: 100,
                      width: 100, backgroundColor: 'blue'}}>
        </View>
      </TouchableOpacity>
      <AnimatedSprite
          coordinates={{top:400, left:40}}
          size={{width: 100, height: 100}}
          draggable={false}
          character={greenDragonCharacter}
          tweenStart="touch"
          tween={tweenOpts01}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 20,
    left: 20,
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'red',
  },
})

export default GameTwo
