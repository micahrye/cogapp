'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Alert,
  PanResponder,
  StyleSheet,
  View,
  processColor,
} = ReactNative;

import AnimatedSprite from "../animatedSprite";
import greenDragonCharacter from "../../sprites/dragon/greenDragonCharacter";


var CIRCLE_SIZE = 200;
var SCREEN_WIDTH = require('Dimensions').get('window').width;

var DragDragon = React.createClass({

  statics: {
    title: 'PanResponder Sample',
    description: 'Shows the use of PanResponder to provide basic gesture handling.',
  },

  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  circle: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount: function() {
    //Alert.alert("Titel", `screen ${SCREEN_WIDTH}`);

    // make isDraggable a prop and whala
    const isDraggable = true;
    if(isDraggable){
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        onPanResponderGrant: this._handlePanResponderGrant,
        onPanResponderMove: this._handlePanResponderMove,
        onPanResponderRelease: this._handlePanResponderEnd,
        onPanResponderTerminate: this._handlePanResponderEnd,
      });
      this._previousLeft = 20;
      this._previousTop = 120;
      this._circleStyles = {
        style: {
          left: this._previousLeft,
          top: this._previousTop,
          backgroundColor: 'green',
        }
      };
    }
  },

  componentDidMount: function() {
    this._updateNativeStyles();
  },

  changeTouchType: function(currentAnimationType){
    //console.warn(`currentAnimationType ${currentAnimationType}`);
    debugger;
    if(currentAnimationType === "default"){
      return "flip";
    }
    return "default";
  },

  render: function() {
    return (
      <View
        style={styles.container}>

        <View
          ref={(circle) => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        >
        </View>

        <AnimatedSprite coordinates={{top:100, left:50}}
          size={{width: 100, height: 95}}
          draggable={false}
          character={frogCharacterTalented}
          changeTouchType={this.changeTouchType}
        />
      {/*
        <AnimatedSprite coordinates={{top:100, left:50}}
          size={{width: 200, height: 195}}
          draggable={true}
          character={greenDragonCharacter} />

        <AnimatedSprite coordinates={{top:400, left:160}}
            size={{width: 100, height: 95}}
            draggable={true}
            character={greenDragonCharacter} />
      */}
      </View>
    );
  },

  _highlight: function() {
    //this._circleStyles.style.backgroundColor = 'blue';
    //this._updateNativeStyles();
  },

  _unHighlight: function() {
    //this._circleStyles.style.backgroundColor = 'green';
    //this._updateNativeStyles();
  },

  _updateNativeStyles: function() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    this._highlight();
  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    this._circleStyles.style.left = this._previousLeft + gestureState.dx;
    this._circleStyles.style.top = this._previousTop + gestureState.dy;
    this._updateNativeStyles();
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  },

});

var styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
});

export default DragDragon;
