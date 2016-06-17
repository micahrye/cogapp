import React from 'react'; 

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
} from 'react-native';


class Bubble extends React.Component {
    handlePress(){
        this.props.handlePress();
    }

    render () {
        return (
            <TouchableWithoutFeedback onPress={() => this.handlePress()}>
                <View style={styles.bubble}>
                    <Text>{this.props.text}</Text>
                </View>
            </TouchableWithoutFeedback> 
        )
    }
}

const styles = StyleSheet.create({
    bubble: {
        borderStyle: 'solid',
        borderWidth: .25,
        width: 40,
        height: 40,
        borderRadius: 100,
        backgroundColor: '#F0F8FF',
        marginTop: 20,
    }
});

export default Bubble;