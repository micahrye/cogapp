import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Navigator,
} from 'react-native';

import frogCharacter from "../../sprites/frog/frogCharacter";
import frogCharacterFlipped from '../../sprites/frog/frogCharacterFlipped';
import bugCharacter from '../../sprites/bug/bugCharacter';
import lightbulbCharacter from '../../sprites/lightbulb/lightbulbCharacter';
import AnimatedSprite from "../animatedSprite";
import Background from '../../backgrounds/Game_1_Background_1280.png';


let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let blackout = [];
let spotLight = [];
let bug = [];

class BugZap2 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            blackout: false,
        }

        this.setBlackout();
    }
    componentDidMount() { }

    setBlackout() {
        timeout = setTimeout ( () => {
            blackout.push(<View key={0} style={styles.blackout}></View>);
            this.setState({blackout: true});
            this.flashSpotLight();
        }, 3500);
    }

    flashSpotLight() {
        timeout2 = setTimeout ( () => {
            spotLight.push(<View key={0} style={styles.spotLight}></View>);
            this.setState({blackout: true});
            timeout3 = setTimeout ( () => {
                delete spotLight[0];
                this.setState({blackout: true});
                this.removeBlackout();
            }, 500);
        }, 1000);
    }

    removeBlackout() {
        timeout4 = setTimeout ( () => {
            delete blackout[0];
            bug.push(
                <AnimatedSprite key={0} coordinates={{top: SCREEN_HEIGHT - 300, left: SCREEN_WIDTH - 200}}
                size={{width: 128, height: 128}}
                draggable={false}
                character={bugCharacter}/>
            );
            this.setState({blackout: false});
        }, 200);
    }

    buttonPress = () => {
        this.props.navigator.push({
            id: 9,
        });
    }

    render(){
        const tweenSettings = {
                tweenType: "bounce-drop",
                startXY: [SCREEN_WIDTH-400, -128],
                endXY: [SCREEN_WIDTH-400, 0],
                duration: 3000,
                loop: false,
        };
        return (
                <View style={styles.container}>
                    <Image source={require('../../backgrounds/Game_1_Background_1280.png')} style={styles.backgroundImage}>
                            <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
                                <Text>Go to Level 3</Text>
                            </TouchableOpacity>
                            <AnimatedSprite coordinates={{top: -128, left: SCREEN_WIDTH - 400}}
                                size={{width: 128, height: 128}}
                                draggable={false}
                                character={lightbulbCharacter}
                                tween={tweenSettings}
                                tweenStart="auto"/>
                            <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 200}}
                                size={{width: 256, height: 256}}
                                draggable={false}
                                character={frogCharacter} />
                            <AnimatedSprite coordinates={{top: SCREEN_HEIGHT - 275, left: SCREEN_WIDTH - 730}}
                                size={{width: 256, height: 256}}
                                draggable={false}
                                character={frogCharacterFlipped} />
                            <View>
                                {blackout}
                            </View>
                            <View>
                                {spotLight}
                            </View>
                            <View>
                                {bug}
                            </View>
                    </Image>
                </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    button: {
        backgroundColor: '#4d94ff',
        borderRadius: 10,
        width: 90,
        height: 30,
        position: 'absolute',
    },
    blackout: {
        flex: 1,
        backgroundColor: 'black',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: 'absolute',
    },
    spotLight: {
        flex: 1,
        backgroundColor: 'white',
        height: 150,
        width: 150,
        left: 400,
        top: 100,
        position: 'absolute',
        borderRadius: 100,
    },
});

export default BugZap2;