"use strict";

import React from 'react';
import {
  Animated,
  PanResponder,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import shallowCompare from "react-addons-shallow-compare";
import randomstring from 'random-string';

import Tweens from "../../Tweens/Tweens";

class AnimatedSprite extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      top: new Animated.Value(props.coordinates.top),
      left: new Animated.Value(props.coordinates.left),
      width: props.size.width,
      height: props.size.height,
      frameIndex: 0,
      tweener: [],
    };

    this.character = this.props.character;
    this.characterStyles =  {};
    this.panResponder = {};
    this.charactertyles =  {};
    this.animationKey = this.props.spriteAnimationKey;
    this.numFrames = this.character[this.animationKey].length-1;
    this.frameIndex = 0;
    this.defaultAnimationInterval = undefined;
    this.animationKeyInterval = undefined;
    this.imageSource = undefined;
    this.fps = 8;
    this.endValues = undefined;
  }

  componentWillMount () {
    if (this.props.draggable) {
      // note that with PanResponder we setNativeProps for performance reasons,
      // as stated by FB.
      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant:(e, gestureState) => {
          this.handlePanResponderGrant(e, gestureState);},
        onPanResponderMove: (e, gestureState) => {
          this.handlePanResponderMove(e, gestureState);},
        onPanResponderRelease: (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);},
        onPanResponderTerminate:
          (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);},
        });
    }
    // used by PanResponder
    this.previousTop = this.state.top._value;
    this.previousLeft =  this.state.left._value;
    this.characterStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
        width: this.state._width,
        height: this.state._height,
      },
    };
    // used by Tweens
    this.tweenablValues = {
      top: this.state.top,
      left: this.state.left,
      scale: this.state.scale,
      // rotateZ: this.state.rotateZ,
      // rotation: this.state.rotation,
    };
  }

  componentDidMount () {
    this.startAnimation();
    // part of PanResponder and drag behavior
    if (this.characterComponentRef) {
      this.characterComponentRef.setNativeProps(this.characterStyles);
    }
    this.renderTime = Date.now();
    if (this.props.tweenStart == "auto" && this.props.tweenOptions != null) {
      this.startTween();
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (shallowCompare(this, nextProps, nextState));
  }

  componentWillUnmount () {
    clearInterval(this.defaultAnimationInterval);
    clearInterval(this.animationKeyInterval);
  }

  updateNativeStyles () {
    this.characterComponentRef && this.characterComponentRef.setNativeProps(this.characterStyles);
  }

  handleStartShouldSetPanResponder (/*e, gestureState*/) {
    return true;
  }

  handleMoveShouldSetPanResponder (/*e, gestureState*/) {
    return true;
  }

  handlePanResponderGrant (/*e, gestureState*/) {
    // do something on grant
  }

  handlePanResponderMove (e, gestureState) {
    this.characterStyles.style.left = this.previousLeft + gestureState.dx;
    this.characterStyles.style.top = this.previousTop + gestureState.dy;
    this.updateNativeStyles();
  }

  handlePanResponderEnd (e, gestureState) {
    // do anything you want onPanResponderRelease
    this.previousLeft += gestureState.dx;
    this.previousTop += gestureState.dy;
    // PanResponder mutates state directly
    this.state.top = this.characterStyles.style.top;
    this.state.left = this.characterStyles.style.left;

    if (this.props.currentLocation) {
      this.props.currentLocation(this.characterStyles.style.left, this.characterStyles.style.top);
    }
  }

  startAnimation () {
    // NOTE: maybe make separate case for when idle animation is only one frame
    //this.animationKey = 'default';
    this.numFrames = this.character[this.animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.defaultAnimationInterval);
    this.defaultAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      const animationLength = this.props.animationFrameIndex.length-1;
      if (this.frameIndex > animationLength) {
        this.frameIndex = 0;
      }
      const index = this.props.animationFrameIndex[this.frameIndex];
      this.setState({ frameIndex: index });
    }, 1000 / this.fps);
  }

  // notify parent that tween has ended
  tweenHasEnded (ended, stopTween) {
    // console.warn('tweenHasEnded HAPPY GO LUCKY');
    // if (this.props.onTweenFinish) {
    //   this.props.onTweenFinish(this.props.spriteKey, stopTween);
    // }
  }

  // pass up the coordinates of character when stopped
  sendStopValues (stopValues) {
    // console.warn('sendStopValues HAPPY GO LUCKY');
    // if (this.props.stopTweenOnTouch) {
    //   this.props.stopTweenOnTouch(stopValues);
    // }
    // else if (this.props.stopTweenOnPressIn) {
    //   this.props.stopTweenOnPressIn(stopValues);
    // }
  }

  startTween () {
    const tweenOptions = this.props.tweenOptions;
    const tweenType = this.props.tweenOptions.tweenType;
    Tweens[tweenType].start(tweenOptions,
      this.tweenablValues,
      (stopValues) => this.sendStopValues(stopValues),
    );
  }

  handlePress (evt) {
    evt.preventDefault();
    if (this.props.onPress) {
      this.props.onPress(this.props.characterUID);
    }
    if (this.props.tweenStart === "touch") {
      this.startTween2();
    }

    // if (this.props.onPress) {
    //   this.props.onPress(this.props.spriteKey);
    // }
    //
    //
    // else if (this.props.stopTweenOnTouch) {
    //   this.stopTween = true;
    //   this.configureTween();
    // }
    //
    // if (this.props.soundOnTouch) {
    //   this._Sound['playSound'](this.props.soundFile);
    // }
    //
    // if (this.props.timeSinceMounted) {
    //   this.props.timeSinceMounted(
    //     this.props.spriteKey,
    //     (Date.now() - this.renderTime ) / 1000
    //   );
    // }
    //
    // if (this.props.draggable) {
    //   return;
    // }
  }

  handlePressIn (evt) {
    evt.preventDefault();
    if (this.props.onPressIn) {
      this.props.onPressIn();
    }

    if (this.props.stopAutoTweenOnPressIn) {
      const tweenType = this.props.tweenOptions.tweenType;
      Tweens[tweenType].stop(this.tweenablValues,
        (ended) => this.tweenHasEnded(ended, this.stopTween),
      );
    }

    // if (this.props.onPressIn) {
    //   this.props.onPressIn(this.props.spriteKey);
    // }

    // if (this.props.stopTweenOnPressIn) {
    //   this.stopTween = true;
    //   this.configureTween();
    // }
  }

  handlePressOut (evt) {
    evt.preventDefault();
    if (this.props.onPressOut) {
      this.props.onPressOut();
    }
  }

  getStyle () {

    return (
      {
        top: this.state.top,
        left: this.state.left,
        position: 'absolute',
      }
    );

  }

  render () {
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={this.getStyle()}
        ref={(character) => {
          this.characterComponentRef = character;
        }}>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={(evt) => this.handlePress(evt)}
          onPressIn={(evt) => this.handlePressIn(evt)}
          onPressOut={(evt) => this.handlePressOut(evt)}>
          <Image
            source={this.character[this.animationKey][this.state.frameIndex]}
            style={{
              width: this.state.width,
              height: this.state.height,
              transform: this.state.rotateY,
            }}
          />
        </TouchableOpacity>
        {this.state.tweener}
      </Animated.View>
    );
  }
}

// TODO: add in any props that should be required.
AnimatedSprite.propTypes = {
  coordinates: React.PropTypes.object.isRequired,
  size: React.PropTypes.object.isRequired,
  character: React.PropTypes.object.isRequired,
  spriteAnimationKey: React.PropTypes.string.isRequired,
  animationFrameIndex: React.PropTypes.array.isRequired,
  characterUID: React.PropTypes.string,
  draggable: React.PropTypes.bool,
  onPress: React.PropTypes.func,
  onPressIn: React.PropTypes.func,
  onPressOut: React.PropTypes.func,
  animationKey: React.PropTypes.string,
  loopAnimation: React.PropTypes.bool,
  timeSinceMounted: React.PropTypes.func,
  currentLocation: React.PropTypes.func,
  tweenStart: React.PropTypes.string,
  // probably should validate tweenOptions, since Tweens.js uses them
  // and expects a certian shape.
  tweenOptions: React.PropTypes.object,
  // note that stopTweenOnPressIn
  stopAutoTweenOnPressIn: React.PropTypes.bool,
};

AnimatedSprite.defaultProps = {
  draggable: false,
  characterUID: randomstring({ length: 7 }),
};


export default AnimatedSprite;
