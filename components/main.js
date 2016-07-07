/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  AppRegistry,
  Navigator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';


class Main extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {

  }

  goToBubblePop = () => {
    this.props.navigator.push({id: 3});
  }

  goToDragon = () => {
    this.props.navigator.push({id: 2});
  }

  goToBugZap = () => {
    this.props.navigator.push({id: 6});
  }

  goToGameTwo = () => {
    this.props.navigator.push({id: 10});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this.goToBubblePop}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To BubblePop</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToDragon}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Dragon</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity onPress={this.goToBugZap}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To BugZap</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToGameTwo}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Game Two</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

reactMixin.onClass(Main, TimerMixin);

/*
let style = {
  position: 'absolute',
  top: Number((val.x * 2.5).toFixed(2)),
  left: Number((val.x * 3).toFixed(2)),
  backgroundColor: '#0000ff',
  color: '#fff'
};
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cce6ff',
  },
  column: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button : {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    margin: 10,
    height: 100,
    width: 200,
    justifyContent: 'center',
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

export default Main;
