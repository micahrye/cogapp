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

} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import Main from "./components/main";
import DragDragon from "./components/DragDragon/DragDragon";
import BubblePopLoading from './components/BubbleGame/BubblePopLoading';
import BubblePop from './components/BubbleGame/BubblePop';
import GameOverPage from './components/BubbleGame/GameOverPage';
import NextGamePage from './components/BubbleGame/NextGamePage';
import BugZapLoading from './components/BugZapGame/BugZapLoading';
import BugZap from './components/BugZapGame/BugZap';
import BugZapLevel1 from './components/BugZapGame/BugZap1';
import BugZapLevel2 from './components/BugZapGame/BugZap2';
import BugZapLevel3 from './components/BugZapGame/BugZap3';
import GameTwo from './components/Game2/GameTwo';
import GameTwoLevel1 from './components/Game2/GameTwo1';
import GameTwoLevel2 from './components/Game2/GameTwo2';
import GameTwoLevel3 from './components/Game2/GameTwo3';
import GameThree from './components/Game3/GameThree';
import GameThree1 from './components/Game3/GameThree1';
import GameThreeLevel2 from './components/Game3/GameThree2';
import GameThreeLevel3 from './components/Game3/GameThree3';
import GameThreeLevel4 from './components/Game3/GameThree4';
import GameFour from './components/Game4/GameFour';
import GameFive from './components/Game5/GameFive';
import GameSix from './components/Game6/GameSix';
import NextTrial from './components/NextTrial'


class CogApp extends React.Component {
  constructor(props){
    super(props);

  }

  componentDidMount() {

  }

  render() {
    return (
      <Navigator
  initialRoute={{name: 'My First Scene', id: 'Main'}}
  renderScene={(route, navigator) => {
      return this.renderScene(route, navigator);
    }
  }
/>
    );
  }

  renderScene(route, navigator){
    if(route.id === 'Main'){
      return <Main navigator={navigator} />
    } else if(route.id === 'DragDragon'){
      return <DragDragon />
    } else if(route.id === 'BubblePopLoading'){
      return <BubblePopLoading navigator={navigator} route={route}/>
    } else if (route.id === 'BubblePop') {
      return <BubblePop navigator={navigator} route={route}/>
    } else if (route.id === 'GameOverPage'){
      return <GameOverPage navigator={navigator} route={route}/>
    } else if (route.id === 'NextGamePage'){
      return <NextGamePage navigator={navigator} route={route}/>
    } else if(route.id === 'BugZapLoading'){
      return <BugZapLoading navigator={navigator} route={route} />
    } else if (route.id === 'BugZap'){
      return <BugZap navigator={navigator} route={route} />
    } else if (route.id === 'BugZap1'){
      return <BugZapLevel1 navigator={navigator} route={route}/>
    } else if (route.id === 'BugZap2'){
      return <BugZapLevel2 navigator={navigator} route={route} />
    } else if (route.id === 'BugZap3'){
      return <BugZapLevel3 navigator={navigator} route={route} />
    } else if (route.id === 'GameTwo'){
      return <GameTwo navigator={navigator} />
    } else if (route.id === 'GameTwo1'){
      return <GameTwoLevel1 navigator={navigator} />
    } else if (route.id === 'GameTwo2'){
      return <GameTwoLevel2 navigator={navigator} />
    } else if (route.id === 'GameTwo3'){
      return <GameTwoLevel3 navigator={navigator} />
    } else if (route.id === 'GameThree'){
      return <GameThree navigator={navigator} />
    } else if (route.id === 'GameThree1'){
      return <GameThree1 navigator={navigator} />
    } else if (route.id === 'GameThree2'){
      return <GameThreeLevel2 navigator={navigator} />
    } else if (route.id === 'GameThree3'){
      return <GameThreeLevel3 navigator={navigator} />
    } else if (route.id === 'GameThree4'){
      return <GameThreeLevel4 navigator={navigator} />
    } else if (route.id === 'GameFour'){
      return <GameFour navigator={navigator} />
    } else if (route.id === 'GameFive'){
      return <GameFive navigator={navigator} />
    } else if (route.id === 'GameSix'){
      return <GameSix navigator={navigator} route={route}/>
    } else if(route.id === 'NextTrial'){
      return <NextTrial navigator={navigator} route={route}/>
    } 
  }
}

reactMixin.onClass(CogApp, TimerMixin);

AppRegistry.registerComponent('CogApp', () => CogApp);
