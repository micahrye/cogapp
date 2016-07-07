
/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  Navigator,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import SAT from 'sat';

import reactMixin from 'react-mixin';
import {Motion, spring} from 'react-motion';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "./AnimatedSprite";
import greenDragonCharacter from "../sprites/dragon/greenDragonCharacter";
import Tweener from "./Tweener";

var SCREEN_WIDTH = require('Dimensions').get('window').width;

class Flyer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
      bounceValue2: new Animated.Value(0),
      tweenValue: new Animated.Value(0),
      _top: new Animated.Value(10),
      _left: new Animated.Value(200),
      opacity: 1,
    };
    this._animateOpacity = this._animateOpacity.bind(this);
    this._panResponder = {};

  }

  componentDidMount() {

  }
  outerTouch(evt){

    this.state.bounceValue.setValue(0.5);     // Start large
    /*
    Animated.spring(                          // Base: spring, decay, timing
    this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 1,                         // Animate to smaller size
        friction: 1,                          // Bouncier spring
      }
    ).start();
    */
    Animated.timing(          // Uses easing functions
       this.state.bounceValue,    // The value to drive
       {toValue: 1,
       duration: 5000, }            // Configuration
     ).start();

     this.state.tweenValue.setValue(10);
     Animated.timing(          // Uses easing functions
        this.state.tweenValue,    // The value to drive
        {toValue: 100,
           easing: Easing.elastic(2),
        duration: 1000, }            // Configuration
      ).start();
  }

  touchMe(evt){
    //this.setState({topy: 30, lefty: 50});

    //let lefty = this.state.tweenValue2 + Math.floor(Math.random()*10);
    //this.setState({tweenValue3: new Animated.Value(99)})

    this.state._top.setValue(10);
    Animated.timing(          // Uses easing functions
       this.state._top,    // The value to drive
       {toValue: 10+100,
         easing: Easing.elastic(2),
       duration: 1000, }            // Configuration
     ).start();

     this.state._left.setValue(160);
     Animated.timing(          // Uses easing functions
        this.state._left,    // The value to drive
        {toValue: 160+100,
          easing: Easing.inOut(Easing.poly(2)),
        duration: 1000, }            // Configuration
      ).start();
  }

  _handelPress(evt){
    console.log("pop is my favorite type of music");
    this.props.navigator.pop();
  }

  _animateOpacity() {

  }

  getStyle(){
    const dragonStyle = {width: 100, height: 95,
        borderWidth: 2, borderColor: '#00ff00', position: 'absolute'};

    //this.state.tweenValue3 = Math.floor(Math.random()*100);
    //this.setState({tweenValue3: Math.floor(Math.random()*100)})
    return (
      {
        top: this.state._top,
        left: this.state._left,
        ...dragonStyle
      }
    );

  }


  render() {
    const dragonStyle = {width: 100, height: 95,
        borderWidth: 2, borderColor: '#00ff00'};

    const tweenOpts01 = {
      tweenType: "sine-wave",
      startXY: [110, 250],
      xTo: [160, 60, 160],
      yTo: [0],
      duration: 2000,
      repeatable: true,
    };

    const tweenOpts02 = {
      tweenType: "sine-wave",
      startXY: [210, 100],
      xTo: [0],
      yTo: [150, 50, 150],
      duration: 2000,
      repeatable: true,
    };

    return (
      <View style={styles.mainContainer}>

        <View style={styles.container}>

          <AnimatedSprite coordinates={{top:100, left:10}}
            size={{width: 100, height: 95}}
            draggable={true}
            character={greenDragonCharacter} />

          <AnimatedSprite coordinates={{top:250, left:110}}
              size={{width: 100, height: 95}}
              draggable={false}
              character={greenDragonCharacter}
              touchTween={tweenOpts01} />

            <AnimatedSprite coordinates={{top:100, left:210}}
              size={{width: 100, height: 95}}
              draggable={false}
              character={greenDragonCharacter}
              touchTween={tweenOpts02} />
        </View>


        <View style={styles.container2}>

          <TouchableWithoutFeedback
            onPress={ (evt) => { this._handelPress() } }>
            <View>
              <Text>Press MEMEME lama</Text>
            </View>
          </TouchableWithoutFeedback>


          <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
            activeOpacity={1.0}
            style={{top: this.state.tweenValue, ...dragonStyle}}
            key={1}>
          <Animated.Image
            source={require("../sprites/dragon/green_dragon04.png")}
            style={{
              flex: 1,
              opacity: this.state.bounceValue,
              ...dragonStyle
            }}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={(evt) => this.touchMe(evt) }
            activeOpacity={1.0}
            style={ this.getStyle() }
            key={2}>

            <Animated.Image
              source={greenDragonCharacter.idel[0]}
              style={{
                flex: 1,
                opacity: 1,
                ...dragonStyle
              }}
            />
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

reactMixin.onClass(Flyer, TimerMixin);


const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor: '#ff0000',
    borderStyle: 'dashed',
  },
  container: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#0000ff',
    borderStyle: 'dashed',
    height: 350,
  },
  container2: {
    //justifyContent: 'center',
    //alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    borderColor: '#ff00ff',
    borderStyle: 'dashed',
    height: 300,
  },
  box: {
    borderColor: 'red',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: 100,
    height: 100
  },
  dragonStyle: {width: 200, height: 195,
      borderWidth: 2, borderColor: '#00ff00'},
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
