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
    this.id = 0;
  }

  componentDidMount() {
    // this.getId();
    // setTimeout(()=>{
    //   this.props.navigator.replace({
    //   id: this.id,
    // });
  }

  // getId(){
  //   switch
  //     case
  // }

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
