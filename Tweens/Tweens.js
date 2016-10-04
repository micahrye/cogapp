import {
  Animated,
  Easing,
} from 'react-native';

function getSequenceX (options, componentValues) {
  const duration = options.duration;
  const numTrasitions = options.xTo.length;
  return options.xTo.map((x)=>{
    return Animated.timing(componentValues.left, {
        duration: duration / numTrasitions,
        toValue: x,
        easing: Easing.sin,
    });
  });
}

function getSequenceY (options, componentValues) {
  const duration = options.duration;
  const numTrasitions = options.yTo.length;
  return options.yTo.map((y)=>{
    return Animated.timing(componentValues.top, {
      duration: duration / numTrasitions,
      toValue: y,
      easing: Easing.sin,
    });
  });
}


const sineWave = {
  name: 'sine-wave',
  start: function start (options, componentValues, onTweenFinish) {
    componentValues.top.setValue(options.startXY[1]);
    componentValues.left.setValue(options.startXY[0]);
    Animated.sequence([
      Animated.delay(options.delay),
      Animated.parallel(
        [
          Animated.sequence(getSequenceX(options, componentValues)),
          Animated.sequence(getSequenceY(options, componentValues)),
        ]
      )]
    ).start(() => {
      if (options.loop === false) {
        onTweenFinish(true);
      } else {
        start(options, componentValues);
      }
    });
  },
  stop: function (componentValues, sendStopValues) {
    const stopValues = [];
    componentValues.left.stopAnimation((value) => stopValues.push(value));
    componentValues.top.stopAnimation((value) => stopValues.push(value));
    sendStopValues(stopValues);
  },
};

const Tweens = {
  'sine-wave': sineWave,
};

export default Tweens;
