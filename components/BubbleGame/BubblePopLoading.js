"use strict";

import React, { Component } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Easing,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";

// sprites
import bubbleCharacter from "../../sprites/bubble/bubbleCharacterLarge";
import omnivoreCharacter from "../../sprites/omnivore/omnivoreCharacter";

const Window = Dimensions.get('window');

const LoadingTime = 1500;

class BubblePopLoading extends Component {

    constructor (props) {
    super(props);

    this.state = {
      bar: new Animated.Value(0),
      textOpacity: new Animated.Value(1.0),
    };
  }

  componentWillMount () {
  }
  componentDidMount () {
    setTimeout(() => {
      this.props.navigator.replace({
        id: 'BubblePop',
      });
    },LoadingTime);
    this.barLoad();
    this.toggleOpacity();
  }

  barLoad () {
    Animated.timing(
      this.state.bar,
      {
        toValue: 240,
        easing: Easing.linear,
        duration: LoadingTime,
      }
    ).start();
  }

  toggleOpacity () {
    Animated.sequence([
      Animated.timing(
        this.state.textOpacity,
        {
          toValue: 0.2,
          easing: Easing.linear,
          duration: LoadingTime/3,
        }
      ),
      Animated.timing(
        this.state.textOpacity,
        {
          toValue: 1.0,
          easing: Easing.linear,
          duration: LoadingTime/3,
        }
      ),
      Animated.timing(
        this.state.textOpacity,
        {
          toValue: 0.2,
          easing: Easing.linear,
          duration: LoadingTime/3,
        }
      ),
    ]).start();
  }


  render () {

    const loadingbar = {
      backgroundColor: 'deepskyblue',
      height: 50,
      width: this.state.bar,
    };

    const text = {
      color: 'mediumpurple',
      fontSize: 60,
      fontWeight: 'bold',
    };

    return (
      <View>
        <View style={styles.background}>
          <Animated.View style={{opacity:this.state.textOpacity}}>
            <Text style={{...text}}>{'LOADING'}</Text>
          </Animated.View>
          <Animated.View style ={{...loadingbar}}>
          </Animated.View>
        </View>
        <View>
          <View>
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'default'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'pop'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'canBubble'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'appleBubble'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'grassBubble'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={bubbleCharacter}
              spriteAnimationKey={'bugBubble'}
              fps={10}
            />
            <AnimatedSprite
              coordinates={{top:250,left:550}}
              size={{width:100,height:100}}
              character={omnivoreCharacter}
              spriteAnimationKey={'eat'}
              fps={10}
            />
          </View>
        </View>
        <View>
          <Image style={styles.image} source={require('../../backgrounds/Game_7_Background_1280.png')}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'peachpuff',
    width: Window.width,
    height: Window.height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    height: 1,
    width: 1,
  },
});

BubblePopLoading.propTypes = {
  navigator: React.PropTypes.object,
};

export default BubblePopLoading;
