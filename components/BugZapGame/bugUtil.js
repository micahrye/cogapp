'use static';

function tweenSettings (screenWidth, screenHeight) {
  return {
    tweenType: "sine-wave",
    startXY: [
      screenWidth, screenHeight - 275
    ],
    xTo: [-120],
    yTo: [
      0, 120, 40, 100, 10
    ],
    duration: 5000,
    loop: false
  };
}

const bugUtil = {
  tweenSettings,
};

export default bugUtil;
