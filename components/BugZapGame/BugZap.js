import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Navigator
} from 'react-native';

// imports
import AnimatedSprite from "../animatedSprite";
// import characters for animatedsprite to use
import frogCharacter  from "../../sprites/frog/frogCharacter";
import bugCharacter   from '../../sprites/bug/bugCharacter';
import Background     from '../../backgrounds/Game_1_Background_1280.png';
import bugUtil        from './bugUtil';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      flies: [ Math.random().toString(36).substring(20),
        Math.random().toString(36).substring(20),
        Math.random().toString(36).substring(20),
        Math.random().toString(36).substring(20),
      ]
    }
  }

  componentDidMount() {}

  // go to next level
  buttonPress = () => {
    this.props.navigator.push({id: 7});
  }

  changeTouchType(currentAnimationType){
    return currentAnimationType;
  }

  getRef(ref){
    //debugger;
    if (!ref) {
      return;
    }
  }
  handlePress (name) {
    if (true) {
      //debugger;
      //console.warn("what");
      this.removeBugs();
    }
  }
  removeBugs () {
    this.setState({flies: []})
  }
  render() {
    // automatic sine wave from right to left across screen
    const tweenSettings = bugUtil.tweenSettings(SCREEN_WIDTH, SCREEN_HEIGHT);
    const coordinates = { top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200 };
    // array holding fly sprites
    let flies = [];
    // declare 5 fly variables, store them in flies
    let bugs = [];
    //debugger;
    this.state.flies.forEach((uid, i) => {
      const tweens = { ...tweenSettings };
      tweens.yTo = [i * 10, 20 * i, 40 + (i * 5), 100 + (4 * i), 10 ];
      bugs.push(<AnimatedSprite key={i} coordinates={coordinates} size={{
          width: 128,
          height: 128
        }} draggable={false}
        character={bugCharacter}
        tween={tweens} tweenStart="auto"
        changeTouchType={this.changeTouchType}
      />);
    });

    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage}>
          <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
            <Text>Go to Level 1</Text>
          </TouchableOpacity>
          {bugs}
          <AnimatedSprite coordinates={coordinates} size={{
              width: 256,
              height: 256
            }} draggable={false} character={frogCharacter}
            changeTouchType={this.changeTouchType}
            ref={(ref) => {this.getRef(ref)}}
            onPress={() => {this.handlePress()} }
          />
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 90,
    height: 30
  }
});

export default BugZap;
