"use strict";

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Easing,
} from 'react-native';


class Tweener extends React.Component{

  componentDidMount() {
    this.sineWave(this.props.options, this.props.state, this.props.stop, this.props.stopValues);
  }
  
  sineWave(options, state, stop, stopValues){
    if(stop){
      let stopValues = [];
      state.left.stopAnimation((value) => stopValues.push(value));
      state.top.stopAnimation((value) => stopValues.push(value));
      this.props.stopValues(stopValues);
    }
    else{
      state.top.setValue(options.startXY[1]);
      state.left.setValue(options.startXY[0]);
      Animated.sequence([
        Animated.delay(options.delay),
        Animated.parallel(
          [
            Animated.sequence(this._getSequenceX(options, state)),
            Animated.sequence(this._getSequenceY(options, state)),
          ]
        )
      ]).start(() => {
        if (options.loop === false) {
          this.props.tweenHasEnded(true);
        }else{
          this.sineWave(options, state, stop);
        }

      });
    }
  }

  _getSequenceX(options, state) {
    const duration = options.duration;
    const numTrasitions = options.xTo.length;
    return options.xTo.map((x, index, array)=>{
      return Animated.timing(state.left, {
          duration: duration / numTrasitions,
          toValue: x,
          easing: Easing.sin,
      })
    });
  }

  _getSequenceY(options, state) {
    const duration = options.duration;
    const numTrasitions = options.yTo.length;
    return options.yTo.map((y, index, array)=>{
      return Animated.timing(state.top, {
          duration: duration / numTrasitions,
          toValue: y,
          easing: Easing.sin,
        })
      });
    }

  

  render() {
    return (null);
  }
}


export default Tweener;
