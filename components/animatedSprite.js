import React from 'react';
import {
  Animated,
  PanResponder,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
//import Sound from 'react-native-sound';
import Tweener from "./Tweener";
import shallowCompare from "react-addons-shallow-compare";
import Soundhandler from './Soundhandler';

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
onPressIn: triggered when user presses down, but before release, passes up a spriteKey
draggedTo: passes up character's coordinates after drag
timeSinceMounted: triggered on press,
  passes up spriteKey and time since character mounted in seconds
stopTweenOnTouch: triggered when tweening character is pressed,
  stops tween, and passes up an array containing current x, y coordinates
onTweenFinish: is triggered when a tween has finished,
  passes up spriteKey of character whose tween ended
onAnimationFinish: is triggered when 'other' animation has finished,
  passes up current spriteAnimationKey
getFrameIndex: passes up spriteAnimationKey and current frame of animation
*/

class AnimatedSprite extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      animate: false,
      _scale: new Animated.Value(1),
      _top: new Animated.Value(props.coordinates.top),
      _left: new Animated.Value(props.coordinates.left),
      _rotateZ: new Animated.Value(0),
      _width: props.size.width,
      _height: props.size.height,
      //_transform: props.rotate,
      _rotateY: props.rotate,
      _frameIndex: -1,
      _tweener: [],
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

    this._Sound = Soundhandler();
    this.renderTime = 0;
    this.fps = 10;
    this.endValues = undefined;
  }



  componentWillMount() {
    if(this.props.draggable){
      // note that with PanResponder we setNativeProps for performance reasons,
      // as stated by FB.
      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => {
          this.handlePanResponderGrant(e, gestureState);
        },
        onPanResponderMove: (e, gestureState) => {
          this.handlePanResponderMove(e, gestureState);
        },
        onPanResponderRelease: (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);
        },
        onPanResponderTerminate: (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);
        },
      });
    }

    this.previousLeft = this.initialLeft;
    this.previousTop = this.initialLeftop;
    this.characterStyles = {
      style: {
        left: this.previousLeft,
        top: this.previousTop,
        width: this.state.width,
        height: this.state.height,
      },
    };
  }

  componentDidMount() {
    if(this.props.fps){
      this.fps = this.props.fps;
    }

    // default to idle animation if no spriteAnimationKey prop provided
    if (this.props.spriteAnimationKey === 'default' || this.props.spriteAnimationKey === undefined){
      this.startDefaultAnimation();
    }
    else {
      this.startOtherAnimation(this.props.spriteAnimationKey);
    }
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this.characterStyles)

    if (this.props.tweenStart == "auto" && this.props.tween != null) {
      this.configureTween();
    }

    if(this.props.sound){
      this._Sound['playSound'](this.props.soundFile);
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
      // send up frameIndex to parent
      if(this.props.getFrameIndex){
        this.props.getFrameIndex(this.props.spriteAnimationKey, this.frameIndex);
      }
      if(this.frameIndex > this.numFrames){
        // continue looping animation
        if(this.props.loopAnimation){
            this.frameIndex = 0;
        }
        else{ // run once and go back to idle
          clearInterval(this.otherAnimationInterval);
          this.startDefaultAnimation();
          if(this.props.onAnimationFinish){
            // notify parent animation has ended
            this.props.onAnimationFinish(this.props.spriteAnimationKey)
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

  handleStartShouldSetPanResponder () {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  handleMoveShouldSetPanResponder () {
    return true;
  }

  // handlePanResponderGrant (e, gestureState) {
    // do something on grant
  // }

  handlePanResponderMove (e, gestureState) {
    this.characterStyles.style.left = this.previousLeft + gestureState.dx;
    this.characterStyles.style.top = this.previousTop + gestureState.dy;
    this.updateNativeStyles();
  }

  handlePanResponderEnd (e, gestureState) {
    // do anything you want onPanResponderRelease
    this.previousLeft += gestureState.dx;
    this.previousTop += gestureState.dy;
    this.state.top = this.characterStyles.style.top;
    this.state.left = this.characterStyles.style.left;

    if (this.props.draggedTo) {
      this.props.draggedTo(this.characterStyles.style.left, this.characterStyles.style.top);
    }
  }

  getStyle(){

    let ro = this.state._rotateZ.interpolate({
      inputRange: [0,100],
      outputRange: ['0deg','180deg'],
    });
    return (
      {
        top: this.state.top,
        left: this.state.left,
        position: 'absolute',
        // borderWidth: 2,
        // borderColor: '#ff00ff',
        transform: [//{rotateY: this.state._rotateY},
                    {rotateZ: ro},
                    {scale: this.state._scale}],
      }
    );
  }

  startIdelAnimation () {
    // NOTE: making assumption there is an idel animation. Maybe change if only
    // one frame fro idel don't run interval.
    this.animationKey = 'idel';
    this.curType = 'default';
    this.numFrames = this.animation[this.animationKey][this.curType].length-1;
    this.frameIndex = -1;
    clearInterval(this.idelAnimationInterval);
    this.idelAnimationInterval = setInterval(() => {
      this.frameIndex++;
      if (this.frameIndex > this.numFrames) {
        this.frameIndex = 0;
      }
      this.setState({ animate: true });
    }, 100);
  }

  handlePress(evt){
    if(this.props.onPress){
      this.props.onPress(this.props.spriteKey);
    }
    this.curType = this.props.changeTouchType(this.lastType);
    this.lastType = this.curType;

    if(this.props.tweenStart === "touch"){
      this.configureTween();
    }

    else if(this.props.stopTweenOnTouch){
      this.stopTween = true;
      this.configureTween();
    }

    if(this.props.soundOnTouch){
      this._Sound['playSound'](this.props.soundFile);
    }

    if (this.props.timeSinceMounted) {
      this.props.timeSinceMounted(this.props.spriteKey,
        (Date.now() - this.renderTime) / 1000);
    }

    if(this.props.draggable){
      return;
    }
  }

  configureTween () {
    let stopTween = false;
    if (this.stopTween) {
      stopTween = true;
    }
    const tweenType = this.props.tween.tweenType;
    const tweenOptions = this.props.tween;
    const tweenState = {
      top: this.state._top,
      left: this.state._left,
      scale: this.state._scale,
      rotateZ: this.state._rotateZ,
      // rotation: this.state._rotation,
    }


    let tweener = [];

    tweener.push(
      <Tweener
        key={Math.random()}
        type={tweenType}
        options={tweenOptions}
        state={tweenState}
        stop={stopTween}
        onTweenFinish={(ended) => this.tweenHasEnded(ended, this.stopTween)} // whether it just ended, or was stopped
        stopValues={(stopValues) => this.sendStopValues(stopValues)}
      />
    );

    this.setState({
      _tweener: tweener,
    });

  }

  // pass up the coordinates of character when stopped
  sendStopValues(stopValues){
    if (this.props.stopTweenOnTouch) {
      this.props.stopTweenOnTouch(stopValues);
    }
    else if (this.props.stopTweenOnPressIn) {
      this.props.stopTweenOnPressIn(stopValues);
    }
  }

  // notify parent that tween has ended
  tweenHasEnded (ended, stopTween) {
    if(this.props.onTweenFinish){
      this.props.onTweenFinish(this.props.spriteKey, stopTween);
    }
  }

  handlePressIn () {
    if (this.props.onPressIn) {
      this.props.onPressIn(this.props.spriteKey);
    }

    if (this.props.stopTweenOnPressIn) {
      this.stopTween = true;
      this.configureTween();
    }
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
            onPress={ (evt) => this.handlePress(evt) }
            onPressIn={(evt) => this.handlePressIn(evt)}>
            <Image
              ref={(ref) => {
                this.refAnimatedImage = ref;
              }}
              source={this._animation[this._animationKey][this.state.frameIndex]}
              style={{
                width: this.state._width,
                height: this.state._height,
                transform: this.state._rotateY,
              }}/>
          </TouchableOpacity>

          {this.state._tweener}

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
  rotate: React.PropTypes.array,
  //onPress
  //timeSinceMounted
  //draggedTo
};

AnimatedSprite.defaultProps = {
  initialCount: 0,
};


export default AnimatedSprite;
