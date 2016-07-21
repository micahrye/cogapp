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
import BubblePop from './components/BubbleGame/BubblePop';
import BubblePopWinPage from './components/BubbleGame/BubblePopWinPage';
import NextGamePage from './components/BubbleGame/NextGamePage';
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
import LoadingPage from './components/LoadingPage';
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
  initialRoute={{name: 'My First Scene', id: 22}}
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
    } else if (route.id === 14){
      return <GameThree navigator={navigator} />
    } else if (route.id === 15){
      return <GameThree1 navigator={navigator} />
    } else if (route.id === 16){
      return <GameThreeLevel2 navigator={navigator} />
    } else if (route.id === 17){
      return <GameThreeLevel3 navigator={navigator} />
    } else if (route.id === 18){
      return <GameThreeLevel4 navigator={navigator} />
    } else if (route.id === 19){
      return <GameFour navigator={navigator} />
    } else if (route.id === 20){
      return <GameFive navigator={navigator} />
    } else if (route.id === 21){
      return <GameSix navigator={navigator} />
    } else if (route.id === 22){
      return <LoadingPage navigator={navigator} />
    } else if(route.id === 23){
      return<NextTrial navigator={navigator} route={route}/>
    }
  }
}

reactMixin.onClass(CogApp, TimerMixin);

AppRegistry.registerComponent('CogApp', () => CogApp);
