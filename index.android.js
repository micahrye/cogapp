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

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

//import AnimatedSprite from "./components/animatedSprite";
import Main from "./components/main";
import Flyer from "./components/flyer";
import DragDragon from "./components/DragDragon";
import GamePage from './GamePage';
import GameWinPage from './GameWinPage';
import NextGamePage from './NextGamePage';

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
    }else if(route.id === 2){
      return <DragDragon />
    }if (route.id === 3) {
      return <GamePage navigator={navigator} />
    } else if (route.id === 4){
      return <GameWinPage navigator={navigator} route={route}/>
    } else if (route.id === 5){
      return <NextGamePage navigator={navigator} route={route}/>
    }
  }
}

reactMixin.onClass(CogApp, TimerMixin);



AppRegistry.registerComponent('CogApp', () => CogApp);
