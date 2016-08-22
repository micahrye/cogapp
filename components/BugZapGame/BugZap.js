import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

// import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const NUM_TRIALS = 3;
const IDLE_DURATION = 750; // how long bug is catchable

class BugZap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      tweenSettings: {},
      zappedTooEarly: false,
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      loopAnimation: true,
    };
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.timeoutNextTrial = undefined;
    this.flyInDuration = undefined;
    this.trialNumber = 1;
  }

  componentDidMount () {
    this.flyInDuration = Math.random() *  (4000 - 1500) + 1500;
    this.setUpTweens();

    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});

      this.timeoutBugIdle = setTimeout(()=>{
        if (!this.state.zappedTooEarly) { // after first tween is completed, bug idles
          this.bugIdle();
        }
        else {
          this.bugFlyAway('default'); // if bug is zapped too early, it just flies away, no idling
        }
      }, this.flyInDuration);
    }, 500);
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
    clearTimeout(this.timeoutNextTrial);
  }

  // 2 different ways bug can reach landing spot
  setUpTweens () {
    let sequenceChoice = Math.random();
    let xLand = 580; //SCREEN_WIDTH - 330; // 350 in emulator
    let yLand = 120; //SCREEN_HEIGHT - 350; // 70 in emulator
    let flySequenceX = [680, 730, xLand]; //[SCREEN_WIDTH - 230, SCREEN_WIDTH - 180, xLand]; //  [450, 500, xLand] in emulator
    let flySequenceY = [];

    if (sequenceChoice < .5) {
      flySequenceY = [50, yLand, 50, yLand]; //[SCREEN_HEIGHT - 420, yLand, SCREEN_HEIGHT - 420, yLand];
    }
    else {
      flySequenceY = [250, 150, 100, yLand]; //[SCREEN_HEIGHT - 220, SCREEN_HEIGHT - 320, SCREEN_HEIGHT - 370, yLand]; // 200, 100, 50, yLand in emulator
    }

    // when landed
    this.tweenIdle = {
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [xLand],
      yTo: [yLand],
      duration: 0,
      loop: false,
    };

    // tween offscreen
    this.tweenAway = {
      tweenType: "sine-wave",
      startXY: [xLand, yLand],
      xTo: [-150],
      yTo: [0, yLand, 0],
      duration: 2000,
      loop: false,
    };

    this.setState({
      tweenSettings: // initial tween onto screen
      {
        tweenType: "sine-wave",
        startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - 275],
        xTo: flySequenceX,
        yTo: flySequenceY,
        duration: this.flyInDuration,
        loop: false,
      },
    });
  }

  // switch to idle bug character and pause tweening
  bugIdle () {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.tweenIdle,
      bugSpriteAnimationKey: 'idle',
    });
    this.timeoutFlyAway = setTimeout(()=>{
      this.bugFlyAway('startFly');
      this.frogDisgust();
    }, IDLE_DURATION);
  }

  // switch to flying bug character and start next tween
  bugFlyAway (animation) {
    this.setState({
      bugKey: Math.random(),
      tweenSettings: this.tweenAway,
      bugSpriteAnimationKey: animation, // "startFly" after landed, or "default" if zapped too early
      loopAnimation: false,
    });
    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial();
    }, 2000);
  }

  frogTap = () => {
    if (this.state.showBug) {
      if (this.state.bugSpriteAnimationKey === 'idle') { // bug has landed
        this.catchBug();
      }
      else if (this.state.tweenSettings != this.tweenAway) { // bug has not landed yet
        this.frogDisgust();
        this.setState({zappedTooEarly: true}); // now bug doesn't land, just keeps flying offscreen
      }
    }
  }

  catchBug () {
    this.frogEat();
    clearTimeout(this.timeoutFlyAway); // so that "bugFlyAway" function doesn't run after bug is "caught"
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey) {
    if (animationKey === 'splat') {
      this.setState({showBug: false}); // once bug has splatted
    }
    else if (animationKey === 'eat') {
      this.frogCelebrate(); // celebrate after eating the bug
    }
    else if (animationKey === 'celebrate') {
      this.goToNextTrial(); // once bug is done celebrating
    }
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
  buttonPress = () => {
    this.props.navigator.replace({
      id: 'BugZap1',
    });
  }

  // trial count goes up, go to next trial, or next level if max trials reached
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
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>{'Go to Level 1'}</Text>
            </TouchableOpacity>

            {this.state.showBug ?
              <AnimatedSprite
                key={this.state.bugKey}
                spriteKey={0}
                coordinates={{top: 0, left: 0}}
                size={{width: 128, height: 128}}
                character={bugCharacter}
                tween={this.state.tweenSettings}
                tweenStart='auto'
                tweenStop={this.state.stopTween}
                spriteAnimationKey={this.state.bugSpriteAnimationKey}
                loopAnimation={this.state.loopAnimation}
                onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey);}}
              />
            : null}

            <AnimatedSprite
              key={this.state.frogKey}
              spriteKey={1}
              coordinates={{top: 200, left: 500}}
              size={{width: 750, height: 375}}
              character={frogCharacter}
              onPress={this.frogTap}
              hitSlop={{top: -175, left: -55, bottom: -10, right: -65}}
              spriteAnimationKey={this.state.frogSpriteAnimationKey}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey);}}
              getFrameIndex={(animationKey, frameIndex) => {this.getFrameIndex(animationKey, frameIndex);}}
            />
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
    width: 1024,
    flexDirection: 'row',
  },
  backgroundImage: {
    flex: 1,
    width: 1024,
    height: 600,
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

BugZap.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default BugZap;
