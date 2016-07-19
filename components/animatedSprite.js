"use strict";

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Sound from 'react-native-sound';
import Tweener from "./Tweener";

/*TO ANIMATE SPRITES*/
/*
If your character does not need to change its animation state 
  (ie: will always be idling):
      set spriteAnimationKey prop to idle or do not include it as a prop
/*
If you want to change the character's animation state (ex: have it celebrate):
  add a new object to the character file and assign it the array of sprite images
  include spriteAnimationKey as a prop and assign it the name of the key of 
    the new object in the character file
    /*If you want the new animation to continue looping instead of returning to idle:
        add loopAnimation as a prop and set it to true

/*TO MAKE CHARACTER TWEEN*/
/*
  Include tween as a prop and pass it settings for the tween
  Include tweenStart as a prop and assign it either "touch" or "auto"

/*TO DO SOMETHING ON PRESS*/
/*
  Include onPress as a prop and assign it a function to do whatever you need

/*TO GET COORDINATES AFTER DRAG*/
/*
  Include draggedTo as a prop and assign it a function to handle 
    the coordinates passed up

/*TO RECORD TIME SINCE CHARACTER MOUNTED*/
/*
  Include timeSinceMounted as a prop and assign it a function to handle 
    number of seconds passed up
*/

class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      animate: false,
      _scale: new Animated.Value(1),
      _top: new Animated.Value(props.coordinates.top),
      _left: new Animated.Value(props.coordinates.left),
      _rotation: new Animated.Value(0),
      _width: props.size.width,
      _height: props.size.height,
    };

    this.character = undefined;
    this._charactertyles =  {};
    this._initialLeft = this.state._left._value;
    this._initialLefTop = this.state._top._value;
    this._panResponder = {};

    this._animation = this.props.character;
    this._animationKey = 'idle';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    this.idleAnimationInterval = undefined;
    this.otherAnimationInterval = undefined;

    this._Tweener = Tweener();
    this.renderTime = 0;
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

    this._previousLeft =  this._initialLeft;
    this._previousTop = this._initialLefTop;
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
    // default to idle animation if no spriteAnimationKey prop provided
    if(this.props.spriteAnimationKey === 'idle' || this.props.spriteAnimationKey === undefined){
      this.startIdleAnimation();
    }
    else{
      this.startOtherAnimation(this.props.spriteAnimationKey);
    }
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this._characterStyles)

    if(this.props.tweenStart == "auto"){
      this.startTween();
    }

    this.renderTime = Date.now();
  }

  componentWillUnmount(){
    // Make sure to clear any intervals that have been set.
    clearInterval(this.idleAnimationInterval);
    clearInterval(this.otherAnimationInterval);
  }

  startIdleAnimation(){
    // NOTE: maybe make separate case for when idle animation is only one frame
    this._animationKey = 'idle';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.idleAnimationInterval);
    this.idleAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }
      this.setState({animate: true});
    }, 100);
  }

  startOtherAnimation(animationKey){
    this._animationKey = animationKey;
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.otherAnimationInterval);

    this.otherAnimationInterval = setInterval(()=>{
        this.frameIndex++;
        if(this.props.loopAnimation){ // continue looping animation
          if(this.frameIndex > this.numFrames){
            this.frameIndex = 0;
          }
          this.setState({animate: true});
        }
        else{ // run once and go back to idle
          if(this.frameIndex > this.numFrames){
            clearInterval(this.otherAnimationInterval);
            this.startIdleAnimation();
            return;
          }
          else{
            this.setState({animate: true});
          }
        }
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

    if(this.props.draggedTo){
      this.props.draggedTo(this._characterStyles.style.left, this._characterStyles.style.top);
    }
  }

  getStyle(){

    let ro = this.state._rotation.interpolate({
      inputRange: [0,100],
      outputRange: ['0deg','180deg'],
    });

    return (
      {
        top: this.state._top,
        left: this.state._left,
        position: 'absolute',
        // borderWidth: 2,
        // borderColor: '#ff00ff',
        transform: [{rotate: ro},
                    {scale: this.state._scale}],
      }
    );

  }

  handlePress(evt){
    if(this.props.onPress){
      this.props.onPress();
    }

    if(this.props.draggable){
      return;
    }

    if(this.props.soundOnTouch){
      let tile = new Sound('tile.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        } else { // loaded successfully
          console.log('sound did load');
          tile.play();
        }
      });
    }

    if(this.props.tweenStart === "touch"){
      this.startTween();
    }

    if(this.props.timeSinceMounted){
      this.props.timeSinceMounted(
        this.props.spriteKey,
        (Date.now() - this.renderTime ) / 1000
      );
    }
  }

  startTween() {
    const tweenType = this.props.tween.tweenType;
    const tweenOptions = this.props.tween;
    const tweenState = {
      top: this.state._top,
      left: this.state._left,
      scale: this.state._scale,
      rotation: this.state._rotation,
    }
    this._Tweener[tweenType](tweenOptions, tweenState);
  }

  render() {

    return(
        <Animated.View
          {...this._panResponder.panHandlers}
          style={this.getStyle()}
        >

          <TouchableWithoutFeedback
            onPress={ (evt) => this.handlePress(evt) }>
            <Animated.Image
              source={this._animation[this._animationKey][this.frameIndex]}
              style={{
                width: this.state._width,
                height: this.state._height,
              }}/>
          </TouchableWithoutFeedback>

        </Animated.View>
    );
  }
}

// TODO: add in any props that should be required.
AnimatedSprite.propTypes = {
  coordinates: React.PropTypes.object.isRequired,
  size: React.PropTypes.object.isRequired,
  draggable: React.PropTypes.bool.isRequired,
  character: React.PropTypes.object.isRequired,
  tween: React.PropTypes.object,
  tweenStart: React.PropTypes.string,
  soundOnTouch: React.PropTypes.bool,
  spriteAnimationKey: React.PropTypes.string,
  loopAnimation: React.PropTypes.bool,
  spriteKey: React.PropTypes.number,
  //onPress
  //timeSinceMounted
  //draggedTo
};

AnimatedSprite.defaultProps = {
  initialCount: 0,
};


export default AnimatedSprite;
