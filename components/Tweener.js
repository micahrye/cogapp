"use strict";

import { Animated, Easing } from 'react-native';

const Tweener = function () {

  let looping = false;  // looping bool



  const Looper = function(options, state, anim) {

    if (options.loop === true) {
      looping = !looping;
        } else {
         looping = true;
        }

       if (anim === 'pulse') {
         pulse(options, state);
       } else if (anim === 'wiggle') {
         wiggle(options, state);
       } else if (anim === 'move') {
         move(options, state);
       } else if (anim === 'bounce') {
         bounce(options, state);
       } else if (anim === 'sine-wave') {
         sineWave(options, state);
       } else if (anim === 'bounce-drop') {
         bounceDrop(options, state);
       } else if (anim === 'zoom') {
         zoom(options, state);
       } else if (anim === 'hop') {
         hop(options, state);
       } else if (anim === 'tumble-off') {
         tumbleOff(options, state);
       } else if (anim === 'spin') {
         spin(options, state);
       } else if (anim === 'hop-forward') {
          hopForward(options, state)
       }

     }


  const bounce = function(options, state) {
    if (looping === false) {
      return;
    }
    state.scale.setValue(0.9);
    Animated.spring(
    state.scale,
      {
        toValue: 1.0,
        friction: 2.5,
      }
    ).start(() => {
      if (options.loop === false) {
        looping = false;
      }
      if (options.disappearAfterAnimation) {
        state.opacity.setValue(0);
      }
      bounce(options, state);
    });

  };

  const move = function (options, state) {
    if (looping === false) {
      return;
    }
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
      ).start(() => {
        if (options.loop === false) {
          looping = false;
        }
        if (options.disappearAfterAnimation) {
          state.opacity.setValue(0);
        }
        move(options, state);
      });
  };

  const sineWave = function(options, state){
    if (looping === false) {
      return;
    }
    state.top.setValue(options.startXY[1]);
    state.left.setValue(options.startXY[0]);
    Animated.parallel(
      [
        Animated.sequence(_getSequenceX(options, state)),
        Animated.sequence(_getSequenceY(options, state)),
      ]
    ).start(() => {
      if (options.loop === false) {
        looping = false;
      }
      if (options.disappearAfterAnimation) {
        state.opacity.setValue(0);
      }
      sineWave(options, state);
    });

  }

  const _getSequenceX = function (options, state) {
    const duration = options.duration;
    const numTrasitions = options.xTo.length;
    return options.xTo.map((x, index, array)=>{
      console.log(`X = ${x}`);
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
     if (looping === false) {
       return;
     }
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
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       pulse(options, state);
     });
   }

   const wiggle = function(options, state) {
     if (looping === false) {
       return;
     }
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
       looping = false;
     }
     if (options.disappearAfterAnimation) {
       state.opacity.setValue(0);
     }
     wiggle(options, state);
   });
   }

   const bounceDrop = function(options, state) {
     if (looping === false) {
       return;
     }
     state.left.setValue(options.startXY[0]);
     Animated.timing(
       state.left,
       {
         toValue: options.endXY[0],
         easing: Easing.spring,
         duration: options.duration,
       }
     ).start();
     state.top.setValue(options.startXY[1]);
     Animated.timing(
       state.top,
       {
         toValue: options.endXY[1],
         easing: Easing.bounce,
         duration: options.duration,
       }
     ).start(() => {
       if (options.loop === false) {
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         //state.opacity.setValue(0);
         state.top.setValue(-500); // moves it out of the way of other views
       }
       bounceDrop(options, state);
     });
   }

   const zoom = function(options, state) {
     if (looping === false) {
       return;
     }
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
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       zoom(options, state);
     });
   }

   const hop = function(options, state) {
     if (looping === false) {
       return;
     }
     state.top.setValue(options.startXY[1]);
     Animated.sequence([
       Animated.timing(
         state.top,
         {
           toValue: (options.startXY[1] - 75),
           easing: Easing.linear,
           duration: 100,
         }
       ),
       Animated.timing(
         state.top,
         {
           toValue: options.startXY[1],
           easing: Easing.bounce,
           duration: 500,
         }
       ),
     ]).start(() => {
       if (options.loop === false) {
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       hop(options, state);
     });
   }

   const tumbleOff = function(options, state) {
     if (looping === false) {
       return;
     }
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
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       tumbleOff(options, state);
     });

   }

   const spin = function(options, state) {
     if (looping === false) {
       return;
     }
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
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       spin(options, state);
     });
   }

   const hopForward = function(options, state) {
     if (looping === false) {
       return;
     }
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
         looping = false;
       }
       if (options.disappearAfterAnimation) {
         state.opacity.setValue(0);
       }
       hopForward(options, state);
     });
   }

  return (
    {
      'bounce': bounce,
      'slip-slide': move,
      'sine-wave': sineWave,
      'pulse': pulse,
      'Looper': Looper,
      'wiggle': wiggle,
      'bounce-drop': bounceDrop,
      'zoom': zoom,
      'hop': hop,
      'tumble-off': tumbleOff,
      'spin': spin,
      'hop-forward': hopForward,
    }
  );
};

export default Tweener;
