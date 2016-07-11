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
      _rotation: new Animated.Value(0),
      _width: props.size.width,
      _height: props.size.height,
      _opacity: new Animated.Value(1),
    };

    this.character = undefined;
    this.soul = undefined;
    this._characterStyles =  {};
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
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this._characterStyles)

    this.createdAtTime = Date.now();

    if(this.props.tweenStart == "auto"){
      this.startAnimation();
    }
  }

  componentWillUnmount(){
    // Make sure to clear any intervals that have been set.
    clearInterval(this.animationInterval);
  }

  setAnimationInterval(){
    // NOTE: making assumption there is an idel animation. Maybe change if only
    // one frame fro idel don't run interval.
    this.animationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }
      this.setState({animate: true});
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

    if(this.props.draggedTo){
      this.props.draggedTo(this._characterStyles.style.left, this._characterStyles.style.top);
    }
  }

  getStyle(){
    let ro = this.state._rotation.interpolate({
      inputRange: [0,100],
      outputRange: ['0deg','360deg']
    });
    return (
      {
        top: this.state._top,
        left: this.state._left,
        position: 'absolute',
        // borderWidth: 2,
        // borderColor: '#ff00ff',
        opacity: this.state._opacity,
        transform: [
          {scale: this.state._scale},
          {rotate: ro},
        ]
      }
    );

  }

  handlePress(evt){
     if(this.props.draggable){
      return;
    }

    //COMM: why would it be undefind?
    if(this._animation['touch'] !== undefined){
      this.touchSprite();
    }
   


    // put this in an if statement so scale is not being being told to go
    // in 2 different directions simultaneously
    // if (this.props.touchTween.tweenType !== "pulse") {
    //   this._Tweener["bounce"]({
    //     startScale: 0.95,
    //     endScale: 1.0,
    //     friction: 2.5,
    //   }, {scale: this.state._scale});
    //  }

    if(this.props.tweenStart === "touch"){
      this.startAnimation();
    }
    else if(this.props.timeSinceMounted){
      this.props.timeSinceMounted((Date.now() - this.createdAtTime) / 1000);
    }
  }

  touchSprite() {
    console.warn("in touch sprite");
      // TODO: rework this
      clearInterval(this.animationInterval);
      this._animationKey = 'touch';
      this.numFrames = this._animation[this._animationKey].length-1;
      this.frameIndex = 0;
      this.animationInterval = setInterval(()=>{
          this.frameIndex++;
          if(this.frameIndex > this.numFrames){
              clearInterval(this.animationInterval);
              this._animationKey = ['idel'];
              this.frameIndex = 0;
              this.numFrames = this._animation[this._animationKey].length-1;
              this.setAnimationInterval();
              return;
          }else{
            this.setState({animate: true});
          }
      }, 100);

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
      scale: this.state._scale,
      rotation: this.state._rotation,
      opacity: this.state._opacity,
    }
    this._Tweener["Looper"](tweenOptions, tweenState, tweenType);
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
            accessible={false}
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
