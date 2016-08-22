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

  componentWillMount () {

  }
  componentDidMount () {

  }

  goToBubblePop = () => {
    this.props.navigator.replace({id: 'BubblePopLoading'});
  }

  // goToDragon = () => {
  //   this.props.navigator.replace({id: 'DragDragon'});
  // }

  goToBugZap = () => {
      this.props.navigator.replace({id: 'BugZapLoading'});
  }

  goToGameTwo = () => {
    this.props.navigator.replace({id: 'GameTwoLoading'});
  }

  goToGameThree = () => {
    this.props.navigator.replace({id: 'GameThree'})
  }

  goToGameFour = () => {
    this.props.navigator.replace({id: 'GameFourLoading'})
  }

  goToGameFive = () => {
    this.props.navigator.replace({id: 'GameFive'})
  }

  goToGameSix = () => {
    this.props.navigator.replace({id:'GameSixLoading'})
  }

  render () {
    // console.warn(SCREEN_HEIGHT);
    // console.warn(SCREEN_WIDTH);
    return (
      <ScrollView
        style={styles.scrollView} >

      <View style={styles.container}>

        <View style={styles.column}>
          <TouchableOpacity onPress={this.goToBubblePop}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To BubblePop</Text>
            </View>
          </TouchableOpacity>
          { // <TouchableOpacity onPress={this.goToDragon}>
          //   <View style={styles.button}>
          //     <Text style={styles.text}>Go To Dragon</Text>
          //   </View>
          // </TouchableOpacity>
          }
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

        <View style={styles.column}>
          <TouchableOpacity onPress={this.goToGameThree}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Game Three</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToGameFour}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Game Four</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToGameFive}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Game Five</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToGameSix}>
            <View style={styles.button}>
              <Text style={styles.text}>Go To Game Six</Text>
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
    height: 100
  }
});

export default Main;

/*
<ScrollView
  style={{height:SCREEN_HEIGHT, width:SCREEN_WIDTH}}
  horizontal={false}>

<View style={styles.container}>

  <View style={styles.column}>
    <TouchableOpacity onPress={this.goToBubblePop}>
      <View style={styles.button}>
        <Text style={styles.text}>Go To BubblePop</Text>
      </View>
    </TouchableOpacity>
    {
    // <TouchableOpacity onPress={this.goToDragon}>
    //   <View style={styles.button}>
    //     <Text style={styles.text}>Go To Dragon</Text>
    //   </View>
    // </TouchableOpacity>
    }
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

  <View style={styles.column}>
    <TouchableOpacity onPress={this.goToGameThree}>
      <View style={styles.button}>
        <Text style={styles.text}>Go To Game Three</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={this.goToGameFour}>
      <View style={styles.button}>
        <Text style={styles.text}>Go To Game Four</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={this.goToGameFive}>
      <View style={styles.button}>
        <Text style={styles.text}>Go To Game Five</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={this.goToGameSix}>
      <View style={styles.button}>
        <Text style={styles.text}>Go To Game Six</Text>
      </View>
    </TouchableOpacity>
  </View>

</View>
</ScrollView>

*/
