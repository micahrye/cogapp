

import React, { Component } from 'react';
import {
  AppRegistry,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

import {Motion, spring} from 'react-motion';
import greenDragonMeta from "./frames/greenDragonMeta";

class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      movies: null,
      animate: false,
      bounceValue: new Animated.Value(0),
    };

    this._animation = greenDragonMeta;
    this._animationKey = 'idel';
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    this.animationInterval = undefined;
  }

  componentDidMount() {
    this.animationInterval = setInterval(()=>{
      this.frameIndex++;
      if(this.frameIndex > this.numFrames){
        this.frameIndex = 0;
      }else{
        this.setState({animate: true});
      }
      //console.log("move please");
    }, 100);
    //debugger;
  }

  componentWillUnmount(){
    console.log("clearing interval");
    clearInterval(this.animationInterval);
  }

  innerTouch(evt){

    console.log(`INNER ${evt.nativeEvent.locationX}`);
    if(this._animationKey === 'idel'){
      this._animationKey = 'touch';
    }else{
      this._animationKey = 'idel'
    }
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    //clearInterval(this.animationInterval);


    this.state.bounceValue.setValue(1.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
    this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.8,                         // Animate to smaller size
        friction: 1,                          // Bouncier spring
      }
    ).start();

    console.log("that tickles");
  }

  outerTouch(evt){
    let tmp = {eggs: "green", ham: "pigs"};
    console.log(`OUTER ${evt.nativeEvent.locationX}`);
    console.log(`OUTER touch`);

  }

  render() {
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);
    const dragonStyle = {width: 200, height: 195,
        borderWidth: 2, borderColor: '#00ff00'};
    //this.frameIndex = this.frameIndex === this.numFrames-1 ? 0 : this.frameIndex++;
    //this.frameIndex = this.frameIndex ? 0 : 1;
    const bv = this.state.bounceValue;
    return(
        <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
          style={styles.container}
          activeOpacity={1.0}>
          <View style={styles.container} >

            <TouchableOpacity
              activeOpacity={1.0}
              style={dragonStyle}
              onPress={(evt) => this.innerTouch(evt)}>
              <Animated.Image
                ref="dragon"
                source={this._animation[this._animationKey][this.frameIndex]}
                style={{
                  flex: 1,
                  transform: [
                    {scale: bv},
                  ],
                  ...dragonStyle
                }}/>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderStyle: 'dashed',
  },
});


export default AnimatedSprite;
