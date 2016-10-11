import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import bubbleCharacter from '../../sprites/bubbleLite/bubbleLiteCharacter';
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import lever from '../../sprites/lever/leverCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BUBBLE_SIZE = 60;
// TODO: do we need offset?
const OFFSET = 80;
const GAME_TIME_OUT = 115000;
const MAX_NUMBER_BUBBLES = 15;

class BubblePopLevel01 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      spriteAnimationKey: 'all',
      spriteAnimationKeyIndex: 0,
      bubbleArray: [],
      bubbleAnimationIndex: [0],
      omnivoreAnimationIndex: [0],
    };
    this.characterUIDs = {};
    this.animations = ['eat', 'bubble', 'bubbleCan', 'bubbleBug', 'bubbleGrass'];
    this.setDefaultAnimationState;
    this.bubbleFountainInterval;
  }

  componentWillMount () {
    this.setState({bubbleAnimationIndex: [0,1,2,3,4,5,6,7,8,9]});
    this.setState({omnivoreAnimationIndex: [0,1,2,3,4,5,6,7]});
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({bubbleAnimationIndex: [0]});
      this.setState({omnivoreAnimationIndex: [0]});
    }, 1500);

    this.characterUIDs = {
      bubble: randomstring({ length: 7 }),
      omnivore: randomstring({ length: 7 }),
    };
  }

  componentDidMount () {
    this.timeoutGameOver = setTimeout(() => { // start trial timeout
      this.props.navigator.replace({
        id: "Main",
      });
    }, GAME_TIME_OUT); // game over when 15 seconds go by without bubble being popped
  }

  componentWillUnmount () {
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.timeoutGameOver);
  }

  // random time for background bubbles to be on screen, between 2 and 6 seconds
  getRandomDuration () {
    return ( Math.random() *  (6000 - 2000) + 2000 );
  }

  onTweenFinish (characterUID) {
    console.warn(`Tween Finished for ${characterUID}`);
    // TODO: now remove from bubbleArray and setState
  }
  // populate array of background bubbles
  createBubbles () {
    let bubbles = [];
    let bubbleSize = {};
    let locSequence = [];

    const bubbleDeminsions = Math.floor(Math.random()* 100) + 10;
    const startLeft = Math.floor(Math.random() * SCREEN_WIDTH - bubbleDeminsions);
    bubbleSize = {width: bubbleDeminsions, height: bubbleDeminsions};
    locSequence = [startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft];

    let backgroundBubbleTween = {
      tweenType: "sine-wave",
      startXY: [startLeft, SCREEN_HEIGHT],
      xTo: locSequence,
      yTo: [-60],
      duration: this.getRandomDuration(),
      loop: false,
    };

    bubbles.push(
      <AnimatedSprite
        character={bubbleCharacter}
        key={randomstring({ length: 7 })}
        characterUID={randomstring({ length: 7 })}
        animationFrameIndex={[0,1]}
        tweenOptions={backgroundBubbleTween}
        tweenStart={'auto'}
        onTweenFinish={(uid) => this.onTweenFinish(uid)}
        loopAnimation={true}
        coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
        size={bubbleSize}
        spriteAnimationKey={this.state.spriteAnimationKey}
      />
    );

    if (this.state.bubbleArray.length <= MAX_NUMBER_BUBBLES) {
      this.setState({bubbleArray: this.state.bubbleArray.concat(bubbles)});
    }
  }

  leverPressIn () {
    this.bubbleFountainInterval = setInterval(() => {
      this.createBubbles();
    }, 1000);
  }
  leverPressOut () {
    clearInterval(this.bubbleFountainInterval);
  }

  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }

  render () {
    return (
      <Image source={require('../../backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
              <Text>{'Seconds To Pop: '}{this.state.popTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameWorld}>
            <AnimatedSprite
              character={lever}
              characterUID={randomstring({ length: 7 })}
              animationFrameIndex={[0]}
              loopAnimation={true}
              coordinates={{top: 100, left: 1067 }}
              size={{ width: 213,height: 189 }}
              rotate={[{rotateY:'180deg'}]}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
              onAnimationFinish={(animationKey) => {
                this.onAnimationFinish(animationKey);
              }}
              getFrameIndex={(animationKey, frameIndex) => {
                this.getFrameIndex(animationKey, frameIndex);
              }}
            />

            {this.state.bubbleArray}

            <AnimatedSprite
              character={omnivoreLite}
              characterUID={this.characterUIDs.omnivore}
              animationFrameIndex={this.state.omnivoreAnimationIndex}
              loopAnimation={true}
              coordinates={{top: 300, left: 40 }}
              size={{ width: 300,height: 285 }}
              rotate={[{rotateY:'180deg'}]}
            />

            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={this.homeBtn}>
                  <Text>{'Home'}</Text>
              </TouchableOpacity>
            </View>

          </View>
      </Image>
    );
  }
}

BubblePopLevel01.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(BubblePopLevel01, TimerMixin);

const styles = StyleSheet.create({
  topLevel :{
    alignItems: 'center',
  },
  gameWorld: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  topBar: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 700,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
    borderStyle: 'solid',
    borderColor: '#ff00ff',
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 100,
    height: 50,
    justifyContent: 'center',
  },
});

BubblePopLevel01.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default BubblePopLevel01;
