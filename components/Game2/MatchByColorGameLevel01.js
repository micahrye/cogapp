import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'lodash';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../AnimatedSprite/AnimatedSprite';
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import goatLiteCharacter from '../../sprites/goatLite/goatLiteCharacter';
import mammalLiteCharacter from '../../sprites/mammalLite/mammalLiteCharacter';
import lever from '../../sprites/lever/leverCharacter';
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugfoodCharacter from "../../sprites/bugfood/bugfoodCharacter";

import signCharacter from '../../sprites/sign/signCharacter';

import { omnivoreUtils } from './omnivoreUtils';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

class MatchByColorGameLevel01 extends React.Component {

  constructor (props) {
    super(props);
    // customizable function for dropping food/signs into the frame
    this.state = {
      omnivoreAnimationIndex: [0],
      goatAnimationIndex: [0],
      mammalAnimationIndex: [0],
      tweenOmnivore: false,
      loadContent: false,
      dropFood: false,
      signsVisable: false,
    };

    this.omnivore = {tweenOptions: {}};
    this.goat = {tweenOptions: {}};
    this.mammal = {tweenOptions: {}};
    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftFood = {tweenOptions: {}};
    this.middleFood = {tweenOptions: {}};
    this.rightFood = {tweenOptions: {}};
    this.baseFoodLocation = [150, 400];
    this.foodLeftShift = 200;
    this.foodTargetLocation = [300, 550];
    this.foods = [appleCharacter, grassCharacter, canCharacter];
    this.eatInterval;
    this.signInterval;
    this.targetFoodPosition;
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
      omnivore: randomstring({ length: 7 }),
      goat: randomstring({ length: 7 }),
      mammal: randomstring({ length: 7 }),
    };
    this.setState({
      omnivoreAnimationIndex: [0,1,2,3,4,5,6,7],
      goatAnimationIndex: [0,1,2,3,4,5,6,7],
      mammalAnimationIndex: [0,1,2,3,4,5,6],
      loadContent: true,
    });
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        omnivoreAnimationIndex: [0],
        goatAnimationIndex: [0],
        mammalAnimationIndex: [0],
        loadContent: false,
      });
    }, 1500);
  }

  componentDidMount () {

  }

  makeMoveTween (startXY=[40, 400], endXY=[600, 400], duration=1500) {
    return (
      {
        tweenType: "linear-move",
        startXY: startXY,
        endXY: endXY,
        duration: duration,
        loop: false,
      }
    );
  }

  onTweenFinish (characterUID) {
    switch (characterUID) {
      case this.characterUIDs.omnivore:
        this.setState({omnivoreAnimationIndex: omnivoreUtils.normalIndx});
        break;
    }
  }

  leverPressIn () {
    // console.warn('leverPressIn');
  }

  foodBaseLocations () {
    return {
      top: this.baseFoodLocation[0],
      leftLeft: this.baseFoodLocation[1],
      middleLeft: this.baseFoodLocation[1] + this.foodLeftShift,
      rightLeft: this.baseFoodLocation[1] + 2 * this.foodLeftShift,
    };
  }

  initializeMoveDownTweensForSignsAndFoods () {
    this.leftSign.tweenOptions = this.makeMoveTween([350, -300], [350, 0], 800);
    this.middleSign.tweenOptions = this.makeMoveTween([550, -300], [550, 0], 900);
    this.rightSign.tweenOptions = this.makeMoveTween([750, -300], [750, 0], 1000);

    const coords = this.foodBaseLocations();
    this.leftFood.tweenOptions = this.makeMoveTween([coords.leftLeft, -130], [coords.leftLeft, coords.top], 800);
    this.middleFood.tweenOptions = this.makeMoveTween([coords.middleLeft, -130], [coords.middleLeft, coords.top], 900);
    this.rightFood.tweenOptions = this.makeMoveTween([coords.rightLeft, -130], [coords.rightLeft, coords.top], 1000);
  }

  initializeMoveUpTweensForSignsAndFoods () {
    this.leftSign.tweenOptions = this.makeMoveTween([350, 0], [350, -300], 800);
    this.middleSign.tweenOptions = this.makeMoveTween([550, 0], [550, -300], 800);
    this.rightSign.tweenOptions = this.makeMoveTween([750, 0], [750, -300], 800);

    const coords = this.foodBaseLocations();
    this.leftFood.tweenOptions = this.makeMoveTween([coords.leftLeft, coords.top], [coords.leftLeft, -130], 800);
    this.middleFood.tweenOptions = this.makeMoveTween([coords.middleLeft, coords.top], [coords.middleLeft, -130], 800);
    this.rightFood.tweenOptions = this.makeMoveTween([coords.rightLeft, coords.top], [coords.rightLeft, -130], 800);
  }

  leverPress () {
    if (this.state.loadContent || this.state.signsVisable) {
      return;
    }
    // creature enter from left
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);
    // this.goat.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);

    this.initializeMoveDownTweensForSignsAndFoods();

    this.targetFoodPosition = Math.floor(Math.random() * 3);
    // random order of food in signs.
    const order = _.shuffle([0, 1, 2]);
    this.leftFood.character = this.foods[order[0]];
    this.middleFood.character = this.foods[order[1]];
    this.rightFood.character = this.foods[order[2]];
    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    this.rightFood.key = randomstring({length: 7});

    this.omnivore.loopAnimation = true;
    // this.goat.loopAnimation = true;

    this.setState({
      omnivoreAnimationIndex: [6, 7],
      tweenOmnivore: true,
      signsVisable: true},
      () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.leftFood.startTween();
        this.refs.middleFood.startTween();
        this.refs.rightFood.startTween();

        this.refs.omnivoreRef.startTween();
        // this.refs.goatRef.startTween();
      });
  }

  leverPressOut () {
    // console.warn('leverPressOut');
  }

  foodDrop (food, starXY, endXY, duration) {
    this[food].tweenOptions = this.makeMoveTween(
      starXY, endXY, duration);
    this.setState({dropFood: true}, () => {
      this['refs'][food].startTween();
    });
  }

  foodPressed (foodId) {
    if (this.state.dropFood || !(foodId === this.targetFoodPosition)) {
      return;
    }

    const coords = this.foodBaseLocations();
    switch (this.targetFoodPosition) {
      case LEFT:
        this.foodDrop('leftFood', [coords.leftLeft, 150], [300, 520], 800);
        break;
      case MIDDLE:
        this.foodDrop('middleFood', [coords.middleLeft, 150], [300, 520], 800);
        break;
      case RIGHT:
        this.foodDrop('rightFood', [coords.rightLeft, 150], [300, 520], 800);
        break;
    }

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.omnivore.loopAnimation = false;
      // this.goat.loopAnimation = false;
      this.setState({
        dropFood: false,
        omnivoreAnimationIndex: omnivoreUtils.eatIndx,
      }, () => {
        this.liftSigns();
      });
      clearInterval(this.eatInterval);
    }, 300);

  }

  liftSigns () {
    this.initializeMoveUpTweensForSignsAndFoods();

    this.omnivore.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], 2000);
    this.omnivore.loopAnimation = true;

    // this.goat.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], 2000);
    // this.goat.loopAnimation = true;

    clearInterval(this.signInterval);
    this.signInterval = setInterval(() => {
      this.setState({
        omnivoreAnimationIndex: [6, 7],
        tweenOmnivore: true,
        signsVisable: false,
      }, () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.leftFood.startTween();
        this.refs.middleFood.startTween();
        this.refs.rightFood.startTween();
        this.refs.omnivoreRef.startTween();
        // this.refs.goatRef.startTween();
      });
      clearInterval(this.signInterval);
    }, 1500);
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')}
          style={styles.backgroundImage}>

          <AnimatedSprite
            character={lever}
            characterUID={this.characterUIDs.lever}
            animationFrameIndex={[0]}
            loopAnimation={true}
            coordinates={{top: 240, left: 1067 }}
            size={{ width: 213,height: 189 }}
            rotate={[{rotateY:'180deg'}]}
            onPress={() => this.leverPress()}
            onPressIn={() => this.leverPressIn()}
            onPressOut={() => this.leverPressOut()}

          />

          <AnimatedSprite
            character={signCharacter}
            ref={'leftSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300, left: 350}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.leftSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'middleSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300, left: 550}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.middleSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'rightSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300, left: 750}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.rightSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          {this.leftFood.character ?
            <AnimatedSprite
              character={this.leftFood.character}
              ref={'leftFood'}
              key={this.leftFood.key}
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1]}}
              size={{width: 100, height: 108}}
              draggable={false}
              tweenOptions={this.leftFood.tweenOptions}
              tweenStart={'fromCode'}
              onPress={() => this.foodPressed(LEFT)}
            />
          : null}

          {this.middleFood.character ?
            <AnimatedSprite
              character={this.middleFood.character}
              ref={'middleFood'}
              key={this.middleFood.key}
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1] + this.foodLeftShift}}
              size={{width: 120, height: 120}}
              draggable={false}
              tweenOptions={this.middleFood.tweenOptions}
              tweenStart={'fromCode'}
              onPress={() => this.foodPressed(MIDDLE)}
            />
          : null}

          {this.rightFood.character ?
            <AnimatedSprite
              character={this.rightFood.character}
              ref={'rightFood'}
              key={this.rightFood.key}
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1] + 2 * this.foodLeftShift}}
              size={{width: 120, height: 124}}
              draggable={false}
              tweenOptions={this.rightFood.tweenOptions}
              tweenStart={'fromCode'}
              onPress={() => this.foodPressed(RIGHT)}
            />
          : null}

          <AnimatedSprite
            ref={'omnivoreRef'}
            character={omnivoreLite}
            characterUID={this.characterUIDs.omnivore}
            style={{opacity: 1}}
            animationFrameIndex={this.state.omnivoreAnimationIndex}
            loopAnimation={this.omnivore.loopAnimation}
            coordinates={{top: 400, left: -300 }}
            size={{ width: 300, height: 285 }}
            rotate={[{rotateY:'180deg'}]}
            tweenOptions={this.omnivore.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          />

          <AnimatedSprite
            ref={'goatRef'}
            character={goatLiteCharacter}
            characterUID={this.characterUIDs.goat}
            style={{opacity: 1}}
            animationFrameIndex={this.state.goatAnimationIndex}
            loopAnimation={this.goat.loopAnimation}
            coordinates={{top: 420, left: -300 }}
            size={{ width: 300,height: 252 }}
            tweenOptions={this.goat.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          />

        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // styles for background png image/basic black backgroundColor
  // to go behind it
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
});

MatchByColorGameLevel01.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(MatchByColorGameLevel01, TimerMixin);

export default MatchByColorGameLevel01;
