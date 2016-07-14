import React, { Component } from 'react';
import AnimatedSprite from "./animatedSprite";
import platformCharacter from "../sprites/platform/platformCharacter";

// create a class for individual tiles so GameThree2's render will
// be neater and easier to read
class Tile extends Component {
  render() {

    const tweenOpts01 = {
      tweenType: "bounce",
      repeatable: true,
      loop: false,
    };

    return (
      <AnimatedSprite coordinates={{top: this.props.top, left: this.props.left}}
              size={{width: this.props.width, height: this.props.height}}
              draggable={false}
              character={platformCharacter}
              soundOnTouch={true}
              soundFile="tile"
              tweenStart="touch"
              tween={tweenOpts01}/>
    );
  }
}

export default Tile
