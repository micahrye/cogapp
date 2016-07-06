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
import {Motion, spring} from 'react-motion';
import TimerMixin from 'react-timer-mixin';


class Main extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    /*
    this.setTimeout(()=>{
      Alert.alert("Alert Title", "msg");
    }, 1000);
    */
  }

  _handelPress(evt){
    console.log("push it!");
    this.props.navigator.push({id: 1});
    //Alert.alert("Alert Title", "msg");
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

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={(evt)=>{this._handelPress(evt);}}>
          <View style={styles.button}>
            <Text style={styles.text}>Hello You :)</Text>
          </View>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={this.goToBugZap}>
          <View style={styles.button}>
            <Text style={styles.text}>Go To BugZap</Text>
          </View>
        </TouchableOpacity>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cce6ff',
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


/*
<Motion defaultStyle={{x: 0}} style={{x: spring(100)}}>
  {val => {
    let style = {
      position: 'absolute',
      top: val.x * 2.5,
      left: val.x * 3,
      backgroundColor: '#0000ff',
      color: '#fff'
    };
    return (
      <Animatable.View ref="view">
    <Text style={style}>{val.x}</Text>
  </Animatable.View>
      )}}
</Motion>
*/
