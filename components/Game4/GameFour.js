import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import AnimatedSprite from "../animatedSprite";
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import squareCharacter from "../../sprites/square/squareCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";

let fixedBoxes = [];

class GameFour extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      moveableBoxes: [],
      mammalKey: 0,
      foodKey: 1,
      boxKey1: 2,
      boxKey2: 3,
      boxKey3: 4,
      mammalSpriteAnimationKey: 'default',
      boxSpriteAnimationKey: 'red',
      targetBoxSpriteAnimationKey: 'green',
      showFood: false,
      loopAnimation: false,
      showBox1: true,
      showBox2: true,
      showBox3: true,
    };
//    this.boxSpriteAnimationKey = 'default';
    this.boxTween = [{},{},{}];
    this.left = [];

  }

  componentWillMount () {
    this.createFixedBoxes();
    this.setUpChoices();
  }

  createFixedBoxes () {
    // create fixed boxes
    for (let i=0; i < 9; i++) {
      if (i < 8) { // put text in first 8 boxes
        fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}><Text style={styles.text}>{i}</Text></View>);
      }
      else if (i === 8) {
        fixedBoxes.push(<View key={i} style={this.getBoxStyles(i)}><Text>{' '}</Text></View>);
      }
    }
  }

  setUpChoices () {
    // random location of correct choice
    let correctLocation = Math.floor(Math.random() * 3); // either 0, 1, or 2
    if (correctLocation === 1) {
      this.setState({ // TODO this all kinda sucks too
        left1: 15,
        left2: 105,
        left3: 195,
      });
      this.left = [15, 105, 195];
    }
    else if (correctLocation === 2) {
      this.setState({
        left1: 105,
        left2: 15,
        left3: 195,
      });
      this.left = [105, 15, 195]; //TODO I feel like I'm onto something with this, maybe use this.left instead of state in render...
    }
    else {
      this.setState({
        left1: 105,
        left2: 195,
        left3: 15,
      });
      this.left = [105, 195, 15];
    }
    this.setState({ //TODO this sucks
      boxKey1: Math.random(),
      boxKey2: Math.random(),
      boxKey3: Math.random(),
    });
  }

  // check if a moveable box has been dragged to dashed box and if true remove it
  checkLocation = (newX, newY, numBox) => {
    if ((newX > 185 && newX < 205) && (newY > 190 && newY < 210)) {
      if (numBox === 1) {
        this.foodFall();
        this.setState({showBox1: false});
      }
      else {
        this.disgust();
        if (numBox === 2) {
          this.setState({showBox2: false});
        }
        else {
          this.setState({showBox3: false});
        }
      }
    }

    else {
      console.warn('here');
      this.boxTween[numBox] = {
        tweenType: 'move',
        startXY: [newX, newY],
        endXY: [this.left[numBox - 1], 300],
        duration: 0,
        loop: false,
      };
      this.setState({ //TODO figure out some better way of doing this than just resetting all or using if statements
        boxKey1: Math.random(),
        boxKey2: Math.random(),
        boxKey3: Math.random(),
      });
    }
  }

  foodFall () {
    this.setState({
      showFood: true,
      mammalKey: Math.random(),
      mammalSpriteAnimationKey: 'openMouth',
    });
  }

  disgust () {
    this.setState({mammalKey: Math.random(), mammalSpriteAnimationKey: 'disgust'});
  }

  onTweenFinish () {
    this.setState({
      mammalKey: Math.random(),
      mammalSpriteAnimationKey: 'chew',
      showFood: false,
      loopAnimation: false,
    });
  }

  onAnimationFinish (animation) {
    if (animation === 'chew') {
      this.setState({
        mammalKey: Math.random(),
        mammalSpriteAnimationKey: 'celebrate',
      });
    }
    else if (animation === 'openMouth') {
      this.setState({
        mammalKey: Math.random(),
        mammalSpriteAnimationKey: 'readyToEat',
        loopAnimation: true,
      });
    }
  }

  getBoxStyles (boxNum) {
    let borderStyle = undefined;
    if (boxNum === 8) { // last fixed box is dashed
      borderStyle = 'dashed';
    }
    else {
      borderStyle = 'solid';
    }
    return ({
      borderWidth: 2,
      borderStyle: borderStyle,
      width: 60,
      height: 60,
      margin: 15,
      alignItems: 'center',
    });
  }
  render () {
    return (
      <Image source={require('../../backgrounds/Game_4_Background_1280.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.boxContainer}>
            {fixedBoxes}
            {this.state.showBox1 ?
              <AnimatedSprite
                key={this.state.boxKey1}
                spriteKey={1}
                coordinates={{top: 300, left: this.state.left1}} // can put left in array and just use set state on keys to make less variables
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 1)}
                character={squareCharacter}
                spriteAnimationKey={this.state.targetBoxSpriteAnimationKey}
                loopAnimation={true}
                tween={this.boxTween[1]}
                tweenStart='auto'
              />
            : null}
            {this.state.showBox2 ?
              <AnimatedSprite
                key={this.state.boxKey2}
                spriteKey={2}
                coordinates={{top: 300, left: this.state.left2}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 2)}
                character={squareCharacter}
                spriteAnimationKey={this.state.boxSpriteAnimationKey}
                loopAnimation={true}
                tween={this.boxTween[2]}
                tweenStart='auto'
              />
            : null}
            {this.state.showBox3 ?
              <AnimatedSprite
                key={this.state.boxKey3}
                spriteKey={3}
                coordinates={{top: 300, left: this.state.left3}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 3)}
                character={squareCharacter}
                spriteAnimationKey={this.state.boxSpriteAnimationKey}
                loopAnimation={true}
                tween={this.boxTween[3]}
                tweenStart='auto'
              />
            : null}
          </View>
          <AnimatedSprite
            key={this.state.mammalKey}
            coordinates={{top: 300, left: 800}}
            size={{width: 256, height: 256}}
            draggable={false}
            character={mammalCharacter}
            spriteAnimationKey={this.state.mammalSpriteAnimationKey}
            onAnimationFinish={(animation) => this.onAnimationFinish(animation)}
            loopAnimation={this.state.loopAnimation}
          />
        {this.state.showFood ?
          <AnimatedSprite
            key={this.state.foodKey}
            coordinates={{top: 200, left: 770}}
            size={{width: 70, height: 70}}
            tween={{
              tweenType: 'curve-spin',
              startXY: [570, 200],
              endXY: [850, 350],
              duration: 2000,
              loop: false,
            }}
            tweenStart='auto'
            onTweenFinish={() => this.onTweenFinish()}
            character={grassCharacter}
          />
          : null}
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
    width: 1024,
    flexDirection: 'row',
  },
  backgroundImage: {
    width: 1024,
    height: 600,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: 280,
    height: 400,
    borderWidth: 3,
    left: 372,
    marginTop: 20,
  },
  text: {
    fontSize: 45,
  },
});

export default GameFour;
