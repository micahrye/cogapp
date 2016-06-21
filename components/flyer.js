
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
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';

import SAT from 'sat';

import reactMixin from 'react-mixin';
import {Motion, spring} from 'react-motion';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "./animatedSprite";
import greenDragonMeta from "./frames/greenDragonMeta";

var SCREEN_WIDTH = require('Dimensions').get('window').width;

class Flyer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
      bounceValue2: new Animated.Value(0),
      tweenValue: new Animated.Value(0),
      tweenValue2: new Animated.Value(0),
      tweenValue3: new Animated.Value(0),
      lefty: 10,
      topy: 20,
      opacity: 1,
    };
    this._animateOpacity = this._animateOpacity.bind(this);
    this._panResponder = {};
  }

  componentDidMount() {

    /*
    this.setTimeout(()=>{
      Alert.alert("Alert Title", "msg");
    }, 1000);
    */
    /*
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    */
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

    this.state.tweenValue2.setValue(10);
    Animated.timing(          // Uses easing functions
       this.state.tweenValue2,    // The value to drive
       {toValue: 100,
         easing: Easing.elastic(2),
       duration: 1000, }            // Configuration
     ).start();

     this.state.tweenValue3.setValue(10);
     Animated.timing(          // Uses easing functions
        this.state.tweenValue3,    // The value to drive
        {toValue: 100,
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
        borderWidth: 2, borderColor: '#00ff00'};
    let lefty = this.state.tweenValue2;

    debugger;
    //this.state.tweenValue3 = Math.floor(Math.random()*100);
    //this.setState({tweenValue3: Math.floor(Math.random()*100)})
    return (
      {
        top: this.state.tweenValue2,
        left: this.state.tweenValue3,
        ...dragonStyle
      }
    );
  }


  render() {
    const dragonStyle = {width: 100, height: 95,
        borderWidth: 2, borderColor: '#00ff00'};

    return (
      <View style={styles.mainContainer}>
          <View style={styles.container}>
            <AnimatedSprite />
          </View>

        <View style={styles.container2}>

          <TouchableWithoutFeedback
            onPress={ (evt) => { this._handelPress() } }>
            <View>
              <Text>Press me lama</Text>
            </View>
          </TouchableWithoutFeedback>


          <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
            activeOpacity={1.0}
            style={{top: this.state.tweenValue, ...dragonStyle}}
            key={1}>
          <Animated.Image
            source={require("./frames/green_dragon04.png")}
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
              source={greenDragonMeta.idel[0]}
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
  mainContainer:{
    flex: 1,
    flexDirection: "column",
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ff0000',
    borderStyle: 'dashed',
  },
  container: {
    flex: 1,
    flexDirection: "row",
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#0000ff',
    borderStyle: 'dashed',
    height: 200,
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',

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
