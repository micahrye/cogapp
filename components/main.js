/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Main extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount () {}

  componentDidMount () {}

  goToGame = (gameId) => {
    //console.warn('goToGame : ', gameId);
    this.props.navigator.replace({id: gameId});
  }

  render () {
    //console.warn('HEY HEY HEY');
    // console.warn(SCREEN_HEIGHT);
    // console.warn(SCREEN_WIDTH);
    return (
      <ScrollView
        style={styles.scrollView} >

      <View style={styles.container}>

        <View style={styles.column}>

          <TouchableOpacity onPress={() => { this.goToGame('AnimatedTest'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'Example Animate Test'}</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => { this.goToGame('BubblePop'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To BubblePop'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { this.goToGame('BubblePopGame'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'NEW BubblePop'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { this.goToGame('BugZap'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To BugZap'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { this.goToGame('BugZapLevel01'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'NEW BugZap'}</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={styles.column}>
        {/*
          <TouchableOpacity >
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To Game Three'}</Text>
            </View>
          </TouchableOpacity>
        */}
        <TouchableOpacity onPress={() => { this.goToGame('GameTwo'); }}>
          <View style={styles.button}>
            <Text style={styles.text}>{'Go To Game Two'}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => { this.goToGame('MatchByColorGameLevel01'); }}>
          <View style={styles.button}>
            <Text style={styles.text}>{'NEW Game Two'}</Text>
          </View>
        </TouchableOpacity>

          <TouchableOpacity >
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To Game Four'}</Text>
            </View>
          </TouchableOpacity>
        {/*
          <TouchableOpacity >
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To Game Five'}</Text>
            </View>
          </TouchableOpacity>
        */}
          <TouchableOpacity onPress={() => { this.goToGame('GameSix'); }}>
            <View style={styles.button}>
              <Text style={styles.text}>{'Go To Game Six'}</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
      </ScrollView>
    );
  }
}

Main.propTypes = {
  navigator: React.PropTypes.object.isRequired,
};

reactMixin.onClass(Main, TimerMixin);

const styles = StyleSheet.create({
  scrollView: {
    height:SCREEN_HEIGHT,
    width:SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:SCREEN_HEIGHT,
    width:SCREEN_WIDTH,
    //backgroundColor: '#fff',
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
    height: 75,
    width: 200,
    justifyContent: 'center',
  },
  box: {
    borderColor: 'red',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: 100,
    height: 100,
  },
});

export default Main;
