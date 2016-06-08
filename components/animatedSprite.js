

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

class AnimatedSprite extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      movies: null,
      animate: false,
    };

    this.animateURI = [
      require("./frames/green_dragon01.png"),
      require("./frames/green_dragon02.png"),
      require("./frames/green_dragon03.png"),
      require("./frames/green_dragon04.png"),
      require("./frames/green_dragon04.png"),
      require("./frames/green_dragon03.png"),
      require("./frames/green_dragon02.png"),
      require("./frames/green_dragon01.png"),
      require("./frames/gd_wings01.png"),
      require("./frames/gd_wings02.png"),
      require("./frames/gd_wings03.png"),
      require("./frames/gd_wings04.png"),
      require("./frames/gd_wings05.png"),
      require("./frames/gd_wings06.png")
    ];
    // not properly structured yet.
    this.animationInfo = require("./greenDragonAnimation.json");
    /*
    give above animationInfo populate animateURI.
    */
    this._animation = {
      name: "greanDragon",
      normal: [
        require("./frames/green_dragon01.png"),
        require("./frames/green_dragon02.png"),
        require("./frames/green_dragon03.png"),
        require("./frames/green_dragon04.png"),
        require("./frames/green_dragon04.png"),
        require("./frames/green_dragon03.png"),
        require("./frames/green_dragon02.png"),
        require("./frames/green_dragon01.png"),
      ],
      touch: [
        require("./frames/gd_wings01.png"),
        require("./frames/gd_wings02.png"),
        require("./frames/gd_wings03.png"),
        require("./frames/gd_wings04.png"),
        require("./frames/gd_wings05.png"),
        require("./frames/gd_wings06.png"),
      ],
    };
    this._animationKey = 'normal';
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

  innerTouch(evt){
    console.log(`INNER ${evt.nativeEvent.locationX}`);
    if(this._animationKey === 'normal'){
      this._animationKey = 'touch';
    }else{
      this._animationKey = 'normal'
    }
    this.numFrames = this._animation[this._animationKey].length-1;
    this.frameIndex = 0;
    //clearInterval(this.animationInterval);
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
    return(
      <TouchableOpacity onPress={(evt) => this.outerTouch(evt) }
        style={styles.container}
        activeOpacity={1.0}>
        <View style={styles.container}
          >
          <TouchableOpacity
            activeOpacity={1.0}
            style={dragonStyle}
            onPress={(evt) => this.innerTouch(evt)}>
            <Image ref="dragon" source={this._animation[this._animationKey][this.frameIndex]}
              style={dragonStyle}/>
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
