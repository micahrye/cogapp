import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

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
      lowerSigns: false,
      dropFood: false,
    };

    this.omnivore = {};
    this.goat = {};
    this.mammal = {};
    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftFood = {tweenOptions: {}};
    this.middleFood = {tweenOptions: {}};
    this.rightFood = {tweenOptions: {}};
    this.baseFoodLocation = [150, 400];
    this.foodLeftShift = 200;
    this.foodTargetLocation = [300, 550];
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

  omnivorePress () {
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [200, 400]);
    this.setState({omnivoreAnimationIndex: omnivoreUtils.walkIndx});
    this.refs.omnivoreRef.startTween();
    // console.warn("START");
  }

  onTweenFinish () {
    this.setState({omnivoreAnimationIndex: omnivoreUtils.normalIndx});
    // console.warn("TWEEN FINISHED");
  }

  leverPressIn () {
    // console.warn('leverPressIn');
  }

  leverPress () {
    if (this.state.loadContent) {
      return;
    }
    this.leftSign.tweenOptions = this.makeMoveTween([350, -300], [350, 0], 800);
    this.middleSign.tweenOptions = this.makeMoveTween([550, -300], [550, 0], 900);
    this.rightSign.tweenOptions = this.makeMoveTween([750, -300], [750, 0], 1000);

    const top = this.baseFoodLocation[0];
    const l0 = this.baseFoodLocation[1];
    const l1 = this.baseFoodLocation[1] + this.foodLeftShift;
    const l2 = this.baseFoodLocation[1] + 2 * this.foodLeftShift;
    this.leftFood.tweenOptions = this.makeMoveTween([l0, -130], [l0, top], 800);
    this.middleFood.tweenOptions = this.makeMoveTween([l1, -130], [l1, top], 900);
    this.rightFood.tweenOptions = this.makeMoveTween([l2, -130], [l2, top], 1000);

    this.leftFood.character = appleCharacter;
    this.middleFood.character = grassCharacter;
    this.rightFood.character = canCharacter;
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);
    this.omnivore.loopAnimation = true;
    this.setState({
      omnivoreAnimationIndex: [6, 7],
      tweenOmnivore: true,
      lowerSigns: true},
      () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.leftFood.startTween();
        this.refs.middleFood.startTween();
        this.refs.rightFood.startTween();

        this.refs.omnivoreRef.startTween();
      });
  }

  leverPressOut () {
    // console.warn('leverPressOut');
  }

  foodPressed () {
    if (this.state.dropFood) {
      return;
    }
    this.leftFood.tweenOptions = this.makeMoveTween([400, 150], [300, 520], 800);
    this.setState({dropFood: true}, () => {
      this.refs.leftFood.startTween();
    });

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.omnivore.loopAnimation = false;
      this.setState({
        dropFood: false,
        omnivoreAnimationIndex: omnivoreUtils.eatIndx,
      });
      clearInterval(this.eatInterval);
    }, 300);
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
            tweenOptions={{
              tweenType: 'pulse',
              loop: true,
              duration: 500,
            }}
            tweenStart={'auto'}
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
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1]}}
              size={{width: 100, height: 108}}
              draggable={false}
              tweenOptions={this.leftFood.tweenOptions}
              tweenStart={'fromCode'}
              onPress={() => this.foodPressed()}
            />
          : null}

          {this.middleFood.character ?
            <AnimatedSprite
              character={this.middleFood.character}
              ref={'middleFood'}
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1] + this.foodLeftShift}}
              size={{width: 120, height: 120}}
              draggable={false}
              tweenOptions={this.middleFood.tweenOptions}
              tweenStart={'fromCode'}
            />
          : null}

          {this.rightFood.character ?
            <AnimatedSprite
              character={this.rightFood.character}
              ref={'rightFood'}
              animationFrameIndex={[0]}
              coordinates={{
                top: this.baseFoodLocation[0],
                left: this.baseFoodLocation[1] + 2 * this.foodLeftShift}}
              size={{width: 120, height: 124}}
              draggable={false}
              tweenOptions={this.rightFood.tweenOptions}
              tweenStart={'fromCode'}
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
            onPress={() => this.omnivorePress()}
          />
        {/*
          <AnimatedSprite
            ref={'goatRef'}
            character={goatLiteCharacter}
            characterUID={this.characterUIDs.omnivore}
            style={{opacity: 1}}
            animationFrameIndex={this.state.goatAnimationIndex}
            loopAnimation={true}
            coordinates={{top: 400, left: 100 }}
            size={{ width: 300,height: 252 }}
          />
        */}

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

reactMixin.onClass(MatchByColorGameLevel01, TimerMixin);

export default MatchByColorGameLevel01;
