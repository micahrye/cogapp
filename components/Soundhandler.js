"use strict"

import React, { Component } from 'react';
import Sound from 'react-native-sound';

const TILE_0 = new Sound('tile.mp3', Sound.MAIN_BUNDLE, (error) => {
if (error) {
  //console.warn('failed to load the sound', error);
} else { // loaded successfully
  //console.warn('sound did load');
  }
});

const TILE_1 = new Sound('tile_copy.mp3', Sound.MAIN_BUNDLE, (error) => {
if (error) {
  //console.warn('failed to load the sound', error);
} else { // loaded successfully
  //console.warn('sound did load');
  }
});

// const BUBBLE_POP = new Sound('bubblepop.mp3', Sound.MAIN_BUNDLE, (error) => {
// if (error) {
//   console.warn('failed to load the sound bubble', error);
// } else { // loaded successfully
//   console.warn('sound did load');
//   }
// });

const Soundhandler = function () {

  let flipflop = false;


  const playSound =  function(name) {
    switch(name) {
      case "tile":
        playSoundHelper(TILE_0,TILE_1);
        break;
      case "bubblePop":
        playSoundHelper(BUBBLE_POP, BUBBLE_POP);
        break;
    }
  };

  const playSoundHelper = function(sound, backupSound) {
    if (flipflop) {
      console.warn("backup sound");
      backupSound.stop();
      backupSound.play();
    } else {
      console.warn("sound");
      sound.stop();
      sound.play();
    }
    flipflop = !flipflop;
  }


  // const playSoundHelper = function(sound, backupSound) {
  //   if (sound.getCurrentTime((isPlaying) => {return(isPlaying);})) {
  //     console.warn("anyone?");
  //     backupSound.stop();
  //     backupSound.play();
  //   } else {
  //     console.warn("hey");
  //     sound.stop();
  //     sound.play();
  //   }
  // }

  return (
    {
      "playSound": playSound,
    }
  );

}

export default Soundhandler
