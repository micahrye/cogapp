import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// import characters for AnimatedSprite to use
import frogCharacter from '../../sprites/frogLite/frogLiteCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import signCharacter from "../../sprites/sign/signCharacter"

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

// const NUM_TRIALS = 3;

class BugZapLevel01 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      frogKey: 0,
      rotate: undefined,
      frogPos: 250 * this.props.scale.width,
      showOtherBug: false,
      frogDirection: 'left',
      level: 1,
      tweenOptions: null,
      startX: SCREEN_WIDTH/2 - (360 * this.props.scale.width),
      showBug1: true,
      frogAnimationIndex: [0],
    };
  }

  componentDidMount () {
    let direction = Math.floor(Math.random() * 2);
    let frogDirection = 'left';

    if (direction === 0){
      frogDirection = 'right';
      this.setState({
        rotate: [{rotateY: '180deg'}],
        frogPos: 500 * this.props.scale.width,
        frogKey: Math.random(),
        startX: SCREEN_WIDTH/2 + (210 * this.props.scale.width)
      })
    }

    this.setState({
      frogDirection: frogDirection,
    });

    this.setState({
      tweenOptions: {
        tweenType: "curve-fall",
        startXY: [this.state.startX, 95 * this.props.scale.height], // start on their tags
        endXY: [500 * this.props.scale.width, 460 * this.props.scale.height], // end at character
        duration: 1000 * this.props.scale.width,
        loop: false,
      }
    });
  }

  onTweenFinish (spriteKey) {
    let index = [3];
    if (this.state.frogDirection == "right") {
      index = [1]
    }
    this.setState({
      showBug1: false,
      frogAnimationIndex: index,
    });

    this.goToNextTrial();
  }

  goToNextTrial () {
    setTimeout (() => {
      this.props.navigator.replace({
        id: 'NextTrial',
        getId: this.getCurrId, 
      });
    }, 500);
  }

  getCurrId () {
    return 'BugZapLevel01';
  }
  

  // onAnimationFinish (animationKey) {
  //   console.warn('here');
  //   this.setState({
  //     frogAnimationIndex: [0],
  //   })
  // }

  render () {
    return (
      <Image
        source={require('../../backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >

      <AnimatedSprite
        key={this.state.frogKey}
        coordinates={{top: 100 * this.props.scale.height,
          left: this.state.frogPos}}
        size={{
            width: 542 * this.props.scale.width,
            height: 600 * this.props.scale.height,
        }}
        character={frogCharacter}
        animationFrameIndex={this.state.frogAnimationIndex}
        rotate={this.state.rotate}     
        />


       <View style={styles.itemContainer}>
          <AnimatedSprite
            character={signCharacter}
            coordinates={{top: -10 * this.props.scale.height, left: SCREEN_WIDTH/2 - (360 * this.props.scale.width)}}
            size={{width: 140, height: 220}}
            animationFrameIndex={[0]}
          />
      </View>
      
      {this.state.showBug1 ?
        <AnimatedSprite
          key={Math.random()}
          coordinates={{top: 95 * this.props.scale.height, left: SCREEN_WIDTH/2 - (360 * this.props.scale.width)}}
          size={{width: 150 * this.props.scale.width, height: 150 * this.props.scale.height}}
          character={bugCharacter}
          tweenOptions={this.state.tweenOptions}
          tweenStart={'touch'}
          onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
          animationFrameIndex={[0]}/>
      : null}

      {this.state.showOtherBug ?
        <View>
          <View style={styles.itemContainer}>
              <AnimatedSprite
                character={signCharacter}
                coordinates={{top: -10 * this.props.scale.height, left: SCREEN_WIDTH/2 + (210 * this.props.scale.width)}}
                size={{width: 140, height: 220}}
                animationFrameIndex={[0]}
              />
          </View>
          <AnimatedSprite
              key={Math.random()}
              coordinates={{top: 95 * this.props.scale.height, left: SCREEN_WIDTH/2 + (210 * this.props.scale.width)}}
              size={{width: 150 * this.props.scale.width, height: 150 * this.props.scale.height}}
              character={bugCharacter}
              onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
              animationFrameIndex={[0]}/>
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
