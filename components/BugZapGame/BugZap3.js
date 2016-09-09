import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

//import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import lightbulbCharacter from '../../sprites/lightbulb/lightbulbCharacter';

import styles from "./BugZapStyles";
import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const NUM_TRIALS = 3;
const BUG_IDLE_CATCH_DURATION = 1500; // how long bug is catchable


class BugZap3 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      blackoutScreen: [],
      spotLightFlash: [],
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      bulbSpriteAnimationKey: 'default',
      bugTweenSettings: {},
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      bulbKey: 3,
      showBug: false,
      bulbTweenSettings: {
        tweenType: "bounce-drop",
        startY: -200,
        endY: -80,
        duration: 2000,
        loop: false,
      },
      sound: false,
    };
    this.bugSide = undefined;
    this.tweenAway = {};
    this.timeoutBlackout = undefined;
    this.timeoutSpotlight = undefined;
    this.timeoutRemoveSpotlight = undefined;
    this.timeoutRemoveBlackout = undefined;
    this.timeoutFlyAway = undefined;
    this.trialNumber = 1;
    this.loopAnimation = true;
    this.noMoreFrogTap = false;
  }

  componentWillMount () {
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
  }

  componentDidMount () {
    this.timeoutBulbOff = setTimeout(()=>{
      this.bulbOff();
    }, 2500);
    this.configureTweens();
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutBlackout);
    clearTimeout(this.timeoutSpotlight);
    clearTimeout(this.timeoutRemoveSpotlight);
    clearTimeout(this.timeoutRemoveBlackout);
    clearTimeout(this.timeoutFlyAway);
    clearTimeout(this.timeoutBulbOff);
  }

  // bug either appears on the left or the right
  configureTweens () {
    let xStart = undefined;
    let yStart = 220 * this.props.scale.height;
    const sideChoice = Math.random();
    if (sideChoice < .5) {
      this.bugSide = 'left';
      xStart = 380 * this.props.scale.width;
    } else {
      this.bugSide = 'right';
      xStart = 680 * this.props.scale.width;
    }

    // tween offscreen
    this.tweenAway = {
      tweenType: "sine-wave",
      startXY: [xStart, yStart],
      xTo: [-150],
      yTo: [50, yStart, 50],
      duration: 2000,
      loop: false,
    };

    this.setState({
      // idle tween
      bugTweenSettings:
      {
        tweenType: "sine-wave",
        startXY: [xStart, yStart],
        xTo: [xStart],
        yTo: [yStart],
        duration: 2000,
        loop: false,
      },
    });
  }

  // lightbulb turns off
  bulbOff () {
    this.setState({
      bulbSpriteAnimationKey: 'off',
      bulbKey: Math.random(),
      bulbTweenSettings: {
        tweenType: 'bounce-drop',
        startY: -80,
        endY: -80,
        duration: 0,
        loop: false,
      },
      sound: true,
    });
    this.timeoutBlackout = setTimeout(() => {
      this.setBlackout();
    }, 500);
  }

  // screen goes black
  setBlackout () {
    let blackout = [];
    blackout.push(<View key={0} style={styles.blackout} />);
    this.setState({blackoutScreen: blackout});
    this.timeoutSpotlight = setTimeout(() => {
      this.flashSpotLight();
    }, 1000);
  }

  // spotlight is flashed briefly after blackout
  flashSpotLight () {
    let spotLight = [];
    // average is 1 second
    let timeToRemoveBlackout = Math.random() * 2000;
    spotLight.push(<View key={0} style={this.getSpotLightStyle()} />);
    this.setState({spotLightFlash: spotLight});
    this.timeoutRemoveSpotlight = setTimeout ( () => {
      this.setState({spotLightFlash: []});
      // spotlight dissapears just before blackout does
      this.timeoutRemoveBlackout = setTimeout ( () => {
        this.removeBlackout();
      }, timeToRemoveBlackout);
    }, 500);
  }

  // screen goes back to normal and bug appears
  removeBlackout () {
    this.setState({
      blackoutScreen: [],
      showBug: true,
      bugSpriteAnimationKey: 'idle',
    });
    this.timeoutFlyAway = setTimeout(()=>{
      this.bugFlyAway();
      this.frogDisgust(0);
      this.frogDisgust(1);
    }, BUG_IDLE_CATCH_DURATION);
  }

  bugFlyAway () {
    this.loopAnimation = false;
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'startFly',
      bugTweenSettings: this.tweenAway,
    });
    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial();
    }, 2000);
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey, frog) {
    if (animationKey === "splat") {
      this.setState({showBug: false});
    }
    else if (animationKey === 'eat') {
      this.frogCelebrate(frog);
    }
    else if (animationKey === 'celebrate') {
      this.timeoutNextTrial = setTimeout(() => {
        this.goToNextTrial();
      }, 1000);
    }
  }

  frogTap = (frog) => {
    if (this.noMoreFrogTap) {
      return;
    }
    if (this.state.bugSpriteAnimationKey === 'idle' && this.state.showBug) {
      if (this.bugSide === 'right') { // celebrate if correct side and bug isn't already eaten
        if (frog === 0) {
          this.correctFrogTapped(frog);
        } else {
          this.wrongFrogTapped(frog);
        }
      } else { // bug landed on left side
        if (frog === 0) {
          this.wrongFrogTapped(frog);
        } else {
          this.correctFrogTapped(frog);
        }
      }
    }
  }

  // bug splats and is hidden, frog celebrates
  correctFrogTapped (frog) {
    this.frogEat(frog);
    clearTimeout(this.timeoutFlyAway); // so that frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped (frog) {
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
  }

  // indicates which frame the animation is currently on
  getFrameIndex (animationKey, frameIndex) {
    if (animationKey === 'eat' && frameIndex === 5) {
      this.bugSplat(); // when tongue has reached bug
    }
  }

  bugSplat () {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'splat',
    });
    this.loopAnimation = false;
  }

  frogEat (frog) {
    if (frog === 0) {
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'eat'});
    } else {
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'eat'});
    }
    this.noMoreFrogTap = true;
  }

  frogCelebrate (frog) {
    if (frog === 0) {
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    } else {
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
  }

  frogDisgust (frog) {
    if (frog === 0) {
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'disgust'});
    } else {
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'disgust'});
    }
  }

  /*
  // go to next level
  nextLevelBtn = () => {
    this.props.navigator.replace({
      id: 'GameTwo',
    });
  }
  */

  goToNextTrial () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
      if (this.trialNumber === NUM_TRIALS) {
        this.goToNextLevel();
        return;
      }
    }
    this.props.navigator.replace({
      id: 'NextTrial',
      getId: this.getCurrId,
      trialNumber: this.trialNumber,
    });
  }

  getCurrId () {
    return 'BugZap3';
  }

  goToNextLevel () {
    this.props.navigator.replace({
      id: 'GameTwo',
    });
  }

  getSpotLightStyle () {
    const side = Math.random();
    let posX = 0;
    // NOTE: currently this does not match with congruent/incongruent from
    // notes. Check that things have not changed.
    if (side < .5) {
      posX = 380 * this.props.scale.width;
    } else {
      posX = 680 * this.props.scale.width;
    }
    return (
      {
        flex: 1,
        backgroundColor: 'white',
        height: 150,
        width: 150,
        left: posX,
        top: -550 * this.props.scale.height,
        position: 'absolute',
        borderRadius: 100,
      }
    );
  }

  render () {
    return (
      <View>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage}>


          <View style={styles.row}>
            <View style={{width: 120, height: 120}}>
              <TouchableOpacity style={styles.button} onPress={this.homeBtn}>
                  <Text>{'Home'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <AnimatedSprite
            key={this.state.bulbKey}
            coordinates={{top: -128, left: (SCREEN_WIDTH / 2) - (128 / 2) }}
            size={{width: 128, height: 300}}
            character={lightbulbCharacter}
            spriteAnimationKey={this.state.bulbSpriteAnimationKey}
            tween={this.state.bulbTweenSettings}
            tweenStart='auto'
            sound={this.state.sound}
            soundFile='lightswitch'
          />

          {this.state.showBug ?
            <AnimatedSprite
              key={this.state.bugKey}
              coordinates={{top: 0, left: 0}}
              size={{
                width: 128 * this.props.scale.width,
                height: 128 * this.props.scale.height,
              }}
              character={bugCharacter}
              tween={this.state.bugTweenSettings}
              tweenStart='auto'
              spriteAnimationKey={this.state.bugSpriteAnimationKey}
              loopAnimation={this.loopAnimation}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey);}}
            />
          : null}

          <AnimatedSprite
            key={this.state.frogKey0}
            spriteKey={0}
            coordinates={{top: 320 * this.props.scale.height,
              left: 700 * this.props.scale.width}}
            size={{
                width: 750 * this.props.scale.width,
                height: 375 * this.props.scale.height,
            }}
            character={frogCharacter}
            spriteAnimationKey={this.state.frogSpriteAnimationKey}
            onPress={() => {this.frogTap(0);}}
            hitSlop={{top: -175 *this.props.scale.height,
              left: -55 * this.props.scale.width,
              bottom: -10 * this.props.scale.height,
              right: -65 * this.props.scale.width}}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey, 0);}}
            getFrameIndex={(animationKey, frameIndex) => {this.getFrameIndex(animationKey, frameIndex);}}
          />


          <AnimatedSprite
            key={this.state.frogKey1}
            spriteKey={1}
            coordinates={{top: 320 * this.props.scale.height,
              left: - 200 * this.props.scale.width}}
            size={{
                width: 750 * this.props.scale.width,
                height: 375 * this.props.scale.height,
            }}
            rotate={[{rotateY: '180deg'}]}
            character={frogCharacter}
            spriteAnimationKey={this.state.frogSpriteAnimationKey}
            onPress={() => {this.frogTap(1);}}
            hitSlop={{top: -175 *this.props.scale.height,
              left: -55 * this.props.scale.width,
              bottom: -10 * this.props.scale.height,
              right: -65 * this.props.scale.width}}
            onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey, 1);}}
            getFrameIndex={(animationKey, frameIndex) => {this.getFrameIndex(animationKey, frameIndex);}}
          />

          <View>
            {this.state.blackoutScreen}
          </View>
          <View>
            {this.state.spotLightFlash}
          </View>

        </Image>
      </View>
    );
  }
}

BugZap3.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

export default BugZap3;
