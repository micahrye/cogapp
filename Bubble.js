import React from 'react'; 

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';

let { width, height} = require('Dimensions').get('window');
let BUBBLE_SIZE = 40;
let MAX_DELAY = 2000;
let MIN_DELAY = 500;
let MAX_SPEED = 8000;
let MIN_SPEED = 5000;

class Bubble extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            pan: new Animated.ValueXY(),
        };
    }

    componentDidMount() {
        this.startAndRepeat();
    }
   
    // continuously repeat animation
    startAndRepeat = () => {
        this.triggerAnimation(this.startAndRepeat);
    }

    // animated bubble components
    triggerAnimation = (cb) => {
        Animated.sequence([
            Animated.timing(this.state.pan, { // start bubbles at bottom
                duration: 0,
                toValue: {x: 0, y: height - 150}
            }),
            Animated.timing(this.state.pan, {
                ...this.getTimeConfig(),
                toValue: {x: 0, y: 0}
            }),
            Animated.timing(this.state.pan, { // bubbles move more slowly on way back down
                duration: 10000,
                toValue: {x: 0, y: height - 100}
            })
        ]).start(cb);
    }

    // get random durations for animation
    getTimeConfig = () => {
        return {
            duration: Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED, 
           // delay: Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY,
        }
    }

    // update positions of bubbles
    getStyle() {
        return [
            styles.bubble,
            {
                transform: this.state.pan.getTranslateTransform()
            }
        ];
    }

    // call pop bubble function when clicked on
    handlePress(){
        this.props.handlePress();
    }

    render () {
        return (
            <TouchableWithoutFeedback onPress={() => this.handlePress()}>
                <Animated.View style={this.getStyle()} />
            </TouchableWithoutFeedback> 
        )
    }
}

const styles = StyleSheet.create({
    bubble: {
        borderStyle: 'solid',
        borderWidth: .25,
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        borderRadius: 100,
        backgroundColor: '#F0F8FF',
        marginRight: 5,
    }
});

export default Bubble;