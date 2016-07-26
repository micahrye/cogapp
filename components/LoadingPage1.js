"use strict"

import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  Navigator,
  Easing,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

import AnimatedSprite from "./animatedSprite";

// sprites
import frogCharacter from "../sprites/frog/frogCharacter";
import bugCharacter from "../sprites/bug/bugCharacter";
import bubbleCharacterLarge from "../sprites/bubble/bubbleCharacterLarge";
import bubbleCharacterSmall from "../sprites/bubble/bubbleCharacterSmall";
import omnivoreCharacter from '../sprites/omnivore/omnivoreCharacter';

const Window = Dimensions.get('window');

const LoadingTime = 1500;

class LoadingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bar: new Animated.Value(0),
      textOpacity: new Animated.Value(1.0),
    }
  }

  componentDidMount() {
    setTimeout(() => {this.props.navigator.replace({id: 0});},LoadingTime);
    this.barLoad();
    this.toggleOpacity();
  }

  barLoad() {
    Animated.timing(
      this.state.bar,
      {
        toValue: 200,
        easing: Easing.linear,
        duration: LoadingTime,
      }
    ).start();
  }

  toggleOpacity() {
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
          duration: LoadingTime/3
        }
      )
    ]).start();
  }


  render() {

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
            <Text style={{...text}}>LOADING</Text>
          </Animated.View>
          <Animated.View style ={{...loadingbar}}>
          </Animated.View>
        </View>
        <View>
          <AnimatedSprite coordinates={{top:150,left:50}}
              size={{width:100,height:100}}
              character={frogCharacter}
              spriteAnimationKey={'celebrate'}/>
          <AnimatedSprite coordinates={{top:150,left:100}}
              size={{width:100,height:100}}
              character={frogCharacter}
              spriteAnimationKey={'disgust'}/>
          <AnimatedSprite coordinates={{top:150,left:110}}
              size={{width:100,height:100}}
              character={frogCharacter}
              spriteAnimationKey={'eat0'}/>
          <AnimatedSprite coordinates={{top:150,left:150}}
              size={{width:100,height:100}}
              character={bugCharacter}
              spriteAnimationKey={'idle'}/>
          <AnimatedSprite coordinates={{top:150,left:200}}
              size={{width:100,height:100}}
              character={bugCharacter}
              spriteAnimationKey={'default'}/>
          <AnimatedSprite coordinates={{top:200,left:200}}
              size={{width:100,height:100}}
              character={bugCharacter}
              spriteAnimationKey={'splat'}/>
          <AnimatedSprite coordinates={{top:200,left:250}}
              size={{width:100,height:100}}
              character={bugCharacter}
              spriteAnimationKey={'startFly'}/>
          <AnimatedSprite coordinates={{top:200,left:300}}
              size={{width:100,height:100}}
              character={bugCharacter}
              spriteAnimationKey={'landing'}/>
          <AnimatedSprite coordinates={{top:200,left:350}}
              size={{width:100,height:100}}
              character={bubbleCharacterLarge}
              spriteAnimationKey={'pop'}/>
          <AnimatedSprite coordinates={{top:200,left:400}}
              size={{width:100,height:100}}
              character={bubbleCharacterLarge}
              spriteAnimationKey={'default'}/>
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

export default LoadingPage

