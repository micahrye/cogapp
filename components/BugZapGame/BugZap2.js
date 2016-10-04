import React from 'react';
import {
  AppRegistry,
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
import bugCharacter from "../../sprites/bug/bugCharacter";

import AnimatedSprite from "../animatedSprite";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const NUM_TRIALS = 3;
const BUG_IDLE_CATCH_DURATION = 1500; // how long bug is catchable


class BugZap2 extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey0: 1,
      frogKey1: 2,
      tweenSettings: {},
      zappedTooEarly: false,
      frogSpriteAnimationKey: 'default',
      bugSpriteAnimationKey: 'default',
    }
    this.bugSide = undefined;
    this.tweenIdle = {};
    this.tweenAway = {};
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.flyInDuration = undefined;
    this.trialNumber = 1;
    this.loopAnimation = true;
    this.noMoreFrogTap = false;
  }

  componentWillMount () {
    styles.container.height = styles.container.height * this.props.scale.height;
    styles.container.width = styles.container.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
  }

  componentDidMount () {

    this.flyInDuration = Math.random() *  (3000) + 2000;
    this.configureTweens();

    // render bug after the rest of the scene
    this.timeoutBugAppear = setTimeout( () => {
      this.setState({showBug: true});

      this.timeoutBugIdle = setTimeout(()=>{
        if (!this.state.zappedTooEarly) { // after first tween is completed, bug idles
          this.bugIdle();
        } else {
          this.bugFlyAway('default'); // if bug is zapped too early, it just flies away, no idling
        }
      }, this.flyInDuration);
    }, 500);
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutBugAppear);
    clearTimeout(this.timeoutBugIdle);
    clearTimeout(this.timeoutFlyAway);
  }

  // bug either appears on left or right
  configureTweens () {
    let sideChoice = Math.random();
    let sequenceChoice = Math.random(); // to help choose two ways bug can approach both the right and left landing spots
    let xLand = 0;
    let yLand = 120;
    let flySequenceX = [];
    let flySequenceY = [50, yLand, 50, yLand];

    if (sideChoice < .5) { // bug lands on left side
      this.bugSide = 'left';
      xLand = 380 * this.props.scale.width;
      flySequenceX = [450, 500, xLand];
      if (sequenceChoice < .5) {
        flySequenceY = [300, 130, 170, 130, yLand];
      }
    } else { // bug lands on right side
      this.bugSide = 'right';
      xLand = 750 * this.props.scale.width;
      flySequenceX = [680, 730, xLand];
      if (sequenceChoice < .5) {
        flySequenceY = [250, 150, 100, yLand];
      }
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
      startXY: [xLand, 70],
      xTo: [-150],
      yTo: [0, 70, 0],
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
      bugSpriteAnimationKey: 'idle',
      tweenSettings: this.tweenIdle,
    });

    this.timeoutFlyAway = setTimeout(()=>{
      this.loopAnimation = false;
      this.bugFlyAway('startFly');
      this.frogDisgust(0);
      this.frogDisgust(1);
    }, BUG_IDLE_CATCH_DURATION);
  }

  // switch to flying bug character and start next tween
  bugFlyAway (animation) {
    this.setState({
      bugKey: Math.random(),
      bugSpriteAnimationKey: animation,
      tweenSettings: this.tweenAway,
    });
    this.timeoutNextTrial = setTimeout(() => {
      this.goToNextTrial();
    }, 2000);
  }

  frogTap = (frog) => {
    if (this.noMoreFrogTap) {
      return;
    }
    if (this.state.showBug) { // if bug is idling and not already eaten
      if (this.state.bugSpriteAnimationKey === 'idle') {
        if (this.bugSide === 'right') {
          if (frog === 0) { // right side frog tapped
            this.correctFrogTapped(frog);
          } else { // left frog tapped
            this.wrongFrogTapped(frog);
          }
        } else if (this.bugSide === 'left') {
          if (frog === 0) {
            this.wrongFrogTapped(frog);
          } else {
            this.correctFrogTapped(frog);
          }
        }
      } else if (this.state.tweenSettings != this.tweenAway) { // zapped too early
        this.frogDisgust(frog);
        this.setState({zappedTooEarly: true});
      }
    }
  }

  // frog eats bug
  correctFrogTapped (frog) {
    this.frogEat(frog);
    clearTimeout(this.timeoutFlyAway); // so frogs aren't disgusted after bug is "caught"
  }

  // frog is disgusted, bug flies away without idling
  wrongFrogTapped (frog) {
    this.bugFlyAway();
    this.frogDisgust(frog);
    clearTimeout(this.timeoutFlyAway); // so bugFlyAway isn't called again
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey, frog) {
    if (animationKey === 'splat') {
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
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'eat'});
    }
    this.noMoreFrogTap = true;
  }

  frogCelebrate (frog) {
    if (frog === 0) {
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'celebrate'});
    }
  }

  frogDisgust (frog) {
    if (frog === 0) {
      this.setState({frogKey0: Math.random(), frogSpriteAnimationKey: 'disgust'});
    }
    else{
      this.setState({frogKey1: Math.random(), frogSpriteAnimationKey: 'disgust'});
    }
  }

  // go to next level
  nextLevelBtn = () => {
    this.props.navigator.replace({
      id: 'BugZap3',
    });
  }
  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }

  goToNextTrial () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
      if (this.trialNumber === NUM_TRIALS) {
        this.goToNextLevel();
        return;
      }
    }
    this.props.navigator.push({
      id: 'NextTrial',
      getId: this.getCurrId,
      trialNumber: this.trialNumber,
    });
  }

  getCurrId() {
    return 'BugZap2';
  }

  goToNextLevel() {
    /*
    this.props.navigator.replace({
      id: 'BugZap3',
    });
    */
  }

  render() {
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
              <View style={{width: 120, height: 120}}>
                <TouchableOpacity style={styles.button} onPress={this.nextLevelBtn}>
                  <Text>{'Go to Level 3'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {this.state.showBug ?
              <AnimatedSprite
                key={this.state.bugKey}
                coordinates={{top: 0, left: 0}}
                size={{
                  width: 128 * this.props.scale.width,
                  height: 128 * this.props.scale.height,
                }}
                character={bugCharacter}
                tween={this.state.tweenSettings}
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
              onPress={() => this.frogTap(0)}
              hitSlop={{top: -175 *this.props.scale.height,
                left: -55 * this.props.scale.width,
                bottom: -10 * this.props.scale.height,
                right: -65 * this.props.scale.width}}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey, 0);}}
              getFrameIndex={(animationKey, frameIndex) => {
                this.getFrameIndex(animationKey, frameIndex);}}
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
              rotate={[{rotateY:'180deg'}]}
              character={frogCharacter}
              spriteAnimationKey={this.state.frogSpriteAnimationKey}
              onPress={() => {this.frogTap(1);}}
              hitSlop={{top: -175 *this.props.scale.height,
                left: -55 * this.props.scale.width,
                bottom: -10 * this.props.scale.height,
                right: -65 * this.props.scale.width}}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey, 1);}}
              getFrameIndex={(animationKey, frameIndex) => {
                this.getFrameIndex(animationKey, frameIndex);}}
            />
        </Image>
      </View>
    );
  }
}

BugZap2.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

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

export default BugZap2;
