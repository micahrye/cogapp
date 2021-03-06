'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  // Alert,
  // PanResponder,
  StyleSheet,
  View,
  Image,
  // processColor,
} = ReactNative;

import _ from 'lodash';

const SCREEN_HEIGHT = require('Dimensions').get('window').height;

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
// import frogCharacter from "../../sprites/frog/frogCharacter";
import goatLiteCharacter from '../../sprites/goatLite/goatLiteCharacter'
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import mammalLiteCharacter from '../../sprites/mammalLite/mammalLiteCharacter';
import frogLiteCharacter from '../../sprites/frogLite/frogLiteCharacter';
import lever from '../../sprites/lever/leverCharacter';
import chute from '../../sprites/chute/chuteCharacter';
import shallowCompare from "react-addons-shallow-compare";
import randomstring from 'random-string';
import {
  randomGoatAnimationSequece,
  randomOmnivoreAnimationSequence,
  randomMammalAnimationSequence,
  randomFrogAnimationSequence,
 } from './util';


class AnimateTest extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      goatAnimationIndex: [0],
      omnivoreAnimationIndex: [0],
      mammalAnimationIndex: [0],
      frogAnimationIndex: [0],
    };
    this.characterUIDs = {};
    this.animations = ['default', 'walk', 'eat', 'disgust'];
    this.setDefaultAnimationState = null;
    this.scale = this.props.scale;

    this.tweenOptions = {
      tweenType: "sine-wave",
      startXY: [700 * this.scale.width, SCREEN_HEIGHT - 69],
      xTo: [700 * this.scale.width],
      yTo: [10],
      duration: 2000,
      loop: false,
    };
  }

  componentWillMount () {
    // Cycle through all frames of each character so that they
    // are in memory and we do not get flashing behavior.
    this.setState({
      omnivoreAnimationIndex: [0,1,2,3,4,5,6,7],
      goatAnimationIndex: [0,1,2,3,4,5,6,7],
      mammalAnimationIndex: [0,1,2,3,4,5,6],
      frogAnimationIndex: [0,1,2,3,4,5],
    });    // reset characters to default state
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        omnivoreAnimationIndex: [0],
        goatAnimationIndex: [0],
        mammalAnimationIndex: [0],
        frogAnimationIndex: [0],
      });
    }, 1500);

    this.characterUIDs = {
      goat: randomstring({ length: 7 }),
      omnivore: randomstring({ length: 7 }),
      dog: randomstring({ length: 7 }),
      frog: randomstring({ length: 7 }),
    };


  }

  componentDidMount () {
    // console.warn('test mounted');
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (shallowCompare(this, nextProps, nextState));
  }

  componentWillUnmount () {
    clearTimeout(this.setDefaultAnimationState);
  }

  onAnimationFinish (animationKey) {
    //
  }

  getFrameIndex (animationKey, frameIndex) {
    if (animationKey === 'eat' && frameIndex === 5) {
      // when tongue has reached bug
    }
  }
  handelOnPress (characterUID) {
    const key = _.invert(this.characterUIDs)[characterUID];
    switch (key) {
      case 'goat': {
        const animationSeq = randomGoatAnimationSequece();
        // console.warn(animationSeq);
        this.setState({goatAnimationIndex: animationSeq});
        break;
      }
      case 'omnivore': {
        const animationSeq = randomOmnivoreAnimationSequence();
        this.setState({omnivoreAnimationIndex: animationSeq});
        break;
      }
      case 'dog': {
        const animationSeq = randomMammalAnimationSequence();
        this.setState({mammalAnimationIndex: animationSeq});
        break;
      }
      case 'frog': {
        const animationSeq = randomFrogAnimationSequence();
        this.setState({frogAnimationIndex: animationSeq});
        break;
      }
      default: {
        break;
      }
    }
  }

  handelPressIn () {
    // console.debug('pressIn');
  }

  handelPressOut () {
    // console.debug('pressOut');
  }

  checkLocation (x, y) {
    // console.warn(`x = ${x}, y = ${y}`);
  }
  tweenStopped () {}

  render () {
    // console.warn('render');
    return (

      <View
        style={styles.container}>
        <Image
          source={require('../../backgrounds/Game_5_Background_1280.png')}
          style={styles.backgroundImage}
        />

        <AnimatedSprite
          character={goatLiteCharacter}
          characterUID={this.characterUIDs.goat}
          draggable={true}
          currentLocation={(x, y) => this.checkLocation(x, y)}
          onPress={(uid) => this.handelOnPress(uid)}
          onPressIn={() => this.handelPressIn()}
          onPressOut={() => this.handelPressOut()}
          animationFrameIndex={this.state.goatAnimationIndex}
          loopAnimation={true}
          coordinates={{top: 300 * this.scale.height, left: 80 * this.scale.width}}
          size={{ width: 300 * this.scale.width,height: 252 * this.scale.height}}
          onAnimationFinish={(animationKey) => {
            this.onAnimationFinish(animationKey);
          }}
          getFrameIndex={(animationKey, frameIndex) => {
            this.getFrameIndex(animationKey, frameIndex);
          }}
        />

        <AnimatedSprite
          character={omnivoreLite}
          characterUID={this.characterUIDs.omnivore}
          onPress={(uid) => this.handelOnPress(uid)}
          animationFrameIndex={this.state.omnivoreAnimationIndex}
          loopAnimation={true}
          coordinates={{top: 300* this.scale.height, left: 400 * this.scale.width}}
          size={{ width: 300* this.scale.width,height: 285 * this.scale.height}}
          onAnimationFinish={(animationKey) => {
            this.onAnimationFinish(animationKey);
          }}
          getFrameIndex={(animationKey, frameIndex) => {
            this.getFrameIndex(animationKey, frameIndex);
          }}
        />

      <AnimatedSprite
        character={mammalLiteCharacter}
        characterUID={this.characterUIDs.dog}
        onPress={(uid) => this.handelOnPress(uid)}
        animationFrameIndex={this.state.mammalAnimationIndex}
        loopAnimation={true}
        tweenOptions={this.tweenOptions}
        tweenStart={'auto'}
        stopAutoTweenOnPressIn={true}
        onTweenStopped={() => this.tweenStopped()}
        coordinates={{top: 300 * this.scale.height, left: 700 * this.scale.width}}
        size={{ width: 174* this.scale.width,height: 285 * this.scale.height}}
        onAnimationFinish={(animationKey) => {
          this.onAnimationFinish(animationKey);
        }}
        getFrameIndex={(animationKey, frameIndex) => {
          this.getFrameIndex(animationKey, frameIndex);
        }}
      />

      <AnimatedSprite
        character={lever}
        characterUID={randomstring({ length: 7 })}
        animationFrameIndex={[0]}
        loopAnimation={true}
        coordinates={{top: 20* this.scale.height, left: 0 }}
        size={{ width: 213* this.scale.width,height: 189* this.scale.height }}
        onAnimationFinish={(animationKey) => {
          this.onAnimationFinish(animationKey);
        }}
        getFrameIndex={(animationKey, frameIndex) => {
          this.getFrameIndex(animationKey, frameIndex);
        }}
      />

      <AnimatedSprite
        character={chute}
        characterUID={randomstring({ length: 7 })}
        animationFrameIndex={[0]}
        loopAnimation={true}
        coordinates={{top: 120* this.scale.height, left: 920 * this.scale.width}}
        size={{ width: 344 * this.scale.width,height: 400 * this.scale.height}}
        onAnimationFinish={(animationKey) => {
          this.onAnimationFinish(animationKey);
        }}
        getFrameIndex={(animationKey, frameIndex) => {
          this.getFrameIndex(animationKey, frameIndex);
        }}
      />

      <AnimatedSprite
        character={frogLiteCharacter}
        characterUID={this.characterUIDs.frog}
        onPress={(uid) => this.handelOnPress(uid)}
        animationFrameIndex={this.state.frogAnimationIndex}
        loopAnimation={true}
        coordinates={{top: 350* this.scale.height, left: 900 * this.scale.width}}
        size={{ width: 271* this.scale.width,height: 300 * this.scale.height}}
        onAnimationFinish={(animationKey) => {
          this.onAnimationFinish(animationKey);
        }}
        getFrameIndex={(animationKey, frameIndex) => {
          this.getFrameIndex(animationKey, frameIndex);
        }}
      />

      </View>
    );
  }
}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: 'blue'
  },
  backgroundImage: {
    flex: 1,
    top: -65,
    height: 800,
    width: 1280,
  },
});

AnimateTest.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default AnimateTest;
