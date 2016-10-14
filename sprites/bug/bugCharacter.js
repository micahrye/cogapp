"use strict"

const bugCharacter = {
  name:"bug",

  all: [
    require("./bug_idle01.png"),
  ],

  default:[
    require("./bug_fly03.png"),
    require("./bug_fly04.png"),
  ],

  idle: [
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

  splat:[
    require("./bug_splat01.png"),
    require("./bug_splat02.png"),
    require("./bug_splat03.png"),
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
  ],

  stillIdle: [
    require("./bug_idle01.png"),
  ],

  green:[
    require("./bug_green.png"),
  ],

  blue:[
    require("./bug_blue.png"),
  ],

  red:[
    require("./bug_red.png"),
  ],

  yellow:[
    require("./bug_yellow.png"),
  ],

};

export default bugCharacter;
