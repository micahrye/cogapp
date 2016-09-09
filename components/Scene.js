import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const baseHeight = 800;
const baseWidth = 1280;
const scaleHeight = Dimensions.get('window').height / baseHeight;
const scaleWidth = Dimensions.get('window').width / baseWidth;

class Scene extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      scale: {
        height: scaleHeight,
        width: scaleWidth,
      },
    };
  }

  render () {
    // console.warn(`height ${this.state.scale.height}`);
    // console.warn(`width ${this.state.scale.width}`);
    return (
      <View style={styles.container}>
        {React.cloneElement(this.props.children, { scale: this.state.scale })}
      </View>
    );
  }

}

// Scene.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 800 * scaleHeight,
    width: 1280 * scaleWidth,
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Scene;
