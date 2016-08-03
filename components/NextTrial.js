"use strict"

import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

const WINDOW = Dimensions.get('window');

class NextTrial extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(()=>{
      this.props.navigator.replace({
        id: this.props.route.getId(),
        bugTags: this.props.route.bugTags,
        targetDuration: this.props.route.targetDuration,
        trialNumber: this.props.route.trialNumber,
        numFails: this.props.route.numFails,
      });
    }, 2000);
  }

  render() {
    return (
      <View style={styles.background}>
        <Text style={styles.text}>NEXT TRIAL</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'peachpuff',
    width: WINDOW.width,
    height: WINDOW.height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'mediumpurple',
    fontSize: 60,
    fontWeight: 'bold',
  },
});

export default NextTrial
