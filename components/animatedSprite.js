import React from 'react';
import {
  Animated,
  PanResponder,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Sound from 'react-native-sound';
import Tweener from './Tweener';

const styles = {
  character: {
    opacity: 1,
  },
};

class AnimatedSprite extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      animate: false,
      scale: new Animated.Value(1),
      top: new Animated.Value(props.coordinates.top),
      left: new Animated.Value(props.coordinates.left),
      rotation: new Animated.Value(0),
      width: props.size.width,
      height: props.size.height,
    };

    this.character = undefined;
    this.refAnimatedImage = undefined;
    this.charactertyles = {};
    this.initialLeft = this.state.left.value;
    this.initialLeftop = this.state.top.value;
    this.panResponder = {};

    this.animation = this.props.character;
    this.animationKey = 'idel';
    this.curType = 'default';
    this.lastType = 'default';
    this.numFrames = this.animation[this.animationKey][this.curType].length-1;
    this.frameIndex = -1;
    this.idelAnimationInterval = undefined;
    this.touchAnimationInterval = undefined;

    this.Tweener = Tweener();
    this.hasTweened = 0;
    this.renderTime = 0;
  }

  componentWillMount () {
    if (this.props.draggable) {
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

  componentDidMount () {
    this.startIdelAnimation();
    // if this character setNativeProps
    this.character && this.character.setNativeProps(this.characterStyles)

    if (this.props.tweenStart == "auto") {
      this.startTween();
    }
    this.renderTime = Date.now();
  }

  componentWillUnmount () {
    // Make sure to clear any intervals that have been set.
    clearInterval(this.idelAnimationInterval);
    clearInterval(this.touchAnimationInterval);
  }

  updateNativeStyles () {
    this.character && this.character.setNativeProps(this.characterStyles);
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

  getStyle () {
    const ro = this.state.rotation.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '180deg'],
    });
    return (
      {
        top: this.state.top,
        left: this.state.left,
        position: 'absolute',
        // borderWidth: 2,
        // borderColor: '#ff00ff',
        transform: [{ rotate: ro },
                    { scale: this.state.scale }],
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

  handlePress () {
    // COMM: why would it be undefind?
    // this.props.key
    if (this.props.onPres) {
      this.props.onPress("frog");
    }

    if (this.animation.touch.default) {
      this.touchSprite();
    }
    this.curType = this.props.changeTouchType(this.lastType);
    this.lastType = this.curType;

    if (this.props.draggable) {
      return;
    }

    if (this.props.soundOnTouch) {
      const tile = new Sound('tile.mp3', Sound.MAINBUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        } else { // loaded successfully
          console.log('sound did load');
          tile.play();
        }
      });
    }

    if (this.props.tweenStart === "touch") {
      this.startTween();
    }

    if (this.props.timeSinceMounted) {
      this.props.timeSinceMounted(this.props.spriteKey,
        (Date.now() - this.renderTime) / 1000);
    }
  }

  touchSprite () {
      // TOOD: rework this
    clearInterval(this.idelAnimationInterval);
    this.startTouchAnimation();
  }

  startTouchAnimation () {
    this.animationKey = 'touch';
    this.numFrames = this.animation[this.animationKey][this.curType].length-1;
    this.frameIndex = -1;
    clearInterval(this.touchAnimationInterval);

    this.touchAnimationInterval = setInterval(() => {
      this.frameIndex++;
      // run once and go back to idel
      if (this.frameIndex > this.numFrames) {
        clearInterval(this.touchAnimationInterval);
        this.startIdelAnimation();
        return;
      } else {
        this.setState({ animate: true });
      }
    }, 100);
  }

  startTween () {
    if (!this.props.tween.repeatable && this.hasTweened) {
      return;
    }
    this.hasTweened++;
    const tweenType = this.props.tween.tweenType;
    const tweenOptions = this.props.tween;
    const tweenState = {
      top: this.state.top,
      left: this.state.left,
      scale: this.state.scale,
      rotation: this.state.rotation,
    }
    this.Tweener[tweenType](tweenOptions, tweenState);
  }

  render() {

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={this.getStyle()}
        ref={(character) => {
          this.character = character;
        }}
      >

        <TouchableWithoutFeedback
          onPress={(evt) => this.handlePress(evt)}
        >
          <Animated.Image
            ref={(ref) => {
              this.refAnimatedImage = ref;
            }}
            source={this.animation[this.animationKey][this.curType][this.frameIndex]}
            style={{
              ...styles.character,
              width: this.state.width,
              height: this.state.height,
            }}
          />
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

export default AnimatedSprite;
