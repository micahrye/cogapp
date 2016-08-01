"use strict"

const bugCharacter = {
  name:"bug",

  idle: [
    require("./bug_idle01.png"),
    require("./bug_idle01.png"),
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
    require("../bubble/bubble_clockwise_large02.png"),
    require("../bubble/bubble_clockwise_large03.png"),
    require("../bubble/bubble_clockwise_large04.png"),
    require("../bubble/bubble_clockwise_large05.png"),
    require("../bubble/bubble_clockwise_large06.png"),
    require("../bubble/bubble_clockwise_large07.png"),
    require("../bubble/bubble_clockwise_large08.png"),
  ],

  prettyIdle: [
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle01.png"),
    require("./prettybug_idle02.png"),
    require("./prettybug_idle03.png"),
  ],

  prettyFly: [
    require("./prettybug_fly03.png"),
    require("./prettybug_fly04.png"),
  ],

  startPrettyFly: [
    require("./prettybug_fly01.png"),
    require("./prettybug_fly02.png"),
  ],

  caught: [
    require("./prettybug_idle01.png"),
  ]

};

export default bugCharacter;
