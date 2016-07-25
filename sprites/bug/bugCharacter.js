"use strict"

const bugCharacter = {
  name:"bug",

  idle: [
    // require("./bug_fly05.png"),
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
    require("./bug_idle02.png"),
    require("./bug_idle03.png"),
  ],

  startFly: [
    require("./bug_fly01.png"),
    require("./bug_fly02.png"),
  ],

  landing:[
    require("./bug_fly05.png"),
  ],

  default:[
    require("./bug_fly03.png"),
    require("./bug_fly04.png"),
  ],

  splat:[
    require("./bug_splat01.png"),
    require("./bug_splat02.png"),
    require("./bug_splat03.png"),
  ],

  bubble: [
  	require("../bubble/bubble_clockwise_large01.png"),
  ]

};

export default bugCharacter;
