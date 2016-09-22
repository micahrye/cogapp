

const Util = function (scene) {

  return {
    tweenType: "sine-wave",
    startXY: [scene.xLand, scene.yLand],
    xTo: [scene.xLand],
    yTo: [scene.yLand],
    duration: 0,
    loop: false,
  };



};




export default Util;
