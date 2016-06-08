/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

import AnimatedSprite from "./components/animatedSprite";

class CogApp extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  render() {
    return (
      <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
        style={styles.container}
        activeOpacity={1.0}>
        <View style={styles.container}>
          <AnimatedSprite />
        </View>
      </TouchableOpacity>
    );
  }

}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      //justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#ff00ff',
      borderStyle: 'dashed',
    },
    box: {
      borderColor: 'red',
      backgroundColor: '#fff',
      borderWidth: 1,
      padding: 10,
      width: 100,
      height: 100
    }
  });


AppRegistry.registerComponent('CogApp', () => CogApp);
