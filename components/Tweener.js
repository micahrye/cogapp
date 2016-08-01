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
        duration: options.duration,
      }
    ).start(() => {
      if (options.loop === false) {
        return;
      }
      bounce(options, state);
    });

  };

  const move = function (options, state) {



    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);

    Animated.parallel([
      Animated.timing(          // Uses easing functions
        state.left,    // The value to drive
        {
          toValue: options.endXY[0],
          easing: Easing.linear,
          duration: options.duration, 
        }            // Configuration
      ),

      Animated.timing(          // Uses easing functions
        state.top,    // The value to drive
        {
          toValue: options.endXY[1],
          easing: Easing.linear,
          duration: options.duration,
        }            // Configuration
      ),
    ]).start(() => {
      if (options.loop === false) {
        return;
      }
      move(options, state);
    });
  };

  const sineWave = function(options, state, stopTween){
    if(stopTween){
      state.left.stopAnimation();
    }
    else{
      state.top.setValue(options.startXY[1]);
      state.left.setValue(options.startXY[0]);
      Animated.parallel(
        [
          Animated.sequence(_getSequenceX(options, state)),
          Animated.sequence(_getSequenceY(options, state)),
        ]
      ).start(() => {
        if (options.loop === false) {
          return
        }else{
          sineWave(options, state);
        }

      });
    }

  }

  const _getSequenceX = function (options, state) {
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

 const pulse = function(options, state) {
   state.scale.setValue(1);
   Animated.sequence([
     Animated.timing(
       state.scale,
       {
         toValue: 1.25,
         easing: Easing.linear,
         duration: 400,
       }
     ),
     Animated.timing(
       state.scale,
       {
         toValue: 1,
         easing: Easing.linear,
         duration: 400,
       }
     ),
   ]).start(() => {
     if (options.loop === false) {
       return
     }else{
       pulse(options, state);
     }
   });
 }
 const wiggle = function(options, state) {
   Animated.sequence([
   Animated.timing(
     state.rotation,
     {
       toValue: 3,
       easing: Easing.linear,
       duration: 100,
     }
   ),
   Animated.timing(
     state.rotation,
     {
       toValue: -3,
       easing: Easing.linear,
       duration: 100,
     }
   ),
   Animated.spring(
     state.rotation,
     {
       toValue: 0,
       friction: 1,
     }
   ),
 ]).start(() => {
   if (options.loop === false) {
     return
   }else{
     wiggle(options, state);
   }
 });
 }

 const bounceDrop = function(options, state) {
  //  state.left.setValue(options.startXY[0]);
  //  Animated.timing(
  //    state.left,
  //    {
  //      toValue: options.endXY[0],
  //      easing: Easing.spring,
  //      duration: options.duration,
  //    }
  //  ).start();
   state.top.setValue(options.startY);
   Animated.timing(
     state.top,
     {
       toValue: options.endY,
       easing: Easing.bounce,
       duration: options.duration,
     }
   ).start(() => {
     if (options.loop === false) {
       return
     }else{
       bounceDrop(options, state);
     }
   });
 }

 const zoom = function(options, state) {
   state.left.setValue(options.startXY[0]);
   Animated.timing(
     state.left,
     {
       toValue: options.endXY[0],
       easing: Easing.back(3),
       duration: options.duration,
     }
   ).start();
   state.top.setValue(options.startXY[1]);
   Animated.timing(
     state.top,
     {
       toValue: options.endXY[1],
       easing: Easing.back(3),
       duration: options.duration,
     }
   ).start(() => {
     if (options.loop === false) {
       return;
     }
     zoom(options, state);
   });
 }

  const hop = function(options, state) {
    state.top.setValue(options.startY);
    Animated.sequence([
      Animated.timing(
        state.top,
        {
          toValue: (options.startY - 75),
          easing: Easing.linear,
          duration: 100,
        }
      ),
      Animated.timing(
        state.top,
        {
          toValue: options.startY,
          easing: Easing.bounce,
          duration: 500,
        }
      ),
    ]).start(() => {
      if (options.loop === false) {
        return
      }else{
        hop(options, state);
      }
    });
  }

  const tumbleOff = function(options, state) {

    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    state.rotation.setValue(0)
    Animated.parallel([
      Animated.timing(
        state.left,
        {
          toValue: options.endXY[0],
          easing: Easing.back(3),
          duration: options.duration,
        }
      ),
      Animated.timing(
        state.top,
        {
          toValue: options.endXY[1],
          easing: Easing.back(3),
          duration: options.duration,
        }
      ),
      Animated.timing(
        state.rotation,
        {
          toValue: options.endXY[0],
          easing: Easing.back(3),
          duration: options.duration,
        }
      )
    ]).start(() => {
      if (options.loop === false) {
        return
      }else{
        tumbleOff(options, state);
      }
    });
  }

  const spin = function(options, state) {

    state.rotation.setValue(0);
    Animated.timing(
      state.rotation,
      {
        toValue: 100,
        easing: Easing.linear,
        duration: options.duration,
      }
    ).start(() => {
      if (options.loop === false) {
        return
      }else{
        spin(options, state);
      }
    });
  }

  const hopForward = function(options, state) {

    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(
          state.left,
          {
            toValue: options.endXY[0]/2,
            easing: Easing.sin,
            duration: options.duration/2,
          }
        ),
        Animated.timing(
          state.left,
          {
            toValue: options.endXY[0],
            easing: Easing.sin,
            duration: options.duration/2,
            delay: 100,
          }
        ),
      ]),
      Animated.sequence([
        Animated.timing(
          state.top,
          {
            toValue: options.yTo[0],
            easing: Easing.linear,
            duration: options.duration/4,
          }
        ),
        Animated.timing(
          state.top,
          {
            toValue: options.startXY[1],
            easing: Easing.linear,
            duration: options.duration/4,
          }
        ),
        Animated.timing(
          state.top,
          {
            toValue: options.yTo[0],
            easing: Easing.linear,
            duration: options.duration/4,
            delay: 100,
          }
        ),
        Animated.timing(
          state.top,
          {
            toValue: options.startXY[1],
            easing: Easing.linear,
            duration: options.duration/4,
          }
        ),
      ]),
    ]).start(() => {
        if (options.loop === false) {
          return
        }else{
          hopForward(options, state);
        }
      });
  }

  const sendOffScreen = function(options, state) {
    state.top.setValue(-500);
  }

  const basicBack = function(options, state) {
    state.top.setValue(options.startY);
    Animated.timing(
      state.top,
      {
        toValue: options.endY,
        easing: Easing.back(1.5),
        duration: options.duration,
      }
    ).start(() => {
      if (options.loop === false) {
        return
      }else {
        basicBack(options, state);
      }
    });
  }

  const curveSpin = function(options, state) {
    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.parallel([
      Animated.timing(
        state.top,
        {
          toValue: options.endXY[1],
          easing: Easing.quad,
          duration: options.duration,
        }
      ),
      Animated.timing(
        state.left,
        {
          toValue: options.endXY[0],
          easing: Easing.linear,
          duration: options.duration,
        }
      ),
      // Animated.timing(
      //   state.rotation,
      //   {
      //     toValue: 400,
      //     easing: Easing.quad,
      //     duration: options.duration,
      //   }
      // ),
    ]).start(() => {
      if (options.loop === false) {
        return
      }else {
        curveSpin(options, state);
      }
    });
  }

  return (
    {
      'bounce': bounce,
      'slip-slide': move,
      'sine-wave': sineWave,
      'pulse': pulse,
      'wiggle': wiggle,
      'bounce-drop': bounceDrop,
      'zoom': zoom,
      'hop': hop,
      'tumble-off': tumbleOff,
      'spin': spin,
      'hop-forward': hopForward,
      'sendOffScreen': sendOffScreen,
      'basic-back': basicBack,
      'curve-spin': curveSpin,
      'move': move,
    }
  );

};

export default Tweener;
