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
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.alert}>
          <Text style={{fontSize: 20}}>{'Activity finished'}</Text>
        </View>
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
