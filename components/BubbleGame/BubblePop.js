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

import AnimatedSprite from '../animatedSprite';
import bubbleCharacter from '../../sprites/bubble/bubbleCharacterLarge';
import canCharacter from '../../sprites/can/canCharacter';
import appleCharacter from '../../sprites/apple/appleCharacter';
import grassCharacter from '../../sprites/grass/grassCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BUBBLE_SIZE = 60;
const OFFSET = 80;

class BubblePop extends React.Component {
  constructor (props) {
    super(props);

    this.targetLocation = SCREEN_WIDTH/2 - 100;
    this.foodLocation = SCREEN_WIDTH/2 - 40;
    this.numBubbles = 10;
    this.stopValuesX = undefined;
    this.stopValuesY = undefined;
    this.popTime = undefined;
    this.foodTween = {};
    this.initialTween = {};
    this.tweenDown = {};
    this.fullTween = {};
    this.loopBubbleAnimation = true;
    this.loopOmnivoreAnimation = false;
    this.showTargetBubble = true;
    this.showFood = false;
    this.foodCharacter = canCharacter;
    this.foodSpriteAnimationKey = 'default';
    this.omnivoreSpriteAnimationKey = 'default';
    this.targetSpriteAnimationKey = 'default';
    this.timeoutGameOver = undefined;


    this.targetSequence = [
      this.targetLocation + OFFSET/2,
      this.targetLocation - OFFSET/2,
      this.targetLocation + OFFSET/2,
      this.targetLocation - OFFSET/2,
    ];

    if (this.props.route.targetDuration) {
      this.targetDuration = this.props.route.targetDuration - 500;
    }
    else {
      this.targetDuration = 5000;
    }

    this.targetTween = {
      tweenType: "sine-wave",
      startXY: [this.targetLocation, SCREEN_HEIGHT - 69],
      xTo: this.targetSequence,
      yTo: [-200],
      duration: this.targetDuration,
      loop: false,
    };

    this.state = {
      popTime: 0,
      bubbleCharacters: [],
      targetBubbleKey: 0,
      foodKey: 1,
      omnivoreKey: 2,
      targetTween: this.targetTween,
      sound: true,
    };

  }

  componentWillMount () {
    this.setState({
      targetTween: this.targetTween,
      targetBubbleKey: Math.random(),
    });
  }

  componentDidMount () {
    this.chooseFood();
    this.createBackgroundBubbles();

    this.timeoutGameOver = setTimeout(() => { // start trial timeout
      this.props.navigator.replace({
        id: "Main",
      });
    }, 15000); // game over when 15 seconds go by without bubble being popped

  }

  componentWillUnmount () {
    clearTimeout(this.timeoutGameOver);
  }

  // alternate food in bubble each new trial
  chooseFood () {
    let choice = Math.random();
    if (choice < .25) {
      this.foodCharacter = canCharacter;
      this.targetSpriteAnimationKey = 'canBubble';
    } else if (choice > .25 && choice < .5) {
      this.foodCharacter = appleCharacter;
      this.targetSpriteAnimationKey = 'appleBubble';
    } else if (choice > .5 && choice < .75) {
      this.foodCharacter = grassCharacter;
      this.targetSpriteAnimationKey = 'grassBubble';
    } else {
      this.foodCharacter = bugCharacter;
      this.foodSpriteAnimationKey = 'stillIdle';
      this.targetSpriteAnimationKey = 'bugBubble';
      this.setState({foodKey: Math.random()});
    }
    this.setState({targetBubbleKey: Math.random()});
  }

  // populate array of background bubbles
  createBackgroundBubbles () {
    let bubbles = [];
    for (let i=0; i < this.numBubbles; i++) {
      let size = {};
      let sequence = [];
      let startLeft = i*((SCREEN_WIDTH-BUBBLE_SIZE/2-OFFSET)/this.numBubbles);

      if (i%2 == 0) { // every other bubble gets different size and x transition sequence
        size = {width: BUBBLE_SIZE, height: BUBBLE_SIZE};
        sequence = [startLeft + OFFSET, startLeft, startLeft + OFFSET, startLeft];
      } else {
        size = {width: BUBBLE_SIZE - 20, height: BUBBLE_SIZE - 20};
        sequence = [startLeft, startLeft + OFFSET, startLeft, startLeft + OFFSET];
      }

      let backgroundBubbleTween = {
        tweenType: "sine-wave",
        startXY: [startLeft, SCREEN_HEIGHT],
        xTo: sequence,
        yTo: [-60],
        duration: this.getRandomDuration(),
        loop: true,
      };

      bubbles.push(
        <AnimatedSprite
          key={i}
          coordinates={{top: SCREEN_HEIGHT, left: startLeft}}
          size={size}
          character={bubbleCharacter}
          tween={backgroundBubbleTween}
          tweenStart='auto'
          spriteAnimationKey='default'
        />
      );
    }
    this.setState({bubbleCharacters: bubbles});
  }

  // random time for background bubbles to be on screen, between 2 and 6 seconds
  getRandomDuration () {
    return ( Math.random() *  (6000 - 2000) + 2000 );
  }

  // make bubble pop and record time it took to pop it
  popBubble = (stopValues) => {
    this.stopValuesX = stopValues[0];
    this.stopValuesY = stopValues[1];
    if (this.targetSpriteAnimationKey === 'pop') { // so you can't pop bubble while it is already popping
      this.setState({sound: false});
      return;
    }
    clearTimeout(this.timeoutGameOver); // so game timeout screen doesn't load
    this.targetSpriteAnimationKey = 'pop';
    this.loopBubbleAnimation = false; // so popped bubble doesn't repeat
    this.setState({
      popTime: this.popTime - .5,
      targetTween: { // so bubble stays in place
        tweenType: "sine-wave",
        startXY: [this.stopValuesX, this.stopValuesY],
        xTo: [this.stopValuesX],
        yTo: [this.stopValuesY],
        duration: 5000,
        loop: false,
      },
      targetBubbleKey: Math.random(),
    });

    this.foodFall();
  }

  // food falls out of bubble and down to character
  foodFall () {
    if (this.stopValuesY > 350) { // if food needs to go up first to drop into mouth
      this.initialTween = {
        tweenType: 'curve-spin-up',
        startXY: [this.stopValuesX + 50, this.stopValuesY + 50],
        endXY: [SCREEN_WIDTH - 300, SCREEN_HEIGHT - 400],
        duration: 1000,
        loop: false,
      };
      this.tweenDown = {
        tweenType: 'curve-spin',
        startXY: [SCREEN_WIDTH - 300, SCREEN_HEIGHT - 400],
        endXY: [SCREEN_WIDTH - 210, SCREEN_HEIGHT - 230],
        duration: 500,
        loop: false,
      };
      this.foodTween = this.initialTween;
    }
    else {
      this.fullTween = {
        tweenType: 'curve-spin',
        startXY: [this.stopValuesX + 50, this.stopValuesY + 50],
        endXY: [SCREEN_WIDTH - 210, SCREEN_HEIGHT - 230],
        duration: 1000,
        loop: false,
      };
      this.foodTween = this.fullTween;
    }
    this.showFood = true;
    this.omnivoreSpriteAnimationKey = 'openMouth'; // opens mouth to eat
    this.setState({omnivoreKey: Math.random()});
  }

  // triggered when a tween ends
  onTweenFinish (spriteKey) {
    if (spriteKey === 1) { // bubble
      this.setState({
        targetTween: this.targetTween, // repeat tween up the screen
        targetBubbleKey: Math.random(),
      });
    }
    else if (spriteKey === 2) { // food
      if (this.foodTween === this.initialTween) {
        this.foodTween = this.tweenDown;
        this.setState({foodKey: Math.random()});
      }
      else {
        this.showFood = false;
        this.loopOmnivoreAnimation = false; // so chew only happens once
        this.omnivoreSpriteAnimationKey = 'chew';
        this.setState({omnivoreKey: Math.random()});
      }
    }
  }

  // triggered when an animation finishes
  onAnimationFinish (animationKey) {
    if (animationKey === 'pop') { // after bubble pops, go to next trial or game over
      this.showTargetBubble = false;
      this.setState({targetBubbleKey: Math.random()});
    }
    if (animationKey === 'openMouth') {
      this.omnivoreSpriteAnimationKey = 'readyToEat'; // an open mouth
      this.loopOmnivoreAnimation = true; // so mouth stays open
      this.setState({omnivoreKey: Math.random()});
    }
    if (animationKey === 'chew') {
      if (this.targetDuration === 1000) { //if bubble is popped at 1 second duration, game is over
        this.props.navigator.replace({
          id: "Main",
        });
      } else { // otherwise, next trial is started
        this.setTimeout(() => {
          this.goToNextTrial();
        }, 1000);
      }
    }
  }

  goToNextTrial () {
    this.props.navigator.replace({
      id: 'NextTrial',
      getId: this.getCurrId, // to return back to this page
      targetDuration: this.targetDuration, // pass current target duration along route
    });
  }

  getCurrId () {
    return 'BubblePop';
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
            {this.state.bubbleCharacters}
            {this.showTargetBubble ?
              <AnimatedSprite
                key={this.state.targetBubbleKey}
                spriteKey={1}
                coordinates={{top: SCREEN_HEIGHT - 69, left: this.targetLocation}}
                size={{width: 200, height: 200}}
                character={bubbleCharacter}
                tween={this.state.targetTween}
                tweenStart='auto'
                stopTweenOnTouch={(stopValues) => this.popBubble(stopValues)}
                onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
                soundOnTouch={this.state.sound}
                soundFile='bubblePop'
                timeSinceMounted={(spriteKey, duration)=> this.popTime = duration}
                spriteAnimationKey={this.targetSpriteAnimationKey}
                loopAnimation={this.loopBubbleAnimation}
                onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey);}}
              />
            : null}
            {this.showFood ?
              <AnimatedSprite
                key={this.state.foodKey}
                spriteKey={2}
                coordinates={{top: this.stopValuesX + 50 , left: this.stopValuesY}}
                size={{width: 100, height: 100}}
                character={this.foodCharacter}
                tween={this.foodTween}
                tweenStart='auto'
                onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
                spriteAnimationKey={this.foodSpriteAnimationKey}
                loopAnimation={true}
              />
            : null}
            <AnimatedSprite
              key={this.state.omnivoreKey}
              coordinates={{top: SCREEN_HEIGHT - 280 , left: SCREEN_WIDTH - 250}}
              size={{width: 256, height: 256}}
              character={omnivoreCharacter}
              spriteAnimationKey={this.omnivoreSpriteAnimationKey}
              loopAnimation={this.loopOmnivoreAnimation}
              onAnimationFinish={(animationKey) => {this.onAnimationFinish(animationKey);}}
              fps={20}
            />
          </View>
      </Image>
    );
  }
}

BubblePop.propTypes = {
  navigator: React.PropTypes.object.isRequired,
};

reactMixin.onClass(BubblePop, TimerMixin);

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
});

BubblePop.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default BubblePop;
