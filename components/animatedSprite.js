"use strict";

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';
import Tweener from "./Tweener";
import shallowCompare from "react-addons-shallow-compare";

/*****PROPS LIST*****/
/*Required:
  character: object, at least one array of images with key 'default'
  coordinates: object, top and left coordinates
  size: object, width and height measurments

/*Optional:
draggable: bool, whether object is draggable
spriteAnimationKey: string, takes name of the key you want to use in character file
    if not included: defaults to 'default', startIdleAnimation automatically runs
    (change to a different value to switch animation)
loopAnimation: bool, whether to loop animation given in spriteAnimationKey
    ('default' animation always looped as default)
tween: object, takes in tween settings
tweenStart: string, takes either "touch" or "auto"
spriteKey: object, unique key for the character
soundOnTouch: bool, play sound?
rotate: array, takes a style transform value
fps: object, how many frames per second to run the animations at
  if not included: defaults to 10

/*Functions:
onPress: passes up spriteKey
draggedTo: passes up character's coordinates after drag
timeSinceMounted: passes up spriteKey and time since character mounted in seconds
onAnimationFinish: is triggered when 'other' animation has finished, passes up
  current spriteAnimationKey
*/

class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      animate: false,
      //_scale: new Animated.Value(1),
      _top: new Animated.Value(props.coordinates.top),
      _left: new Animated.Value(props.coordinates.left),
      //_rotation: new Animated.Value(0),
      _width: props.size.width,
      _height: props.size.height,
      _transform: props.rotate,
      _frameIndex: -1,
    };

    this.character = undefined;
    this.refAnimatedImage = undefined;
    this._charactertyles =  {};
    this._initialLeft = this.state._left._value;
    this._initialLefTop = this.state._top._value;
    this._panResponder = {};

    this._animation = this.props.character;
    this._animationKey = 'default';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    this.defaultAnimationInterval = undefined;
    this.otherAnimationInterval = undefined;

    this._Tweener = Tweener();
    this.renderTime = 0;
    this.fps = 10;
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
        transform: this.state._transform,
      },
    };
  }

  componentDidMount() {
    if(this.props.fps){
      this.fps = this.props.fps;
    }

    // default to idle animation if no spriteAnimationKey prop provided
    if(this.props.spriteAnimationKey === 'default' || this.props.spriteAnimationKey === undefined){
      this.startDefaultAnimation();
    }
    else{
      this.startOtherAnimation(this.props.spriteAnimationKey);
    }
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this._characterStyles)

    if(this.props.tweenStart == "auto"){
      this.configureTween();
    }

    this.renderTime = Date.now();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (shallowCompare(this, nextProps, nextState));
  }


  componentWillUnmount(){
    // Make sure to clear any intervals that have been set.
    clearInterval(this.defaultAnimationInterval);
    clearInterval(this.otherAnimationInterval);
  }

  startDefaultAnimation(){
    // NOTE: maybe make separate case for when idle animation is only one frame
    this._animationKey = 'default';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.defaultAnimationInterval);
    this.defaultAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }
      this.setState({frameIndex: this.frameIndex});
    }, 1000 / this.fps);
  }

  startOtherAnimation(animationKey){
    this._animationKey = animationKey;
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.otherAnimationInterval);

    this.otherAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.props.getFrameIndex){ // send up frameIndex to parent
        this.props.getFrameIndex(this.props.spriteAnimationKey, this.frameIndex);
      }
      if(this.frameIndex > this.numFrames){
        if(this.props.loopAnimation){ // continue looping animation
            this.frameIndex = 0;
        }
        else{ // run once and go back to idle
          clearInterval(this.otherAnimationInterval);
          this.startDefaultAnimation();
          if(this.props.onAnimationFinish){
            this.props.onAnimationFinish(this.props.spriteAnimationKey) // notify parent animation has ended
          }
          return;
        }
      }
      this.setState({frameIndex: this.frameIndex});
    }, 1000 / this.fps);
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

    // let ro = this.state._rotation.interpolate({
    //   inputRange: [0,100],
    //   outputRange: ['0deg','180deg'],
    // });

    return (
      {
        top: this.state._top,
        left: this.state._left,
        position: 'absolute',
        // borderWidth: 2,
        // borderColor: '#ff00ff',
        // transform: [{rotate: ro},
        //             {scale: this.state._scale}],
        transform: this.state._transform,
      }
    );

  }

  handlePress(evt){
    if(this.props.onPress){
      this.props.onPress(this.props.spriteKey);
    }

    if(this.props.tweenStart === "touch"){
      this.configureTween();
    }

    else if(this.props.tween.stopTweenOnTouch){
      this.stopTween = true;
      let stopValues = this.configureTween();
      this.props.tween.stopTweenOnTouch(stopValues);
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

    if(this.props.timeSinceMounted){
      this.props.timeSinceMounted(
        this.props.spriteKey,
        (Date.now() - this.renderTime ) / 1000
      );
    }

    if(this.props.draggable){
      return;
    }
  }

  configureTween() {
    let stopTween = false;
    if(this.stopTween){
      stopTween = true;
    }
    const tweenType = this.props.tween.tweenType;
    const tweenOptions = this.props.tween;
    const tweenState = {
      top: this.state._top,
      left: this.state._left,
      // scale: this.state._scale,
      // rotation: this.state._rotation,
    }
    let stopValues = this._Tweener[tweenType](tweenOptions, tweenState, stopTween);
    return stopValues;
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
            hitSlop={this.props.hitSlop}
            onPress={ (evt) => this.handlePress(evt) }>
            <Image
              ref={(ref) => {
                this.refAnimatedImage = ref;
              }}
              source={this._animation[this._animationKey][this.state.frameIndex]}
              style={{
                width: this.state._width,
                height: this.state._height,
              }}/>
          </TouchableOpacity>

        </Animated.View>
    );
  }
}

// TODO: add in any props that should be required.
AnimatedSprite.propTypes = {
  coordinates: React.PropTypes.object.isRequired,
  size: React.PropTypes.object.isRequired,
  character: React.PropTypes.object.isRequired,
  draggable: React.PropTypes.bool,
  tween: React.PropTypes.object,
  tweenStart: React.PropTypes.string,
  soundOnTouch: React.PropTypes.bool,
  spriteAnimationKey: React.PropTypes.string,
  loopAnimation: React.PropTypes.bool,
  spriteKey: React.PropTypes.number,
  hitSlop: React.PropTypes.object,
  //onPress
  //timeSinceMounted
  //draggedTo
};

AnimatedSprite.defaultProps = {
  initialCount: 0,
};


export default AnimatedSprite;
