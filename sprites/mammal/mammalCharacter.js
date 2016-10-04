"use strict";

const mammalCharacter = {
  name:"mammal",

  default:[
    require("./dog_celebrate01.png"),
  ],

  eat:[
    require("./dog_eat01.png"),
    require("./dog_eat02.png"),
    require("./dog_eat03.png"),
    require("./dog_eat04.png"),
    require("./dog_eat05.png"),
    require("./dog_eat06.png"),
    require("./dog_eat07.png"),
  ],

  openMouth:[
    require("./dog_eat01.png"),
    require("./dog_eat02.png"),
    require("./dog_eat03.png"),
  ],

  readyToEat:[
    require("./dog_eat04.png"),
  ],

  chew:[
    require("./dog_eat05.png"),
    require("./dog_eat06.png"),
    require("./dog_eat07.png"),
  ],

  disgust:[
    require("./dog_disgust01.png"),
    require("./dog_disgust02.png"),
    require("./dog_disgust03.png"),
  ],

  celebrate:[
    //require("./dog_celebrate01.png"), // bc the first celebrate is already part of default
    require("./dog_celebrate02.png"),
    require("./dog_celebrate03.png"),
    require("./dog_celebrate04.png"),
  ],

  walk:[
    require("./dog_walk01.png"),
    require("./dog_walk02.png"),
    require("./dog_walk03.png"),
    require("./dog_walk04.png"),
    require("./dog_walk05.png"),
    require("./dog_walk06.png"),
    require("./dog_walk07.png"),
    require("./dog_walk08.png"),
    require("./dog_walk09.png"),
    require("./dog_walk10.png"),
    require("./dog_walk11.png"),
    require("./dog_walk12.png"),
    require("./dog_walk13.png"),
    require("./dog_walk14.png"),
    require("./dog_walk15.png"),
  ],

  green:[
    require("./mammal_green.png"),
  ],

  blue:[
    require("./mammal_blue.png"),
  ],

  red:[
    require("./mammal_red.png"),
  ],

  yellow:[
    require("./mammal_yellow.png"),
  ],

};

export default mammalCharacter;
