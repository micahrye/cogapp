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

//import AnimatedSprite from "./components/animatedSprite";
import Main from "./main";
import Flyer from "./flyer";

class CogApp extends React.Component {
  constructor(props){
    super(props);

  }

  componentDidMount() {

  }

  render() {
    return (
      <Navigator
  initialRoute={{name: 'My First Scene', id: 0}}
  renderScene={(route, navigator) => {
      return this.renderScene(route, navigator);
    }
  }
/>
    );
  }

  renderScene(route, navigator){
    if(route.id === 0){
      return <Main navigator={navigator} />
    }else if(route.id === 1){
      return <Flyer navigator={navigator} />
    }
  }
}

reactMixin.onClass(CogApp, TimerMixin);



AppRegistry.registerComponent('CogApp', () => CogApp);
