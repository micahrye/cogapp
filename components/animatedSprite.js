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

import Tweener from "./Tweener";


class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      movies: null,
      animate: false,
      _scale: new Animated.Value(0),
      _top: new Animated.Value(props.coordinates.top),
      _left: new Animated.Value(props.coordinates.left),
      _width: props.size.width,
      _height: props.size.height,
    };

    this.character = undefined;
    this.soul = undefined;
    this._charactertyles =  {};
    this._initialX = this.state._left._value;
    this._initialY = this.state._top._value;
    this._panResponder = {};

    this._animation = this.props.character;
    this._animationKey = 'idel';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    this.animationInterval = undefined;

    this._Tweener = Tweener();
    this._hasTweened = 0;
  }

  componentWillMount() {
    if(this.props.draggable){
      // note that with PanResponder we setNativeProps for performance reasons,
      // as stated by FB.
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

    if(this.props.tweenStart == "auto"){
      this.startAnimation();
    }
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
    // do something on grant
  }

  _handlePanResponderMove(e, gestureState) {
    this._characterStyles.style.left = this._previousLeft + gestureState.dx;
    this._characterStyles.style.top = this._previousTop + gestureState.dy;
    this._updateNativeStyles();
  }

  _handlePanResponderEnd(e, gestureState) {
    // do anything you want onPanResponderRelease
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
    this.state._top = this._characterStyles.style.top;
    this.state._left = this._characterStyles.style.left;
  }

  getStyle(){
    return (
      {
        top: this.state._top,
        left: this.state._left,
        position: 'absolute',
       // borderWidth: 2,
       // borderColor: '#ff00ff',
        transform: [
          {scale: this.state._scale},
        ]
      }
    );

  }

  handlePress(evt){
    if(this.props.draggable){
      // no tweening for draggables
      return;
    }

    this._Tweener["bounce"]({
      startScale: 0.95,
      endScale: 1.0,
      friction: 2.5,
    }, {scale: this.state._scale});

    if(this.props.tweenStart == "touch"){
      this.startAnimation();
    }
    else if(this.props.remove){
      this.props.remove((Date.now() - this.props.renderTime) / 1000);
    }

  }

  startAnimation() {
    if(!this.props.tween.repeatable && this._hasTweened){
      return;
    }
    this._hasTweened++;
    const tweenType = this.props.tween.tweenType;
    const tweenOptions = this.props.tween;
    const tweenState = {
      top: this.state._top,
      left: this.state._left,
    }
    this._Tweener[tweenType](tweenOptions, tweenState);
  }

  render() {

    return(

        <Animated.View
          {...this._panResponder.panHandlers}
          style={this.getStyle()}
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



AnimatedSprite.propTypes = {
  coordinates: React.PropTypes.object.isRequired,
  size: React.PropTypes.object.isRequired,
  draggable: React.PropTypes.bool.isRequired,
  character: React.PropTypes.object.isRequired,
  tween: React.PropTypes.object,
};

AnimatedSprite.defaultProps = {
  initialCount: 0,
};

const styles = {
  // character: {
  //   borderWidth: 2,
  //   borderColor: '#00ff00'
  // },
  // animator:{
  //   borderWidth: 2,
  //   borderColor: '#ff00ff',
  // },
};


export default AnimatedSprite;
