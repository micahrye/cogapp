import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import goatLiteCharacter from '../../sprites/goatLite/goatLiteCharacter';
import mammalLiteCharacter from '../../sprites/mammalLite/mammalLiteCharacter';
import lever from '../../sprites/lever/leverCharacter';
import signCharacter from "../../sprites/sign/signCharacter";

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
    };

    this.omnivore = {};
    this.goat = {};
    this.mammal = {};
    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
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
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [200, 400]);
    this.leftSign.tweenOptions = this.makeMoveTween([350, -300], [350, 0]);
    this.middleSign.tweenOptions = this.makeMoveTween([550, -300], [550, 0]);
    this.rightSign.tweenOptions = this.makeMoveTween([750, -300], [750, 0]);
  }

  componentDidMount () {

  }

  makeMoveTween (startXY=[40, 400], endXY=[600, 400]) {
    return (
      {
        tweenType: "linear-move",
        startXY: startXY,
        endXY: endXY,
        duration: 1500,
        loop: false,
      }
    );
  }

  enterCharacter () {
    // // console.warn('enterCharacter');
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [200, 400]);
    this.setState({tweenOmnivore: true});
    this.refs.omnivoreRef.startTween();
  }

  omnivorePress () {
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [200, 400]);
    this.setState({omnivoreAnimationIndex: [6, 7]});
    this.refs.omnivoreRef.startTween();
    // console.warn("START");
  }

  onTweenFinish () {
    this.setState({omnivoreAnimationIndex: [0]});
    // console.warn("TWEEN FINISHED");
  }

  leverPressIn () {
    // console.warn('leverPressIn');
  }

  leverPress () {
    if (this.state.loadContent) {
      return;
    }
    this.leftSign.tweenOptions = this.makeMoveTween([350, -300], [350, 0]);
    this.middleSign.tweenOptions = this.makeMoveTween([550, -300], [550, 0]);
    this.rightSign.tweenOptions = this.makeMoveTween([750, -300], [750, 0]);
    this.omnivore.tweenOptions = this.makeMoveTween([-300, 400], [200, 400]);
    this.setState({
      omnivoreAnimationIndex: [6, 7],
      tweenOmnivore: true,
      lowerSigns: true},
      () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.omnivoreRef.startTween();
      });
  }

  leverPressOut () {
    // console.warn('leverPressOut');
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
            ref={'omnivoreRef'}
            character={omnivoreLite}
            characterUID={this.characterUIDs.omnivore}
            style={{opacity: 1}}
            animationFrameIndex={this.state.omnivoreAnimationIndex}
            loopAnimation={true}
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
            coordinates={{top: 300, left: 80 }}
            size={{ width: 300,height: 252 }}
          />

          <AnimatedSprite
            ref={'mammalRef'}
            character={mammalLiteCharacter}
            characterUID={this.characterUIDs.mammal}
            animationFrameIndex={this.state.mammalAnimationIndex}
            loopAnimation={true}
            coordinates={{top: 300, left: 700 }}
            size={{ width: 174,height: 285 }}
            rotate={[{rotateY:'180deg'}]}
          />
        */}
          <AnimatedSprite
            character={signCharacter}
            ref={'leftSign'}
            animationFrameIndex={[0]}
            coordinates={{top: 0, left: 350}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.leftSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'middleSign'}
            animationFrameIndex={[0]}
            coordinates={{top: 0, left: 550}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.middleSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'rightSign'}
            animationFrameIndex={[0]}
            coordinates={{top: 0, left: 750}}
            size={{width: 188, height: 300}}
            draggable={false}
            tweenOptions={this.rightSign.tweenOptions}
            tweenStart={'fromCode'}
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

reactMixin.onClass(MatchByColorGameLevel01, TimerMixin);

export default MatchByColorGameLevel01;
