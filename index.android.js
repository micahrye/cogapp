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

import Main from "./components/main";
import DragDragon from "./components/DragDragon";
import BubblePop from './components/BubblePop';
import BubblePopWinPage from './components/BubblePopWinPage';
import NextGamePage from './components/NextGamePage';
import BugZap from './components/BugZap';
import BugZapLevel1 from './components/BugZap1';
import BugZapLevel2 from './components/BugZap2';
import BugZapLevel3 from './components/BugZap3';
import GameTwo from './components/GameTwo';
import GameTwoLevel1 from './components/GameTwo1';
import GameTwoLevel2 from './components/GameTwo2';
import GameTwoLevel3 from './components/GameTwo3';


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
    }else if(route.id === 2){
      return <DragDragon />
    }if (route.id === 3) {
      return <BubblePop navigator={navigator} />
    } else if (route.id === 4){
      return <BubblePopWinPage navigator={navigator} route={route}/>
    } else if (route.id === 5){
      return <NextGamePage navigator={navigator} route={route}/>
    } else if (route.id === 6){
      return <BugZap navigator={navigator} />
    } else if (route.id === 7){
      return <BugZapLevel1 navigator={navigator} />
    } else if (route.id === 8){
      return <BugZapLevel2 navigator={navigator} />
    } else if (route.id === 9){
      return <BugZapLevel3 navigator={navigator} />
    } else if (route.id === 10){
      return <GameTwo navigator={navigator} />
    } else if (route.id === 11){
      return <GameTwoLevel1 navigator={navigator} />
    } else if (route.id === 12){
      return <GameTwoLevel2 navigator={navigator} />
    } else if (route.id === 13){
      return <GameTwoLevel3 navigator={navigator} />
    }
  }
}

reactMixin.onClass(CogApp, TimerMixin);



AppRegistry.registerComponent('CogApp', () => CogApp);
