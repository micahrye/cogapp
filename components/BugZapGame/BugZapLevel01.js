import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// import characters for AnimatedSprite to use
// import frogCharacter from '../../sprites/frogLite/frogLiteCharacter';
import bugCharacter from '../../sprites/bugLite/bugLiteCharacter';
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import signCharacter from "../../sprites/sign/signCharacter";

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEVEL1A_NUM_TRIALS = 2;
const LEVEL1B_NUM_TRIALS = 2;

class BugZapLevel01 extends React.Component {
  constructor (props) {
    super(props);
    this.character = {style: {opacity: 1}};
    this.loadingContent = false;
    this.bugPressed = false;
    this.characterPos = 500 * this.props.scale.width;
    this.bugStartX = SCREEN_WIDTH/2 - (360 * this.props.scale.width);
    this.rotate = undefined;
    this.characterDirection = 'left';
    this.trialNumber = 1;
    this.directionMaySwitch = false;
    this.fps = 8;
    this.showOtherBugSign = false;
    this.blue = [9];
    this.red = [10];
    this.state = {
      bugTweenOptions: null,
      showBugLeft: true,
      showBugRight: true,
      characterAnimationIndex: this.blue,
      characterTweenOptions: null,
      signTweenOptions: null,
    };
  }

  componentWillMount () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
      if (this.trialNumber > LEVEL1A_NUM_TRIALS) {
        this.directionMaySwitch = true;
        this.signBounceDown();
      }
      if (this.trialNumber > LEVEL1B_NUM_TRIALS) {
        this.bugTapTimeout();
      }
      this.setCharacterHopOn();
    }
    else {
      // first trial, run through all animations once
      // and sign bounces down
      this.signBounceDown();
      this.setCharacterAnimations();
    }
    if (this.directionMaySwitch) {
      this.showOtherBugSign = true;
    }
    this.setCharacterDirection();
    this.setBugTween();
  }

  signBounceDown () {
    this.setState({
      signKey: Math.random(),
      signTweenOptions: {
        tweenType: "bounce-drop",
        startY: -300,
        endY: -10 * this.props.scale.height,
        duration: 2000,
        repeatable: false,
        loop: false,
      },
    });
  }

  setCharacterAnimations () {
    this.loadingContent = true;
    this.character.style = {opacity: 0};
    this.fps = 20;
    this.setState({
      characterAnimationIndex: [1,2,3,4,5,6,9],
    });    // reset characters to default state
    this.setDefaultAnimationState = setTimeout(() => {
      this.fps = 8;
      this.character.style = {opacity: 1};
      this.loadingContent = false;
      this.setState({
        characterAnimationIndex: this.blue,
      });
      this.setCharacterHopOn();
    }, 1500);
  }

  setCharacterDirection () {
    if (this.directionMaySwitch) {
      let direction = Math.floor(Math.random() * 2);
      this.characterDirection = 'left';

      if (direction === 0) {
        this.characterDirection = 'right';
        this.setState({
          characterAnimationIndex: this.red,
        });
        // these are here for when we use the frog character, will be different
        // numbers depending on which direction frog is pointing
        this.characterPos = 500 * this.props.scale.width;
        this.bugStartX = SCREEN_WIDTH/2 + (210 * this.props.scale.width);
        this.rotate = [{rotateY: '180deg'}];
      }
    }
  }

  setBugTween () {
    let endX = 520;

    if (this.characterDirection === 'right') {
      endX = 600;
    }

    this.setState({
      bugTweenOptions: {
        tweenType: "curve-fall",
        // start on their tags
        startXY: [this.bugStartX, 95 * this.props.scale.height],
        // end at character
        endXY: [endX * this.props.scale.width, 460 * this.props.scale.height],
        duration: 1000 * this.props.scale.width,
        loop: false,
      },
    });
  }

  setCharacterHopOn () {
    this.setState({
      characterKey: Math.random(),
      characterTweenOptions: {
        tweenType: "hop",
        startY: SCREEN_HEIGHT,
        yTo: 100 * this.props.scale.height,
        endY: 400 * this.props.scale.height,
        duration: 1000 * this.props.scale.height,
        loop: false,
      },
    });
  }

  bugTapTimeout () {
    // this will change once we have the jumping on/off the lily pad going
    this.characterDissapear = setTimeout (() => {
      this.goToNextTrial();
      clearTimeout(this.characterDissapear);
    }, 2000);
  }


  onTweenFinish (characterUID) {
    if (characterUID === 'bugLeft') {
      this.setState({
        showBugLeft: false,
      });
    }
    else {
      this.setState({
        showBugRight: false,
      });
    }
    this.goToNextTrial();
  }

  goToNextTrial () {
    setTimeout (() => {
      this.props.navigator.replace({
        id: 'NextTrial',
        getId: this.getCurrId,
        trialNumber: this.trialNumber,
      });
    }, 1500);
  }

  getCurrId () {
    return 'BugZapLevel01';
  }

  onBugPress (whichBug) {
    if (this.loadingContent || this.bugPressed) {
      return true;
    }
    this.bugPressed = true;
    clearTimeout(this.characterDissapear);

    if ((whichBug === 'bugLeft' && this.characterDirection === 'left') ||
        (whichBug === 'bugRight' && this.characterDirection === 'right')) {

      this.correctBugTapped(whichBug);
    }
    else {
      this.wrongBugTapped();
    }
  }

  correctBugTapped (whichBug) {
    let index = [0,4,4,5,0];
    let delay = (500 * this.props.scale.width);

    if (whichBug === 'bugLeft') {
      this.refs.bugLeftRef.startTween();
    }
    else {
      this.refs.bugRightRef.startTween();
    }

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.setState({
        characterAnimationIndex: index,
      });
      clearInterval(this.eatInterval);
    }, delay);
  }

  wrongBugTapped () {
    let index = [3,3,3,0];
    let delay = 100;

    this.disgustInterval = setInterval(() => {
      clearInterval(this.disgustInterval);
      this.setState({
        characterAnimationIndex: index,
      });
    }, delay);

    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.goToNextTrial();
    }, 1000);
  }

  render () {
    return (
      <Image
        source={require('../../backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >

      <AnimatedSprite
        key={this.state.characterKey}
        character={omnivoreLite}
        coordinates={{top: 400 * this.props.scale.height,
          left: this.characterPos}}
        size={{
            width: 300 * this.props.scale.width,
            height: 300 * this.props.scale.height,
        }}
        animationFrameIndex={this.state.characterAnimationIndex}
        rotate={this.rotate}
        style={this.character.style}
        fps={this.fps}
        tweenOptions={this.state.characterTweenOptions}
        tweenStart={'auto'}
      />


       <View style={styles.itemContainer}>
          <AnimatedSprite
            key={this.state.signKey}
            character={signCharacter}
            coordinates={{top: -10 * this.props.scale.height, left: SCREEN_WIDTH/2 - (360 * this.props.scale.width)}}
            size={{width: 140 * this.props.scale.width, height: 230 * this.props.scale.height}}
            animationFrameIndex={[0]}
            tweenOptions={this.state.signTweenOptions}
            tweenStart={'auto'}
          />
      </View>

      {this.state.showBugLeft ?
        <AnimatedSprite
          character={bugCharacter}
          ref={'bugLeftRef'}
          characterUID={'bugLeft'}
          coordinates={{top: 75 * this.props.scale.height, left: SCREEN_WIDTH/2 - (370 * this.props.scale.width)}}
          size={{width: 150 * this.props.scale.width, height: 150 * this.props.scale.height}}
          tweenOptions={this.state.bugTweenOptions}
          tweenStart={'fromCode'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          onPress={(characterUID) => this.onBugPress(characterUID)}
          animationFrameIndex={[1]}
        />
      : null}

      {this.showOtherBugSign ?
        <View>
          <View style={styles.itemContainer}>
              <AnimatedSprite
                character={signCharacter}
                coordinates={{top: -10 * this.props.scale.height, left: SCREEN_WIDTH/2 + (210 * this.props.scale.width)}}
                size={{width: 140 * this.props.scale.width, height: 230* this.props.scale.height}}
                animationFrameIndex={[0]}
                tweenOptions={this.state.signTweenOptions}
                tweenStart={'auto'}
              />
          </View>
          {this.state.showBugRight ?
            <AnimatedSprite
              ref={'bugRightRef'}
              characterUID={'bugRight'}
              coordinates={{top: 75 * this.props.scale.height, left: SCREEN_WIDTH/2 + (200 * this.props.scale.width)}}
              size={{width: 150 * this.props.scale.width, height: 150 * this.props.scale.height}}
              character={bugCharacter}
              tweenOptions={this.state.bugTweenOptions}
              tweenStart={'fromCode'}
              onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
              onPress={(characterUID) => this.onBugPress(characterUID)}
              animationFrameIndex={[2]}
            />
          : null}
          </View>
      : null}

  </Image>

  );
  }
}

BugZapLevel01.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};
reactMixin.onClass(BugZapLevel01, TimerMixin);

export default BugZapLevel01;
