"use strict";

import { Animated, Easing } from 'react-native';

const Tweener = function () {

  const bounce = function(options, state) {

    state.scale.setValue(0.9);
    Animated.spring(
    state.scale,
      {
        toValue: 1.0,
        friction: 2.5,
      }
    ).start();

  };

  const move = function (options, state) {
    state.top.setValue(options.startXY[0]);
    Animated.timing(          // Uses easing functions
       state.top,    // The value to drive
       {toValue: options.endXY[0],
         easing: Easing.elastic(2),
       duration: 1000, }            // Configuration
     ).start();

     state.left.setValue(options.startXY[1]);
     Animated.timing(          // Uses easing functions
        state.left,    // The value to drive
        {toValue: options.endXY[1],
          easing: Easing.inOut(Easing.poly(2)),
        duration: 1000, }            // Configuration
      ).start();
  };

  const sineWave = function(options, state){

    state.top.setValue(options.startXY[1]);
    state.left.setValue(options.startXY[0]);
    if (options.repeatable){
      triggerRepeatable(options, state);
    }
    else{ 
      Animated.parallel(
        [
          Animated.sequence(_getSequenceX(options, state)),
          Animated.sequence(_getSequenceY(options, state)),
        ]
      ).start();
    }
  }

  const triggerRepeatable = function(options, state){
    Animated.parallel(
        [
          Animated.sequence(_getSequenceX(options, state)),
          Animated.sequence(_getSequenceY(options, state)),
        ]
      ).start( () => {triggerRepeatable(options, state);});
  }

  const _getSequenceX = function (options, state) {
    const duration = options.duration;
    const numTrasitions = options.xTo.length;
    return options.xTo.map((x, index, array)=>{
      return Animated.timing(state.left, {
          duration: duration / numTrasitions,
          toValue: x,
          easing: Easing.sin,
      });
    });
  }

  const _getSequenceY = function (options, state) {
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


  return (
    {
      'bounce': bounce,
      'slip-slide': move,
      'sine-wave': sineWave,
    }
  );
};

export default Tweener;
