/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  AppRegistry,
  Navigator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

var reactMixin = require('react-mixin');
import {Motion, spring} from 'react-motion';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "./components/animatedSprite";

class Flyer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    /*
    this.setTimeout(()=>{
      Alert.alert("Alert Title", "msg");
    }, 1000);
    */
  }
  outerTouch(evt){
    this.state.bounceValue.setValue(1.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
    this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.8,                         // Animate to smaller size
        friction: 1,                          // Bouncier spring
      }
    ).start();
  }

  _handelPress(evt){
    console.log("pop is my favorite type of music");
    this.props.navigator.pop();
  }

  render() {
    const bv = this.state.bounceValue;
    return (

    <View>
      <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
        style={styles.container}
        activeOpacity={1.0}>
        <View style={styles.container}>
          <AnimatedSprite />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }

        activeOpacity={1.0}>
      <Animated.Image
        source={require("./components/frames/green_dragon04.png")}
        style={{
          flex: 1,
          transform: [
            {scale: bv},
          ]
        }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={ (evt) => { this._handelPress() } }>
        <Text>Press me mama</Text>
      </TouchableOpacity>
    </View>
    );
  }
}

reactMixin.onClass(Flyer, TimerMixin);

/*
let style = {
  position: 'absolute',
  top: Number((val.x * 2.5).toFixed(2)),
  left: Number((val.x * 3).toFixed(2)),
  backgroundColor: '#0000ff',
  color: '#fff'
};
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ff00ff',
    borderStyle: 'dashed',
  },
  box: {
    borderColor: 'red',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: 100,
    height: 100
  }
});


export default Flyer;


/*
<Motion defaultStyle={{x: 0}} style={{x: spring(100)}}>
  {val => {
    let style = {
      position: 'absolute',
      top: val.x * 2.5,
      left: val.x * 3,
      backgroundColor: '#0000ff',
      color: '#fff'
    };
    return (
      <Animatable.View ref="view">
    <Text style={style}>{val.x}</Text>
  </Animatable.View>
      )}}
</Motion>
*/
