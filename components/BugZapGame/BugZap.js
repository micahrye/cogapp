import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const NUM_TRIALS = 3;
// how long bug is catchable
const BUG_IDLE_CATCH_DURATION = 750;

class BugZap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      bugTweenSettings: {},
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      loopAnimation: true,
    };
    this.zappedTooEarly = false;
    this.bugTweenIdle = {};
    this.bugTweenAway = {};
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.timeoutNextTrial = undefined;
    this.flyInDuration = undefined;
    this.trialNumber = 1;

  }

  componentWillMount () {
    styles.container.height = styles.container.height * this.props.scale.height;
    styles.container.width = styles.container.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
  }

  componentDidMount () {
    this.flyInDuration = Math.random() *  (2000) + 2500;
    this.configureTweens();

    const waitToRenderBug = 500;
    // render bug after the rest of the scene
    this.timeoutBugAppear = this.setTimeout( () => {
      this.setState({showBug: true});
      // once bug rendered
      this.timeoutBugIdle = this.setTimeout(()=>{
        if (!this.zappedTooEarly) {
          // after first tween is completed, bug idles
          this.setBugIdle();
        }
        else {
          // if bug is zapped too early, it just flies away, no idling
          this.bugFlyAway('default');
        }
      }, this.flyInDuration);
    }, waitToRenderBug);
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
    clearTimeout(this.timeoutNextTrial);
  }

  // 2 different ways bug can reach landing spot
  configureTweens () {
    //SCREEN_WIDTH - 330; // 350 in emulator
    let xLand = 750 * this.props.scale.width;
    //SCREEN_HEIGHT - 350; // 70 in emulator
    let yLand = 220 * this.props.scale.height;

    // this are the X/Y coords that are peak/summit of sine wave tween
    let sequenceX = [680 * this.props.scale.width, xLand - 50, xLand];
    let sequenceY = [];
    const sequenceChoice = Math.random();
    if (sequenceChoice < .5) {
      sequenceY = [50, yLand, 50, yLand];
    }
    else {
      sequenceY = [250, 150, 100, yLand];
    }

    // when landed
    this.bugTweenIdle = {
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [xLand],
      yTo: [yLand],
      duration: 0,
      loop: false,
    };

    // tween offscreen
    this.bugTweenAway = {
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [-150 * this.props.scale.width],
      yTo: [0, yLand, 0],
      duration: 1500 * this.props.scale.width,
      loop: false,
    };

    const distanceFromBottom = 375 * this.props.scale.height;
    this.setState({
      bugTweenSettings: // initial tween onto screen
      {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - distanceFromBottom],
        xTo: sequenceX,
        yTo: sequenceY,
        duration: this.flyInDuration,
        loop: false,
      },
    });
  }

  setBugIdle () {
    // switch to idle bug character and pause tweening
    this.setState({
      bugKey: Math.random(),
      bugTweenSettings: this.bugTweenIdle,
      bugSpriteAnimationKey: 'idle',
    });
    this.timeoutFlyAway = setTimeout(()=>{
      this.bugFlyAway('startFly');
      this.frogDisgust();
    }, BUG_IDLE_CATCH_DURATION);
  }

  bugFlyAway (animation) {
    // "startFly" after landed, or "default" if zapped too early
    this.setState({
      bugKey: Math.random(),
      bugTweenSettings: this.bugTweenAway,
      bugSpriteAnimationKey: animation,
      loopAnimation: false,
    });
    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial();
    }, 2500);
  }

  frogTap = () => {
    if (this.state.showBug) {
      // bug has landed
      if (this.state.bugSpriteAnimationKey === 'idle') {
        this.catchBug();
      } else if (this.state.bugTweenSettings != this.bugTweenAway) {
        // bug has not landed yet
        this.frogDisgust();
        // now bug doesn't land, just keeps flying offscreen
        this.zappedTooEarly = true;
      }
    }
  }

  catchBug () {
    this.frogEat();
    // so that "bugFlyAway" function doesn't run after bug is "caught"
    clearTimeout(this.timeoutFlyAway);
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey) {
    if (animationKey === 'splat') {
       // once bug has splatted
      this.setState({showBug: false});
    }
    else if (animationKey === 'eat') {
      // celebrate after eating the bug
      this.frogCelebrate();
    }
    else if (animationKey === 'celebrate') {
      // once bug is done celebrating
      this.timeoutNextTrial = setTimeout(() => {
        this.goToNextTrial();
      }, 1000);
    }
  }

  // indicates which frame the animation is currently on
  getFrameIndex (animationKey, frameIndex) {
    if (animationKey === 'eat' && frameIndex === 5) {
      // when tongue has reached bug
      this.bugSplat();
    }
  }

  bugSplat () {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: 'splat',
      loopAnimation: false, // does not loop splat animation
    });
  }

  frogEat () {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'eat'});
  }

  frogCelebrate () {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'celebrate'});
  }

  frogDisgust () {
    this.setState({frogKey: Math.random(), frogSpriteAnimationKey: 'disgust'});
  }

  // go to next level
  nextLevelBtn = () => {
    this.props.navigator.replace({
      id: 'BugZap1',
    });
  }
  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }

  // trial count goes up, go to next trial, or next
  // level if max trials reached
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
    return 'BugZap';
  }

  goToNextLevel () {
    this.props.navigator.replace({
      id: 'BugZap1',
    });
  }

  render () {
    return (
      <View>
        <Image
          source={require('../../backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage} >
          <View style={styles.row}>
            <View style={{width: 120, height: 120}}>
              <TouchableOpacity style={styles.button} onPress={this.homeBtn}>
                  <Text>{'Home'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: 120, height: 120}}>
              <TouchableOpacity style={styles.button} onPress={this.nextLevelBtn}>
                  <Text>{'Go to Level 1'}</Text>
              </TouchableOpacity>
            </View>
          </View>

            {this.state.showBug ?
              <AnimatedSprite
                key={this.state.bugKey}
                spriteKey={0}
                coordinates={{top: 0, left: 0}}
                size={{
                  width: 128 * this.props.scale.width,
                  height: 128 * this.props.scale.height,
                }}
                character={bugCharacter}
                tween={this.state.bugTweenSettings}
                tweenStart='auto'
                tweenStop={this.state.stopTween}
                spriteAnimationKey={this.state.bugSpriteAnimationKey}
                loopAnimation={this.state.loopAnimation}
                onAnimationFinish={(animationKey) => {
                  this.onAnimationFinish(animationKey);
                }}
              />
            : null}

            <AnimatedSprite
              key={this.state.frogKey}
              spriteKey={1}
              coordinates={{top: 300 * this.props.scale.height,
                left: 700 * this.props.scale.width}}
              size={{
                  width: 750 * this.props.scale.width,
                  height: 375 * this.props.scale.height,
              }}
              character={frogCharacter}
              onPress={this.frogTap}
              hitSlop={{top: -175, left: -55, bottom: -10, right: -65}}
              spriteAnimationKey={this.state.frogSpriteAnimationKey}
              onAnimationFinish={(animationKey) => {
                this.onAnimationFinish(animationKey);
              }}
              getFrameIndex={(animationKey, frameIndex) => {
                this.getFrameIndex(animationKey, frameIndex);
              }}
            />
        </Image>
      </View>
    );
  }
}

BugZap.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};
reactMixin.onClass(BugZap, TimerMixin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundImage: {
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 100,
    height: 50,
    position: 'absolute',
    justifyContent: 'center',
  },
});

export default BugZap;
