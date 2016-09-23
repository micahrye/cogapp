///////////////////////////////////////////
/****UTILITY FUNCTIONS FOR BUGZAP GAME****/
///////////////////////////////////////////

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const Util = function () {

  const bugIdleSettings = function (scene) {
    return {
      tweenType: "sine-wave",
      startXY: [scene.xLand, scene.yLand],
      xTo: [scene.xLand],
      yTo: [scene.yLand],
      duration: 0,
      loop: false,
    };
  };

  const bugFlyAwaySettings = function (scene) {
    return {
      tweenType: "sine-wave",
      startXY: [scene.xLand, scene.yLand],
      xTo: [-150 * scene.props.scale.width],
      yTo: [0, scene.yLand, 0],
      duration: 1500 * scene.props.scale.width,
      loop: false,
    };
  };

  // 2 different ways bug can reach landing spot
  const initialTween = function (scene) {
    let sequenceX = [680 * scene.props.scale.width, scene.xLand - 50, scene.xLand];
    let sequenceY = [];
    const sequenceChoice = Math.random();
    if (sequenceChoice < .5) {
      sequenceY = [50, scene.yLand, 50, scene.yLand];
    }
    else {
      sequenceY = [250, 150, 100, scene.yLand];
    }
    const distanceFromBottom = 375 * scene.props.scale.height;
    return {
      tweenType: "sine-wave",
      startXY: [SCREEN_WIDTH, SCREEN_HEIGHT - distanceFromBottom],
      xTo: sequenceX,
      yTo: sequenceY,
      duration: scene.flyInDuration,
      loop: false,
    };
  };

  const bugFlyAway = function (scene, whichFly) {
    scene.timeoutNextTrial = setTimeout(() => {
      scene.goToNextTrial();
    }, 2500);
    return {
      bugKey: Math.random(),
      bugTweenSettings: bugFlyAwaySettings(scene),
      bugSpriteAnimationKey: whichFly,
      loopAnimation: false,
    };
  };

  const frogTap = function (scene) {
    if (scene.state.showBug) {
      // bug has landed
      if (scene.state.bugSpriteAnimationKey === 'idle') {
        return frogEat(scene);
      } else if (scene.state.bugTweenSettings != scene.bugTweenAway) {
        // now bug doesn't land, just keeps flying offscreen
        scene.zappedTooEarly = true;
        // bug has not landed yet
        return frogDisgust();

      }
    }
  };

  const frogEat = function (scene) {
    // so that "bugFlyAway" function doesn't run after bug is "caught"
    clearTimeout(scene.timeoutFlyAway);
    return {
      frogKey: Math.random(),
      frogSpriteAnimationKey: 'eat',
    };
  };

  const frogDisgust = function () {
    return {
      frogKey: Math.random(),
      frogSpriteAnimationKey: 'disgust',
    };

  };


  return (
    {
      'bugIdleSettings': bugIdleSettings,
      'bugFlyAwaySettings': bugFlyAwaySettings,
      'initialTween': initialTween,
      'bugFlyAway' : bugFlyAway,
      'frogTap' : frogTap,
      'frogEat' : frogEat,
      'frogDisgust' : frogDisgust,
    }
  );
};

export default Util;
