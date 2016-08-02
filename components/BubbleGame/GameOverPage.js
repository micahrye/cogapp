import React from 'react'; 

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
} from 'react-native';

class GameOverPage extends React.Component {
  handlePress = () => {
    this.props.route.callback();
    this.props.navigator.pop();
  }
  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handlePress}>
          <View style={styles.alert}>
            <Text style={{fontSize: 20}}>Time for the next activity</Text>
          </View>
        </TouchableOpacity>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cce6ff',
  },
  alert: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
  },
});

export default GameOverPage;