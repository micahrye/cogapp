import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import lever from '../../sprites/lever/leverCharacter';
// import fountain from '../../sprites/fountain/fountainCharacter';
// import canCharacter from '../../sprites/can/canCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [Window.width*0.65,Window.height*0.5];
const endCoordinates2 = [Window.width*0.6,Window.height*0.4]; // slightly different end coordinates for when the frog is onscreen
// these constants specify the initial locations and spacing of the food items
const startLeft = Window.width*0.4;
const startTop = -250;
const endTopSign = -15;
const endTopCan = Window.height*0.2;
// these coordinates give two points - one onscreen, one off - that the creatures travel between
const creatureStart = [Window.width+500,Window.height*0.5];
const creatureEnd = [Window.width*0.65,Window.height*0.5];

class MatchByColorGameLevel01 extends React.Component {

  constructor (props) {
    super(props);
    // customizable function for dropping food/signs into the frame
    this.state = {
      omnivoreAnimationIndex: [],
      tweenOmnivore: false,
      loadContent: false,
    };

    this.omnivore = {};
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
      omnivore: randomstring({ length: 7 }),
    };
    this.setState({
      omnivoreAnimationIndex: [0,1,2,3,4,5,6,7],
      loadContent: true,
    });
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        bubbleAnimationIndex: [0],
        omnivoreAnimationIndex: [0],
        loadContent: false,
      });
      this.enterCharacter();
    }, 1500);
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
    this.omnivore.tweenOptions = this.makeMoveTween();
    this.setState({tweenOmnivore: true});
    this.refs.omnivoreRef.startTween();
  }

  omnivorePress () {
    debugger;
    debugger;
    this.setState({omnivoreAnimationIndex: [6, 7]});
    this.refs.omnivoreRef.startTween();
    // console.warn("START");
  }

  onTweenFinish () {
    debugger;
    debugger;
    this.setState({omnivoreAnimationIndex: [0]});
    // console.warn("TWEEN FINISHED");
  }

  leverPressIn () {
    // console.warn('leverPressIn');
  }

  leverPress () {
    // console.warn('leverPress');
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
            coordinates={{top: 100, left: 1067 }}
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
            coordinates={{top: 400, left: 40 }}
            size={{ width: 300,height: 285 }}
            rotate={[{rotateY:'180deg'}]}
            tweenOptions={this.omnivore.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            onPress={() => this.omnivorePress()}
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
