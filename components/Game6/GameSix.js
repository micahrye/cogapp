import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import canCharacter from "../../sprites/can/canCharacter";
import bugCharacter from "../../sprites/bug/bugCharacter";
import appleCharacter from "../../sprites/apple/appleCharacter";
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import thoughtBubbleCharacter from "../../sprites/thoughtBubble/thoughtBubbleCharacter";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class GameSix extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      targetNumber: undefined,
      secondNumber: undefined,
      thirdNumber: undefined,
      omnivoreKey: Math.random(),
      thoughtBubbleKey: Math.random(),
      showTargetNumber: false,
      showOtherNumbers: false,
      apples: [],
      cans: [],
      bugs: [],
      grass: [],
      fade: new Animated.Value(0),
    };
    this.trialNum = 1;
    this.omnivoreSpriteAnimationKey = 'default';
    this.thoughtBubbleSpriteAnimationKey = 'default';
    this.gameTimeout = undefined;
    this.foodTween = null;
    this.apples = [];
    this.cans = [];
    this.bugs = [];
    this.grass = [];
    this.fail = undefined;
    this.reactions = [];
    this.currentReaction = 0;
  }

  componentWillMount () {
    this.thoughtBubbleSpriteAnimationKey = 'appear';

    let targetNumber = this.getNumber();
    let secondNumber = this.getNumber();
    let thirdNumber = this.getNumber();

    this.setState ({
      targetNumber: targetNumber,
      secondNumber: secondNumber,
      thirdNumber: thirdNumber,
      thoughtBubbleKey: Math.random(),
    });
  }

  componentDidMount () {
    const gameTimeOut = 120000;
    this.gameTimeout = setTimeout(() => {
      // after game timeout return to homescreen
      this.props.navigator.replace({
        id: 'Main',
      });
    }, gameTimeOut);

    for (let i = 0; i < 4; i++) { // set up 4 foods on tags
      this.setUpFood(i+1);
    }
  }

  componentWillUnmount () {
    clearTimeout(this.gameTimeout);
  }

  // make individualized tweens for each food
  getFoodTween (startY, startX) {
    return ({
      tweenType: "curve-spin",
      startXY: [startX, startY], // start on their tags
      endXY: [830 * this.props.scale.width, 460 * this.props.scale.height], // end at character
      duration: 1000 * this.props.scale.width,
      loop: false,
    });
  }

  // place new food on specified tag
  setUpFood (spriteKey) {
    if (spriteKey === 1) {
      this.apples.push(
        <AnimatedSprite
          key={Math.random()}
          spriteKey={1}
          coordinates={{top: 95, left: 90}}
          size={{width: 70, height: 70}}
          character={appleCharacter}
          onPress={(spriteKey) => this.foodPress(spriteKey)}
          tween={this.getFoodTween(95, 90)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
        />
      );
    }
    else if (spriteKey === 2) {
      this.cans.push(
        <AnimatedSprite
          key={Math.random()}
          spriteKey={2}
          coordinates={{top: 90, left: 240}}
          size={{width: 90, height: 90}}
          character={canCharacter}
          onPress={(spriteKey) => this.foodPress(spriteKey)}
          tween={this.getFoodTween(90, 240)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
        />
      );
    }
    else if (spriteKey === 3) {
      this.bugs.push(
        <AnimatedSprite
          key={Math.random()}
          spriteKey={3}
          coordinates={{top: 85, left: 390}}
          size={{width: 100, height: 100}}
          character={bugCharacter}
          onPress={(spriteKey) => this.foodPress(spriteKey)}
          tween={this.getFoodTween(85, 390)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
          spriteAnimationKey='stillIdle'
          loopAnimation={true}
        />
      );
    }
    else {
      this.grass.push(
        <AnimatedSprite
          key={Math.random()}
          spriteKey={4}
          coordinates={{top: 90, left: 560}}
          size={{width: 80, height: 80}}
          character={grassCharacter}
          onPress={(spriteKey) => this.foodPress(spriteKey)}
          tween={this.getFoodTween(90, 560)}
          tweenStart='touch'
          onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
        />
      );
    }
    this.setState({
      apples: this.apples,
      cans: this.cans,
      bugs: this.bugs,
      grass: this.grass,
    });
  }

  // number randomly chosen between 1 2 3 and 4
  getNumber () {
    let choice = Math.random();
    if (choice <= .25) {
      return (1);
    }
    else if (choice > .25 && choice <= .5) {
      return (2);
    }
    else if (choice > .5 && choice <= .75) {
      return (3);
    }
    else {
      return (4);
    }
  }

  // triggered when food item is pressed
  foodPress (spriteKey) {
    this.setUpFood(spriteKey); // add another food item to tag while first one is tweening down

    if (spriteKey === this.state.targetNumber) {
      this.reactions.push('chew'); // line up a successful reaction
    }
    else { // incorrect press
      this.reactions.push('disgust'); // line up an unsuccessful reaction
    }
    this.shiftNumbers();
  }

  // triggered after an animation ends
  onAnimationFinish (animationKey) {
    if (animationKey === 'appear') {
      this.setState({showTargetNumber: true});
    }
  }

  // after food tweens down to animal
  onTweenFinish (spriteKey) {
    this.removeFood(spriteKey);
    this.omnivoreSpriteAnimationKey = this.reactions[0]; // execute reactions in order
    this.setState({
      omnivoreKey: Math.random(),
    });
    this.reactions.shift();
  }

  // remove specified food from its array
  removeFood (spriteKey) {
    if (spriteKey === 1) {
      this.apples.shift();
      this.setState({apples: this.apples});
    }
    else if (spriteKey === 2) {
      this.cans.shift();
      this.setState({cans: this.cans});
    }
    else if (spriteKey === 3) {
      this.bugs.shift();
      this.setState({bugs: this.bugs});
    }
    else {
      this.grass.shift();
      this.setState({grass: this.grass});
    }
  }

  // remove old target number, shift numbers up one, and add new number to sequence
  shiftNumbers () {
    this.trialNum++;
    if (this.trialNum === 4) {
      this.setState({showOtherNumbers: true}); // show other 2 numbers after 3rd trial
    }
    if (this.trialNum < 4) {
      this.setState({fade: new Animated.Value(0)}); // so target number can fade in again on first 3 trials
    }
    let targetNumber = this.state.secondNumber;
    let secondNumber = this.state.thirdNumber;
    let thirdNumber = this.getNumber();
    this.setState({
      targetNumber: targetNumber,
      secondNumber: secondNumber,
      thirdNumber: thirdNumber,
    });
  }

  getTextHolderStyle () {
    let left = undefined;
    if (this.trialNum < 4) {
      left = 1140 * this.props.scale.width;
    }
    else {
      left = 1120 * this.props.scale.width;
    }
    return (
      {
        top: 400 * this.props.scale.height,
        left: left,
        position: 'absolute',
        flexDirection: 'row',
      }
    );
  }

  // allows target number to fade in
  getFadeStyle () {
    if (this.trialNum < 4) {
      Animated.timing(
        this.state.fade,
        {
          toValue: 1,
          duration: 1500,
        },
      ).start();
    }

    return (
      {
        opacity: this.state.fade,
      }
    );
  }

  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }

  render () {
    return (
      <Image source={require('../../backgrounds/Game_6_Background_1280.png')}
        style={styles.backgroundImage} >

        <View style={styles.container}>


          <AnimatedSprite
            character={omnivoreCharacter}
            key={this.state.omnivoreKey}
            coordinates={{
              top: 420 * this.props.scale.height,
              left: 800 * this.props.scale.width,
            }}
            size={{
              height: 350 * this.props.scale.height,
              width: 350 * this.props.scale.width,
            }}
            spriteAnimationKey={this.omnivoreSpriteAnimationKey}
            onAnimationFinish={(animationKey) => {
              this.onAnimationFinish(animationKey);
            }}
          />

          <AnimatedSprite
            character={thoughtBubbleCharacter}
            key={this.state.thoughtBubbleKey}
            coordinates={{
              top: 360 * this.props.scale.height,
              left: 960 * this.props.scale.width,
            }}
            size={{
              height: 220 * this.props.scale.height,
              width: 320* this.props.scale.width,
            }}
            spriteAnimationKey={this.thoughtBubbleSpriteAnimationKey}
            onAnimationFinish={(animationKey) => {
              this.onAnimationFinish(animationKey);
            }}
          />

          {this.state.showTargetNumber ?
            <View style={this.getTextHolderStyle()}>
              <Animated.View style={this.getFadeStyle()}>
                <Text style={styles.targetNumber}>
                  {this.state.targetNumber}
                </Text>
              </Animated.View>
              {this.state.showOtherNumbers ?
                <View style={{position: 'absolute'}}>
                  <Text style={styles.secondNumber}>
                    {this.state.secondNumber}
                  </Text>
                  <Text style={styles.thirdNumber}>
                    {this.state.thirdNumber}
                  </Text>
                </View>
              : null}
            </View>
          : null}

          <View style={styles.itemContainer}>
            <AnimatedSprite
              character={signCharacter}
              coordinates={{top: -10* this.props.scale.height, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              spriteAnimationKey='gameSix1'
              loopAnimation={true}
            />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              character={signCharacter}
              coordinates={{top: -10* this.props.scale.height, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              spriteAnimationKey='gameSix2'
              loopAnimation={true}
            />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              character={signCharacter}
              coordinates={{top: -10* this.props.scale.height, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              spriteAnimationKey='gameSix3'
              loopAnimation={true}
            />
          </View>

          <View style={styles.itemContainer}>
            <AnimatedSprite
              character={signCharacter}
              coordinates={{top: -10 * this.props.scale.height, left: 0}}
              size={{width: 140, height: 220}}
              draggable={false}
              spriteAnimationKey='gameSix4'
              loopAnimation={true}
            />
          </View>
          {this.state.apples}
          {this.state.cans}
          {this.state.bugs}
          {this.state.grass}

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

GameSix.propTypes = {
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
  backgroundImage: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  itemContainer:{
    top: 0,
    left: 50,
    alignItems: 'center',
    marginRight: 20,
    height: 250,
    width: 140,
  },
  secondNumber: {
    fontSize: 66,
    left: 10,
    top: -5,
    color: '#ffa64d',
  },
  thirdNumber: {
    fontSize: 40,
    left: 55,
    top: 0,
    position: 'absolute',
    color: '#ffcc99',
  },
  targetNumber: {
    fontSize: 80,
    color: '#ff8000',
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

export default GameSix;
