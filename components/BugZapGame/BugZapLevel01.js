import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// import characters for animatedSprite to use
import frogCharacter from '../../sprites/frogLite/frogLiteCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const NUM_TRIALS = 3;
// how long bug is catchable
const BUG_IDLE_CATCH_DURATION = 1500;

class BugZapLevel01 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      frogKey: 0,
    };
  }

  componentDidMount () {
    let frogDirection = Math.floor(Math.random() * 2);
    console.warn(frogDirection);
    // if (frogDirection === 0) {
    //
    // }

    this.AFUNCTION;

  }

  AFUNCTION () {
    this.setState({
      frogKey: Math.random(),
    });
  }

  getFrogStyle () {

    console.warn('here');
    return (
      {
        transform: [{perspective: 850}, {translateY: 100}],
        opacity: .5,
      }
    );
  }

  render () {
    return (
      <Image
        source={require('../../backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >
      <AnimatedSprite
        style={this.getFrogStyle()}
        key={this.state.frogKey}
        coordinates={{top: 100 * this.props.scale.height,
          left: 250 * this.props.scale.width}}
        size={{
            width: 542 * this.props.scale.width,
            height: 600 * this.props.scale.height,
        }}
        character={frogCharacter}
        animationFrameIndex={[0]}
      />
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
