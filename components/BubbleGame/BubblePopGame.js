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
import fountain from '../../sprites/fountain/fountainCharacter';
import canCharacter from '../../sprites/can/canCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BUBBLE_SIZE = 60;
// TODO: do we need offset?
const OFFSET = 80;
const GAME_TIME_OUT = 115000;
const MAX_NUMBER_BUBBLES = 15;
const FOUTAIN_LOCATION = {top: 0, left: 0};
const FOUTAIN_SIZE = { width: 270, height: 258 };

class BubblePopGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      spriteAnimationKey: 'all',
      spriteAnimationKeyIndex: 0,
      bubbleArray: [],
      bubbleAnimationIndex: [0],
      omnivoreAnimationIndex: [0],
      loadContent: false,
      showFood: false,
    };
    this.characterUIDs = {};
    this.animations = ['eat', 'bubble', 'bubbleCan', 'bubbleBug', 'bubbleGrass'];
    this.setDefaultAnimationState;
    this.bubbleFountainInterval;
    this.targetBubble = {active: false, uid: '', name: ''};
    this.food = {active: false, uid: '', name: ''};
    FOUTAIN_LOCATION.top = SCREEN_HEIGHT - (FOUTAIN_SIZE.height + OFFSET);
    FOUTAIN_LOCATION.left = (SCREEN_WIDTH/2) - (FOUTAIN_SIZE.width/2);
  }

  componentWillMount () {
    this.characterUIDs = {
      bubble: randomstring({ length: 7 }),
      omnivore: randomstring({ length: 7 }),
      lever: randomstring({ length: 7 }),
      fountain: randomstring({ length: 7 }),
    };
    this.setState({
      bubbleAnimationIndex: [0,1,2,3,4,5,6,7,8,9],
      omnivoreAnimationIndex: [0,1,2,3,4,5,6,7],
      loadContent: true,
    });
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        bubbleAnimationIndex: [0],
        omnivoreAnimationIndex: [0],
        loadContent: false,
      });
      this.setState({});
    }, 1500);
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
    return Math.floor(Math.random() *  (4000)) + 2000;
  }

  onTweenFinish (characterUID) {
    const remainingBubbles = this.state.bubbleArray.filter((item) => {
      if (item.props.characterUID === characterUID) {
        return false;
      }
      return true;
    });
    this.setState({bubbleArray: remainingBubbles});
  }
  // populate array of background bubbles
  createBubbles () {
    const uid = randomstring({ length: 7 });
    const displayTargetBubble = Math.random() < 0.4;
    let createTargetBubble = displayTargetBubble && !this.state.targetBubbleActive;

    let bubbles = [];
    let bubbleSize = {};
    let locSequence = [];
    let bubbleDeminsions;
    if (createTargetBubble) {
      bubbleDeminsions = 200;
    } else {
      bubbleDeminsions = Math.floor(Math.random()* 100) + 50;
    }
    // const startLeft = Math.floor(Math.random() * SCREEN_WIDTH - bubbleDeminsions);
    const fountainCenter = (FOUTAIN_LOCATION.left + FOUTAIN_SIZE.width/2);
    const startLeft = fountainCenter - bubbleDeminsions/2;
    const startTop = FOUTAIN_LOCATION.top - (bubbleDeminsions * 0.7);

    bubbleSize = {width: bubbleDeminsions, height: bubbleDeminsions};
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const minusOrPlus = plusOrMinus > 0 ? -1 : 1;
    locSequence = [
      startLeft + plusOrMinus * Math.random() * (SCREEN_WIDTH/8),
      startLeft + minusOrPlus * Math.random() * (SCREEN_WIDTH/6),
      startLeft + plusOrMinus * Math.random() * (SCREEN_WIDTH/4),
      startLeft + minusOrPlus * Math.random() * (SCREEN_WIDTH/3),
    ];
    if (createTargetBubble) {
      locSequence = [startLeft];
    }

    let backgroundBubbleTween = {
      tweenType: "sine-wave",
      startXY: [startLeft, startTop],
      xTo: locSequence,
      yTo: [-bubbleDeminsions],
      duration: createTargetBubble ? 4000 : this.getRandomDuration(),
      loop: false,
    };

    if (createTargetBubble) {
      const target = Math.floor(Math.random() * 4);
      switch (target) {
        case 0:
          this.targetBubble.frameIndex = [2, 3];
          this.targetBubble.name = 'can';
          break;
        case 1:
          this.targetBubble.frameIndex = [4, 5];
          this.targetBubble.name = 'fly';
          break;
        case 2:
          this.targetBubble.frameIndex = [6, 7];
          this.targetBubble.name = 'fruit';
          break;
        case 3:
          this.targetBubble.frameIndex = [8, 9];
          this.targetBubble.name = 'grass';
          break;
      }
      this.targetBubble.opacity = 1;
      this.targetBubble.uid = uid;
      this.targetBubble.tweenOptions = backgroundBubbleTween;
      this.targetBubble.coordinates = {top: startTop, left: startLeft};
      this.targetBubble.size = bubbleSize;
      this.setState({targetBubbleActive: true});
    } else if (bubbles.length < MAX_NUMBER_BUBBLES) {
      bubbles.push(
        <AnimatedSprite
          character={bubbleCharacter}
          key={randomstring({ length: 7 })}
          characterUID={uid}
          animationFrameIndex={[0, 1]}
          tweenOptions={backgroundBubbleTween}
          tweenStart={'auto'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          loopAnimation={true}
          coordinates={{top: startTop, left: startLeft}}
          size={bubbleSize}
        />
      );

      if (this.state.bubbleArray.length <= MAX_NUMBER_BUBBLES) {
        this.setState({bubbleArray: this.state.bubbleArray.concat(bubbles)});
      }
    }
  }

  foodFall (startX, startY) {
    this.food.tweenOptions = {
      tweenType: 'sine-wave',
      startXY: [startX, startY],
      xTo: [150],
      yTo: [500],
      duration: 1000,
      loop: false,
    };

    this.food.active = true;
    this.food.uid = randomstring({length: 7});
    this.food.name = 'can';
    this.food.character = canCharacter;
    this.food.location = {top: startY, left:startX};
    this.food.size = {width: 109, height: 116};
    this.setState({showFood: true});

    this.eatInterval = setInterval(() => {
      this.setState({
        omnivoreAnimationIndex: [0,4,0,5],
      });
      clearInterval(this.eatInterval);
    }, 600);
  }

  onFoodTweenFinish () {
    this.setState({
      showFood: false,
    });
  }

  popBubble (stopValues) {
    const stopValueX = stopValues[0];
    const stopValueY = stopValues[1];
    // TODO: opacity part of hack to what may be a
    // RN bug associated with premiture stopping of Tween and removing
    // The related component
    this.targetBubble.opacity = 0;
    this.setState({targetBubbleActive: true});
    // time to play pop sound
    this.foodFall(stopValueX, stopValueY);
  }

  targetBubbleTweenFinish () {
    this.targetBubble.opacity = 1;
    this.setState({targetBubbleActive: false});
  }

  leverPressIn () {
    this.bubbleFountainInterval = setInterval(() => {
      this.createBubbles();
    }, 200);
  }

  leverPress () {
    // console.warn('lever PRESS');
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
            </TouchableOpacity>
          </View>
          <View style={styles.gameWorld}>

            <AnimatedSprite
              character={lever}
              characterUID={this.characterUIDs.lever}
              animationFrameIndex={[0]}
              loopAnimation={true}
              coordinates={{top: 100, left: 1067 }}
              size={{ width: 213,height: 189 }}
              rotate={[{rotateY:'180deg'}]}
              onPress={() => this.leverPress()}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
            />

            {this.state.loadContent ?
              <AnimatedSprite
                character={bubbleCharacter}
                characterUID={randomstring({length: 7})}
                animationFrameIndex={this.state.bubbleAnimationIndex}
                loopAnimation={true}
                coordinates={{top: 400, left: 40 }}
                size={{ width: 300,height: 285 }}
              />
            : null}

            <AnimatedSprite
              character={omnivoreLite}
              characterUID={this.characterUIDs.omnivore}
              animationFrameIndex={this.state.omnivoreAnimationIndex}
              loopAnimation={false}
              coordinates={{top: 400, left: 40 }}
              size={{ width: 300,height: 285 }}
              rotate={[{rotateY:'180deg'}]}
            />

            {this.state.bubbleArray}

            {this.state.targetBubbleActive ?
              <AnimatedSprite
                style={{opacity: this.targetBubble.opacity}}
                character={bubbleCharacter}
                characterUID={this.targetBubble.uid}
                animationFrameIndex={this.targetBubble.frameIndex}
                loopAnimation={true}
                tweenOptions={this.targetBubble.tweenOptions}
                tweenStart={'auto'}
                onTweenFinish={(characterUID) => this.targetBubbleTweenFinish(characterUID)}
                coordinates={this.targetBubble.coordinates}
                size={this.targetBubble.size}
                stopAutoTweenOnPressIn={true}
                onTweenStopped={(stopValues) => this.popBubble(stopValues)}
              />
            : null}

            {this.state.showFood ?
              <AnimatedSprite
                character={this.food.character}
                characterUID={this.food.uid}
                animationFrameIndex={[0]}
                tweenOptions={this.food.tweenOptions}
                tweenStart='auto'
                onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
                loopAnimation={true}
                coordinates={this.food.location}
                size={this.food.size}
              />
            : null}

            <AnimatedSprite
              character={fountain}
              characterUID={this.characterUIDs.fountain}
              animationFrameIndex={[0]}
              loopAnimation={true}
              coordinates={{top: FOUTAIN_LOCATION.top, left: FOUTAIN_LOCATION.left }}
              size={{ width: FOUTAIN_SIZE.width,height: FOUTAIN_SIZE.height}}
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

BubblePopGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(BubblePopGame, TimerMixin);

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

BubblePopGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default BubblePopGame;
