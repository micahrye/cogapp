"use strict";

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';


class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      movies: null,
      animate: false,
      _scale: new Animated.Value(0),
      _x: props.coordinates.x,
      _y: props.coordinates.y,
      _width: props.size.width,
      _height: props.size.height,
    };

    this.character = undefined;
    this.soul = undefined;
    this._charactertyles =  {};
    this._initialX = this.state._x;
    this._initialY = this.state._y;
    this.isDraggable = props.draggable;
    this._panResponder = {};

    this._animation = this.props.character;
    this._animationKey = 'idel';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    this.animationInterval = undefined;
  }

  componentWillMount() {
    if(this.isDraggable){
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant:(e, gestureState) => {
          this._handlePanResponderGrant(e, gestureState)},
        onPanResponderMove: (e, gestureState) => {
          this._handlePanResponderMove(e, gestureState)},
        onPanResponderRelease: (e, gestureState) => {
          this._handlePanResponderEnd(e, gestureState)},
        onPanResponderTerminate:
          (e, gestureState) => {
          this._handlePanResponderEnd(e, gestureState)},
        });
      debugger;
    }
    this._previousLeft =  this._initialX;
    this._previousTop = this._initialY;
    this._characterStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
        width: this.state._width,
        height: this.state._height,
      },
    };
  }

  componentDidMount() {
    this.setAnimationInterval();
    // have to set xy
    this.character && this.character.setNativeProps(this._characterStyles)

  }

  componentWillUnmount(){
    // Make sure to clear any intervals that have been set.
    clearInterval(this.animationInterval);
  }

  setAnimationInterval(){
    this.animationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }else{
        this.setState({animate: true});
      }
      //console.log("move please");
    }, 100);
  }

  _highlight() {
    //this._characterStyles.style.backgroundColor = 'blue';
    this._updateNativeStyles();
  }

  _unHighlight() {
    //this._characterStyles.style.backgroundColor = 'green';
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.character && this.character.setNativeProps(this._characterStyles);
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    return true;
  }

  _handlePanResponderGrant(e, gestureState) {
    this._highlight();
  }

  _handlePanResponderMove(e, gestureState) {
    this._characterStyles.style.left = this._previousLeft + gestureState.dx;
    this._characterStyles.style.top = this._previousTop + gestureState.dy;
    this._updateNativeStyles();
  }

  _handlePanResponderEnd(e, gestureState) {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  }

  handlePress(evt){

    console.log(`INNER ${evt.nativeEvent.locationX}`);
    if(this._animationKey === 'idel'){
      this._animationKey = 'touch';
    }else{
      this._animationKey = 'idel'
    }
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    //clearInterval(this.animationInterval);


    this.state._scale.setValue(0.90);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
    this.state._scale,                 // Animate `_scale`
      {
        toValue: 1,                       // Animate to smaller size
        friction: 2.5,                          // Bouncier spring
      }
    ).start();      
  }

  render() {

    return(

        <Animated.View
          {...this._panResponder.panHandlers}
          style={{
            position: 'absolute',
            borderWidth: 2,
            borderColor: '#ff00ff',
            transform: [
              {scale: this.state._scale},
            ]
          }}
          ref={(character) => {
            this.character = character;
          }}
        >
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={(evt) => this.handlePress(evt)}>
            <Animated.Image
              ref={(soul) => {
                this.soul = soul;
              }}
              source={this._animation[this._animationKey][this.frameIndex]}
              style={{
                ...styles.character,
                width: this.state._width,
                height: this.state._height,
              }}/>
          </TouchableOpacity>

        </Animated.View>

    );
  }

}

const styles = {
  character: {
    borderWidth: 2,
    borderColor: '#00ff00'
  },
  animator:{
    borderWidth: 2,
    borderColor: '#ff00ff',
  },
};


export default AnimatedSprite;
