"use strict";

import React, { Component } from 'react';
import {
  Animated,
  Easing,
} from 'react-native';


class Tweener extends React.Component {

  componentDidMount () {
    let tweenType = this.props.type;
    switch (tweenType) {
      case 'sine-wave':
        this.sineWave(this.props.options, this.props.state);
        break;
      case 'bounce':
        this.bounce(this.props.options, this.props.state);
        break;
      case 'slip-slide':
        this.slipSlide(this.props.options, this.props.state);
        break;
      case 'pulse':
        this.pulse(this.props.options, this.props.state);
        break;
      case 'wiggle':
        this.wiggle(this.props.options, this.props.state);
        break;
      case 'bounce-drop':
        this.bounceDrop(this.props.options, this.props.state);
        break;
      case 'zoom':
        this.zoom(this.props.options, this.props.state);
        break;
      case 'hop':
        this.hop(this.props.options, this.props.state);
        break;
      case 'tumble-off':
        this.tumbleOff(this.props.options, this.props.state);
        break;
      case 'spin':
        this.spin(this.props.options, this.props.state);
        break;
      case 'hop-forward':
        this.hopForward(this.props.options, this.props.state);
        break;
      case 'sendOffScreen':
        this.sendOffScreen(this.props.options, this.props.state);
        break;
      case 'basic-back':
        this.basicBack(this.props.options, this.props.state);
        break;
      case 'curve-spin':
        this.curveSpin(this.props.options, this.props.state);
        break;
      case 'move':
        this.move(this.props.options, this.props.state);
        break;
      case 'curve-fall':
        this.curveFall(this.props.options, this.props.state);
        break;
      case 'curve-spin2':
        this.curveSpin2(this.props.options, this.props.state);
        break;
      case 'curve-spin3':
        this.curveSpin3(this.props.options, this.props.state);
        break;
    }
  }

  sineWave(options, state) {
    if (this.props.stop) {
      let stopValues = [];
      state.left.stopAnimation((value) => stopValues.push(value));
      state.top.stopAnimation((value) => stopValues.push(value));
      this.props.stopValues(stopValues);
    }
    else {
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
          this.props.onTweenFinish (true);
        } else{
          this.sineWave(options, state);
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

  bounce (options, state) {
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
        this.props.onTweenFinish (true);
        return;
      }
      bounce(options, state);
    });

  };

  move  (options, state) {



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
        this.props.onTweenFinish (true);
        return;
      }
      move(options, state);
    });
  };

 pulse(options, state) {
   if (this.props.stop) {
     let stopValues = [];
     state.scale.stopAnimation((value) => stopValues.push(value));
     this.props.stopValues(stopValues);
   }
   else{
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
        this.props.onTweenFinish (true);
      } else{
         this.pulse(options, state);
       }
     });
   }
 }

 wiggle(options, state) {
   if (this.props.stop) {
     let stopValues = [];
     state.rotateZ.stopAnimation((value) => stopValues.push(value));
     this.props.stopValues(stopValues);
   }
   else {
     Animated.sequence([
       Animated.timing(
         state.rotateZ,
         {
           toValue: 3,
           easing: Easing.linear,
           duration: 100,
           //delay: 1000,
         }
       ),
       Animated.timing(
         state.rotateZ,
         {
           toValue: -3,
           easing: Easing.linear,
           duration: 100,
         }
       ),
       Animated.spring(
         state.rotateZ,
         {
           toValue: 0,
           friction: 1,
           duration: 0,
         }
       ),
     ]).start(() => {
       if (options.loop === false) {
        this.props.onTweenFinish (true);
        return
      } else{
         this.wiggle(options, state);
       }
     });
   }
 }

 bounceDrop (options, state) {
   if (this.props.stop) {
     let stopValues = [];
     state.left.stopAnimation((value) => stopValues.push(value));
     state.top.stopAnimation((value) => stopValues.push(value));
     this.props.stopValues(stopValues);
   }
   else {
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
        this.props.onTweenFinish (true);
         return
       } else{
         bounceDrop(options, state);
       }
     });
   }
 }

 zoom (options, state) {
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
      this.props.onTweenFinish (true);
       return;
     }
     zoom(options, state);
   });
 }

  hop(options, state) {
    state.top.setValue(options.startY);
    Animated.sequence([
      Animated.timing(
        state.top,
        {
          toValue: (options.startY - 75),
          easing: Easing.linear,
          duration: 300,
        }
      ),
      Animated.timing(
        state.top,
        {
          toValue: options.startY,
          easing: Easing.bounce,
          duration: 700,
        }
      ),
    ]).start(() => {
      if (options.loop === false) {
        this.props.onTweenFinish (true);
        return
      } else{
        hop(options, state);
      }
    });
  }

  tumbleOff(options, state) {

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
        this.props.onTweenFinish (true);
        return
      } else{
        tumbleOff(options, state);
      }
    });
  }

  spin(options, state) {

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
        this.props.onTweenFinish (true);
        return
      } else{
        spin(options, state);
      }
    });
  }

  hopForward(options, state) {

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
          this.props.onTweenFinish (true);
          return
        } else{
          hopForward(options, state);
        }
      });
  }

  sendOffScreen(options, state) {
    state.top.setValue(-500);
  }

  basicBack(options, state) {
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
        this.props.onTweenFinish (true);
        return
      } else {
        basicBack(options, state);
      }
    });
  }

  curveSpin(options, state) {
    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.sequence([
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
        Animated.timing(
          state.rotateZ,
          {
            toValue: 400,
            easing: Easing.linear,
            duration: options.duration,
          }
        ),
        Animated.timing(
          state.scale,
          {
            toValue: 0.5,
            easing: Easing.linear,
            duration: options.duration,
          }
        )
      ]),
      Animated.timing(
        state.top,
        {
          toValue: -500,
          duration: 0,
        }
      ),
    ]).start(() => {
      if (options.loop === false) {
        this.props.onTweenFinish (true);
        return
      } else {
        curveSpin(options, state);
      }
    });
  }

  curveSpin2(options, state) {
    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.sequence([
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
        Animated.timing(
          state.rotateZ,
          {
            toValue: 400,
            easing: Easing.linear,
            duration: options.duration,
          }
        ),
      ]),
    ]).start(() => {
      if (options.loop === false) {
        this.props.onTweenFinish (true);
        return
      } else {
        curveSpin2(options, state);
      }
    });
  }

  curveSpin3(options, state) {
    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.sequence([
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
        Animated.timing(
          state.rotateZ,
          {
            toValue: 400,
            easing: Easing.linear,
            duration: options.duration,
          }
        ),
        Animated.timing(
          state.scale,
          {
            toValue: 0.5,
            easing: Easing.linear,
            duration: options.duration,
          }
        )
      ]),
    ]).start(() => {
      if (options.loop === false) {
        this.props.onTweenFinish (true);
        return
      } else {
        curveSpin3(options, state);
      }
    });
  }


  curveFall(options, state) {
    state.left.setValue(options.startXY[0]);
    state.top.setValue(options.startXY[1]);
    Animated.sequence([
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
      ]),
    ]).start(() => {
      if (options.loop === false) {
        this.props.onTweenFinish (true);
        return;
      } else {
        curveSpin(options, state);
      }
    });
  }

  render() {
    return (null);
  }
}


export default Tweener;
