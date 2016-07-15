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
    this.refAnimatedImage = undefined;
    this._charactertyles =  {};
    this._initialLeft = this.state._left._value;
    this._initialLefTop = this.state._top._value;
    this._panResponder = {};

    this._animation = this.props.character;
    this._animationKey = 'idel';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    this.idelAnimationInterval = undefined;
    this.touchAnimationInterval = undefined;

    this._Tweener = Tweener();
    this._hasTweened = 0;
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
    this.startIdelAnimation();
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this._characterStyles)

    if(this.props.tweenStart == "auto"){
      this.startTween();
    }
    this.renderTime = Date.now();
  }

  componentWillUnmount(){
    // Make sure to clear any intervals that have been set.
    clearInterval(this.idelAnimationInterval);
  }

  startIdelAnimation(){
    // NOTE: making assumption there is an idel animation. Maybe change if only
    // one frame fro idel don't run interval.
    this._animationKey = ['idel'];
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.idelAnimationInterval);
    this.idelAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }
      this.setState({animate: true});
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
    const touchType = this.props.changeTouchType();
    console.warn(`mememeem: ${touchType}`); 
    // COMM: why would it be undefind?
    if(this._animation['touch'] !== undefined){
      this.touchSprite();
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

  touchSprite() {
      // TOOD: rework this
      clearInterval(this.idelAnimationInterval);
      this.startTouchAnimation();
  }

  startTouchAnimation(){
    this._animationKey = 'touch';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.touchAnimationInterval);

    this.touchAnimationInterval = setInterval(()=>{
        this.frameIndex++;
        // run once and go back to idel
        if(this.frameIndex > this.numFrames){
          clearInterval(this.touchAnimationInterval);
          this.startIdelAnimation();
          return;
        }else{
          this.setState({animate: true});
        }
    }, 100);
  }

  startTween() {
    if(!this.props.tween.repeatable && this._hasTweened){
      return;
    }
    this._hasTweened++;
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
          ref={(character) => {
            this.character = character;
          }}
        >

          <TouchableWithoutFeedback
            onPress={ (evt) => this.handlePress(evt) }>
            <Animated.Image
              ref={(ref) => {
                this.refAnimatedImage = ref;
              }}
              source={this._animation[this._animationKey][this.frameIndex]}
              style={{
                ...styles.character,
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
  soundOnTouch: React.PropTypes.bool,
};

AnimatedSprite.defaultProps = {
  initialCount: 0,
};

const styles = {
  character: {
    opacity: 1,
  }
 };

export default AnimatedSprite;
