"use strict";

const goatLiteCharacter = {
  name:"goat",

  default:[
    require("./goat_celebrate01.png"),
  ],
  walk:[
    require("./goat_walk02.png"),
    require("./goat_walk03.png"),
  ],
  celebrate:[
    require("./goat_celebrate03.png"),
  ],
  eat:[
    require("./goat_celebrate01.png"),
    require("./goat_eat02.png"),
    require("./goat_eat04.png"),
    require("./goat_eat02.png"),
  ],
  disgust:[
    require("./goat_celebrate01.png"),
    require("./goat_disgust03.png"),
    require("./goat_disgust03.png"),
    require("./goat_disgust03.png"),
  ],
  all: [
    require("./goat_celebrate01.png"),
    require("./goat_walk02.png"),
    require("./goat_walk03.png"),
    require("./goat_celebrate03.png"),
    require("./goat_eat02.png"),
    require("./goat_eat04.png"),
    require("./goat_eat02.png"),
    require("./goat_disgust03.png"),
  ],
};

export default goatLiteCharacter;
