import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import Util from './BugZapUtil';

// import characters for animatedSprite to use
import frogCharacter from "../../sprites/frog/frogCharacter";
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../animatedSprite";
import styles from "./BugZapStyles";

const NUM_TRIALS = 3;
const BUG_IDLE_CATCH_DURATION = 1500; // how long bug is catchable

class BugZap extends React.Component {
  constructor (props) {
    super(props);
    this.Util = Util();
    this.zappedTooEarly = false;
    this.timeoutBugAppear = undefined;
    this.timeoutBugIdle = undefined;
    this.timeoutFlyAway = undefined;
    this.timeoutNextTrial = undefined;
    this.flyInDuration = Math.random() *  (2000) + 2500;
    this.trialNumber = 1;
    this.xLand = 750 * this.props.scale.width;
    this.yLand = 220 * this.props.scale.height;
    this.state = {
      showBug: false,
      bugKey: 0,
      frogKey: 1,
      bugTweenSettings: this.Util['initialTween'](this),
      bugSpriteAnimationKey: 'default',
      frogSpriteAnimationKey: 'default',
      loopAnimation: true,
    };
  }

  componentWillMount () {
    styles.container.height = styles.container.height * this.props.scale.height;
    styles.container.width = styles.container.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
    styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
  }

  componentDidMount () {
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
          this.setState(this.Util['bugFlyAway'](this, 'default'));
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

  setBugIdle () {
    // switch to idle bug character and pause tweening
    this.setState({
      bugKey: Math.random(),
      bugTweenSettings: this.Util['bugIdleSettings'](this),
      bugSpriteAnimationKey: 'idle',
    });
    this.timeoutFlyAway = setTimeout(()=>{
      this.setState(this.Util['bugFlyAway'](this, 'startFly'));
      this.setState(this.Util['frogDisgust'](this));
    }, BUG_IDLE_CATCH_DURATION);
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey) {
    if (animationKey === 'splat') {
       // once bug has splatted
      this.setState({showBug: false});
    }
    else if (animationKey === 'eat') {
      // celebrate after eating the bug
      this.setState(this.Util['frogCelebrate'](this));
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
      this.setState(this.Util['bugSplat'](this));
    }
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
        //this.goToNextBugGame();
        this.Util['goToNextBugGame'](this, 'BugZap1');
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

  // goToNextBugGame () {
  //   this.props.navigator.replace({
  //     id: 'BugZap1',
  //   });
  // }

  handlePress = () => {
    this.setState(this.Util['frogTap'](this));
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
              onPress={this.handlePress}
              hitSlop={{top: -175 *this.props.scale.height,
                left: -55 * this.props.scale.width,
                bottom: -10 * this.props.scale.height,
                right: -65 * this.props.scale.width}}
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

export default BugZap;
