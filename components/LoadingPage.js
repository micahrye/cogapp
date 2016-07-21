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

// sprites
import frogCharacter from "../sprites/frog/frogCharacter";
import bugCharacter from "../sprites/bug/bugCharacter";

const LoadingTime = 4000;

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
      <View style={styles.background}>
        <Animated.View style={{opacity:this.state.textOpacity}}>
          <Text style={{...text}}>LOADING</Text>
        </Animated.View>
        <Animated.View style ={{...loadingbar}}>
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'peachpuff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingPage
