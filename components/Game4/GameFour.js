import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import squareCharacter from "../../sprites/square/squareCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import getGameStyles from './stylesheet';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const styles = getGameStyles(SCREEN_HEIGHT, SCREEN_WIDTH);
const NUM_TRIALS = 4;

class GameFour extends React.Component {

  constructor (props) {
    super(props);
    this.boxTween = [{
      tweenType: 'wiggle',
      loop: false,
    },{
      tweenType: 'wiggle',
      loop: false,
    },{
      tweenType: 'wiggle',
      loop: false,
    }];
    this.left = [];
    this.boxKeys = [0, 1, 2];
    this.showBoxes = [true, true, true];
    this.fixedKeys = [];
    this.boxChosen = false;
    this.fixedSpriteAnimationKeys = [];
    this.correctChoice = undefined;
    this.wrongChoices = [];
    this.fixedBoxes = [];
    this.trialNumber = 1;
    this.stopWiggling = false;

    this.state = {
      moveableBoxes: [],
      mammalKey: 3,
      foodKey: 4,
      boxKeys: this.boxKeys,
      mammalSpriteAnimationKey: 'default',
      showFood: false,
      loopAnimation: false,
      showBoxes: this.showBoxes,
    };
  }

  componentWillMount () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
    }
    this.createSequence();
    this.createFixedBoxes();
    this.setUpChoices();
  }

  // create sequence of shapes in matrix
  // NOTE: temporary, until real assets come in
  createSequence () {
    let sequence = [];
    switch (this.trialNumber) {
      case 1:
        sequence = [
          'green', 'green', 'green', 'red', 'red', 'red', 'green', 'green',
        ];
        this.correctChoice = 'green';
        this.wrongChoices.push('red', 'blue');
        break;
      case 2:
        sequence = [
          'green', 'blue', 'red', 'green', 'blue', 'red', 'green', 'blue',
        ];
        this.correctChoice = 'red';
        this.wrongChoices.push('green', 'blue');
        break;
      case 3:
        sequence = [
          'green', 'green', 'green', 'red', 'red', 'red', 'blue', 'blue',
        ];
        this.correctChoice = 'blue';
        this.wrongChoices.push('red', 'green');
        break;
      case 4:
        sequence = [
          'blue', 'red', 'blue', 'blue', 'red', 'blue', 'blue', 'red',
        ];
        this.correctChoice = 'blue';
        this.wrongChoices.push('green', 'red');
        break;
    }
    this.fixedSpriteAnimationKeys.push(sequence);
  }

  createFixedBoxes () {
    let top = 25;
    for (let i=0; i < 9; i++) {
      if (i > 2 && i < 6) { // second row of boxes
        top = 110;
      }
      else if ( i >= 6) { // third row of boxes
        top = 195;
      }
      if (i < 8) {
        this.fixedBoxes.push(
          <AnimatedSprite
            key={Math.random()}
            coordinates={{top: top, left: ((i%3)*90) + 15}}
            size={{width: 60, height: 60}}
            character={squareCharacter}
            spriteAnimationKey={this.fixedSpriteAnimationKeys[0][i]}
            loopAnimation={true}
          />
        );
      }
      else if (i === 8) { // last box is empty
        this.fixedBoxes.push(<View key={Math.random()} style={styles.emptyBox} />);
      }
    }
  }

  // random location of correct choice box
  setUpChoices () {
    let correctLocation = Math.floor(Math.random() * 3); // either 0, 1, or 2
    if (correctLocation === 0) {
      this.left = [15, 195, 105];
    }
    else if (correctLocation === 1) {
      this.left = [105, 15, 195];
    }
    else {
      this.left = [195, 15, 105];
    }
  }

  // check if a moveable box has been dragged to dashed box and if true remove it
  checkLocation = (newX, newY, numBox) => {
    if ((newX > 170 && newX < 225) && (newY > 170 && newY < 215) && !this.boxChosen) {
      if (numBox === 1) { // correct box chosen
        this.foodFall();
        this.showBoxes[0] = false;
      }
      else {
        this.disgust();
        if (numBox === 2) {
          this.showBoxes[1] = false;
        }
        else {
          this.showBoxes[2] = false;
        }
      }
      this.setState({showBoxes: this.showBoxes});
      this.boxChosen = true; // so they can't drag another box while animal reaction happens
    }

    else {
      this.boxKeys[numBox - 1] = Math.random();
      this.setState({
        boxKeys: this.boxKeys,
      });
    }
  }

  foodFall () {
    this.setState({
      showFood: true,
      mammalKey: Math.random(),
      mammalSpriteAnimationKey: 'openMouth',
    });
  }

  disgust () {
    this.setState({
      mammalKey: Math.random(),
      mammalSpriteAnimationKey: 'disgust',
    });
  }

  onTweenFinish (spriteKey, stopped) {
    if (spriteKey === 5) { // mammal
      this.setState({
        mammalKey: Math.random(),
        mammalSpriteAnimationKey: 'chew',
        showFood: false,
        loopAnimation: false,
      });
    }
    if (!stopped && !this.stopWiggling) { // do not repeat wiggle if boxes have already been pressed
      if (spriteKey === 1 || spriteKey === 2 || spriteKey === 3) { // boxes
        this.boxTween[spriteKey - 1] = {
          tweenType: 'wiggle',
          loop: false,
        };
        this.boxKeys[spriteKey - 1] = Math.random();
        this.setState({boxKeys: this.boxKeys});
      }
    }
    if (stopped) {
      this.stopWiggling = true;
    }
  }

  onAnimationFinish (animation) {
    if (animation === 'chew') {
      this.setState({
        mammalKey: Math.random(),
        mammalSpriteAnimationKey: 'celebrate',
      });
    }
    else if (animation === 'openMouth') {
      this.setState({
        mammalKey: Math.random(),
        mammalSpriteAnimationKey: 'readyToEat',
        loopAnimation: true,
      });
    }
    else if (animation === 'disgust') {
      this.boxChosen = false; // after animal reacts, player can drag boxes again
    }
    else if (animation === 'celebrate') {
      this.goToNextTrial();
    }
  }

  goToNextTrial () {
    if (this.trialNumber === NUM_TRIALS) {
      this.props.navigator.replace({
        id: 'Main',
      });
      return;
    }
    this.props.navigator.replace({
      id: 'NextTrial',
      getId: this.getCurrId,
      trialNumber: this.trialNumber,
    });
  }

  getCurrId () {
    return 'GameFour';
  }

  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }
  render () {
    return (
      <Image source={require('../../backgrounds/Game_4_Background_1280.png')} style={styles.backgroundImage}>

        <View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={this.homeBtn}>
                <Text>{'Home'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.boxContainer}>
            {this.fixedBoxes}
            <View style={styles.separatingLine}><Text>{'ehllo'}</Text></View>
            {this.state.showBoxes[0] ?
              <AnimatedSprite
                key={this.state.boxKeys[0]}
                spriteKey={1}
                coordinates={{top: 420, left: this.left[0]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 1)}
                character={squareCharacter}
                spriteAnimationKey={this.correctChoice}
                loopAnimation={true}
                tween={this.boxTween[0]}
                tweenStart='auto'
                onTweenFinish={(spriteKey, stopped) => this.onTweenFinish(spriteKey, stopped)}
                stopTweenOnPressIn={() => {}}
              />
            : null}
            {this.state.showBoxes[1] ?
              <AnimatedSprite
                key={this.state.boxKeys[1]}
                spriteKey={2}
                coordinates={{top: 420, left: this.left[1]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 2)}
                character={squareCharacter}
                spriteAnimationKey={this.wrongChoices[0]}
                loopAnimation={true}
                tween={this.boxTween[1]}
                tweenStart='auto'
                onTweenFinish={(spriteKey, stopped) => this.onTweenFinish(spriteKey, stopped)}
                stopTweenOnPressIn={() => {}}
              />
            : null}
            {this.state.showBoxes[2] ?
              <AnimatedSprite
                key={this.state.boxKeys[2]}
                spriteKey={3}
                coordinates={{top: 420, left: this.left[2]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 3)}
                character={squareCharacter}
                spriteAnimationKey={this.wrongChoices[1]}
                loopAnimation={true}
                tween={this.boxTween[2]}
                tweenStart='auto'
                onTweenFinish={(spriteKey, stopped) => this.onTweenFinish(spriteKey, stopped)}
                stopTweenOnPressIn={() => {}}
              />
            : null}
          </View>
          <AnimatedSprite
            key={this.state.mammalKey}
            coordinates={{top: 300, left: 800}}
            size={{width: 256, height: 256}}
            draggable={false}
            character={mammalCharacter}
            spriteAnimationKey={this.state.mammalSpriteAnimationKey}
            onAnimationFinish={(animation) => this.onAnimationFinish(animation)}
            loopAnimation={this.state.loopAnimation}
          />
        {this.state.showFood ?
          <AnimatedSprite
            key={this.state.foodKey}
            spriteKey={5}
            coordinates={{top: 200, left: 770}}
            size={{width: 70, height: 70}}
            tween={{
              tweenType: 'curve-spin',
              startXY: [570, 200],
              endXY: [850, 350],
              duration: 1250,
              loop: false,
            }}
            tweenStart='auto'
            onTweenFinish={(spriteKey) => this.onTweenFinish(spriteKey)}
            character={grassCharacter}
          />
          : null}
        </View>

      </Image>
    );
  }
}

GameFour.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};


export default GameFour;
