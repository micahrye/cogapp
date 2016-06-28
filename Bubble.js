import React from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Animated,
    Easing,
} from 'react-native';

let {width, height} = require('Dimensions').get('window');
let BUBBLE_SIZE = 40;
let MAX_DELAY = 8000;
let MIN_DELAY = 0;
// let MAX_SPEED = 8000;
// let MIN_SPEED = 1000;
let DURATION = 4000;

class Bubble extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            panX: new Animated.Value(0),
            panY: new Animated.Value(0),
            x: props.x,
            delay: this.getTimeConfig(),
        };
    }

    componentDidMount() {
        this.setUpScene();
    }

    setUpScene() {
        Animated.sequence([
            Animated.timing(this.state.panY, { // start bubbles at bottom
                duration: 0,
                toValue: height - 159,
            }),
            Animated.timing(this.state.panX, {
                delay: this.state.delay,
                duration: 0,
                toValue: 0,
            }),
        ]).start(() => this.startAndRepeat()); // after scene is set up, trigger animation
    }

    // continuously repeat animation
    startAndRepeat = () => {
        this.triggerAnimation(this.startAndRepeat);
    }

    // animate bubble components
    triggerAnimation(cb) {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 50,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 0,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 50,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 0,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 50,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 0,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 50,
                    easing: Easing.sin,
                }),
                Animated.timing(this.state.panX, {
                    duration: DURATION / 4,
                    toValue: 0,
                    easing: Easing.sin,
                }),
            ]),

            Animated.sequence([
                Animated.timing(this.state.panY, {
                    duration: DURATION,
                    toValue: 0,
                }),
                Animated.timing(this.state.panY, {
                    duration: DURATION,
                    toValue: height - 159,
                }),
            ]),
        ]).start(cb);
    }

    // get random delay time for each bubble
    getTimeConfig() {
        return (Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
    }

    getStyle() {
        return [
            styles.bubble,
            {
                transform: [{translateY : this.state.panY}, {translateX: this.state.panX}],
                left: this.props.x,
                width: this.props.size,
                height: this.props.size,
            }
        ];
    }

    // call pop bubble (GamePage.js) function when clicked on
    handlePress(){
        // pop time is passed up too for now just to be able to display it to screen
        let popTime = ((Date.now() - this.props.startTime) / 1000) - this.state.delay/1000;
        this.props.handlePress(popTime);
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
        borderRadius: 100,
        backgroundColor: '#F0F8FF',
        position: "absolute",
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
    }
});

export default Bubble;
