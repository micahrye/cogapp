"use strict";

/*
  In order to load images we must use require, which packages them into the app.
  As a result they cannot be dynamically loaded. For this reason we are using
  a JS file as the loader and meta data file for the animation character.
*/

const greenDragonCharacter = {
  name:"greenDragon",

  idel:[
    require("./green_dragon01.png"),
    require("./green_dragon02.png"),
    require("./green_dragon03.png"),
    require("./green_dragon04.png"),
    require("./green_dragon04.png"),
    require("./green_dragon03.png"),
    require("./green_dragon02.png"),
    require("./green_dragon01.png"),
  ],

  touch:[
    require("./gd_wings01.png"),
    require("./gd_wings02.png"),
    require("./gd_wings03.png"),
    require("./gd_wings04.png"),
    require("./gd_wings05.png"),
    require("./gd_wings06.png"),
  ]

};

export default greenDragonCharacter;
