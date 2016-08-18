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
    this.boxTween = [{},{},{}];
    this.left = [];
    this.boxKeys = [0, 1, 2];
    this.showBoxes = [true, true, true];
    this.fixedKeys = [];
    this.boxChosen = false;
    this.fixedSpriteAnimationKeys = [];
    this.correctChoice = undefined;
    this.wrongChoices = [];

    this.state = {
      moveableBoxes: [],
      mammalKey: 3,
      foodKey: 4,
      boxKeys: this.boxKeys,
      mammalSpriteAnimationKey: 'default',
      showFood: false,
      loopAnimation: false,
      showBoxes: this.showBoxes,
    };
  }

  componentWillMount () {
    this.createSequence();
    this.createFixedBoxes();
    this.setUpChoices();
  }

  createSequence () {
    let sequence = [];
    let sequenceChoice = Math.floor(Math.random()*2);
    if (sequenceChoice === 0) {
      sequence = [
        'green', 'green', 'green', 'red', 'red', 'red', 'green', 'green',
      ];
      this.correctChoice = 'green';
      this.wrongChoices.push('red', 'red');
    }
    else {
      sequence = [
        'green', 'red', 'red', 'green', 'red', 'red', 'green', 'red',
      ];
      this.correctChoice = 'red';
      this.wrongChoices.push('green', 'green');
    }
    this.fixedSpriteAnimationKeys.push(sequence);
  }

  createFixedBoxes () {
    let top = 25;
    for (let i=0; i < 9; i++) {
      if (i > 2 && i < 6) { // first row of boxes
        top = 110;
      }
      else if ( i >= 6) { // second row of boxes
        top = 195;
      }
      if (i < 8) {
        fixedBoxes.push(
          <AnimatedSprite
            key={Math.random()}
            coordinates={{top: top, left: ((i%3)*90) + 15}}
            size={{width: 60, height: 60}}
            character={squareCharacter}
            spriteAnimationKey={this.fixedSpriteAnimationKeys[0][i]}
            loopAnimation={true}
          />
        );
      }
      else if (i === 8) { // last box is empty
        fixedBoxes.push(<View key={Math.random()} style={styles.emptyBox}><Text>{' '}</Text></View>);
      }
    }
  }

  // random location of correct choice
  setUpChoices () {
    let correctLocation = Math.floor(Math.random() * 3); // either 0, 1, or 2
    if (correctLocation === 1) {
      this.left = [15, 105, 195];
    }
    else if (correctLocation === 2) {
      this.left = [105, 15, 195];
    }
    else {
      this.left = [105, 195, 15];
    }
  }

  // check if a moveable box has been dragged to dashed box and if true remove it
  checkLocation = (newX, newY, numBox) => {
    if ((newX > 185 && newX < 205) && (newY > 190 && newY < 210) && !this.boxChosen) {
      if (numBox === 1) {
        this.foodFall();
        this.showBoxes[0] = false;
      }
      else {
        this.disgust();
        if (numBox === 2) {
          this.showBoxes[1] = false;
        }
        else {
        this.showBoxes[2] = false;
        }
      }
      this.setState({showBoxes: this.showBoxes});
      this.boxChosen = true; // so they can't drag another box while animal reaction happens
    }

    else {
      this.boxTween[numBox] = {
        tweenType: 'move',
        startXY: [newX, newY],
        endXY: [this.left[numBox - 1], 300],
        duration: 0,
        loop: false,
      };
      this.boxKeys[numBox - 1] = Math.random();
      this.setState({
        boxKeys: this.boxKeys,
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
    this.setState({
      mammalKey: Math.random(),
      mammalSpriteAnimationKey: 'disgust',
    });
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
    else if (animation === 'disgust' || animation === 'celebrate') {
      this.boxChosen = false; // after animal reacts, player can drag boxes again
    }
  }

  render () {
    return (
      <Image source={require('../../backgrounds/Game_4_Background_1280.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.boxContainer}>
            {fixedBoxes}
            {this.state.showBoxes[0] ?
              <AnimatedSprite
                key={this.state.boxKeys[0]}
                spriteKey={1}
                coordinates={{top: 300, left: this.left[0]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 1)}
                character={squareCharacter}
                spriteAnimationKey={this.correctChoice}
                loopAnimation={true}
                tween={this.boxTween[1]}
                tweenStart='auto'
              />
            : null}
            {this.state.showBoxes[1] ?
              <AnimatedSprite
                key={this.state.boxKeys[1]}
                spriteKey={2}
                coordinates={{top: 300, left: this.left[1]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 2)}
                character={squareCharacter}
                spriteAnimationKey={this.wrongChoices[0]}
                loopAnimation={true}
                tween={this.boxTween[2]}
                tweenStart='auto'
              />
            : null}
            {this.state.showBoxes[2] ?
              <AnimatedSprite
                key={this.state.boxKeys[2]}
                spriteKey={3}
                coordinates={{top: 300, left: this.left[2]}}
                size={{width: 60, height: 60}}
                draggable={true}
                draggedTo={(endX, endY) => this.checkLocation(endX, endY, 3)}
                character={squareCharacter}
                spriteAnimationKey={this.wrongChoices[1]}
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
  emptyBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    width: 60,
    height: 60,
    top: 30,
    left: 195,
  },
});

export default GameFour;
