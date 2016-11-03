// import React from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     TouchableOpacity,
// } from 'react-native';
//
// import AnimatedSprite from "../animatedSprite";
// import Tile from "./Tile";
// import monkeyCharacter from "../../sprites/monkey/monkeyCharacter";
// import birdCharacter from "../../sprites/bird/birdCharacter";
//
//
// let SCREEN_WIDTH = require('Dimensions').get('window').width;
// let SCREEN_HEIGHT = require('Dimensions').get('window').height;
//
//
// class GameThree extends React.Component {
//
//   constructor (props) {
//     super(props);
//     this.state = {
//       tweenStart: 'touch',
//       tileKey: Math.random(),
//     };
//   }
//
//   componentWillMount () {
//     styles.container.height = styles.container.height * this.props.scale.height;
//     styles.container.width = styles.container.width * this.props.scale.width;
//     styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
//     styles.backgroundImage.width = styles.backgroundImage.width * this.props.scale.width;
//   }
//
//   componentDidMount () {
//   }
//
//   buttonPress = () => {
//       this.props.navigator.replace({
//           id: 15,
//       });
//   }
//
//   onTweenFinish = () => {
//     this.setState({
//       tileKey: Math.random(),
//       tweenStart: 'auto',
//     });
//   }
//
//
//
//     render () {
//         const tweenSettings = {
//             tweenType: "hop-forward",
//                 startXY: [150, 300],
//                 middleX: [573 * this.props.scale.width],
//                 endXY:[850],
//                 yTo:[50],
//                 duration: 3000,
//                 loop: false,
//         };
//         return (
//           <View style={styles.container}>
//             <Image source={require('../../backgrounds/Game_3_Background_1280.png')} style={styles.backgroundImage}>
//               <TouchableOpacity style={styles.button} onPress={this.buttonPress}>
//                 <Text>{'Go to Level 2'}</Text>
//               </TouchableOpacity>
//               <Tile
//                 key={this.state.tileKey}
//                 top={475 * this.props.scale.height}
//                 left={575 * this.props.scale.width}
//                 width={110 * this.props.scale.width}
//                 height={25 * this.props.scale.height}
//                 tweenStart={this.state.tweenStart}
//               />
//               <AnimatedSprite
//                 coordinates={{top: 150, left: 10}}
//                 size={{width: 100, height: 120}}
//                 draggable={false}
//                 character={monkeyCharacter}
//                 tween={tweenSettings}
//                 tweenStart='auto'
//                 onTweenFinish={this.onTweenFinish}
//               />
//               <AnimatedSprite coordinates={{top:180, left: 40}}
//                 size={{width: 120,height: 80}}
//                 draggable={false}
//                 character={birdCharacter}
//               />
//             </Image>
//           </View>
//         );
//     }
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'black',
//     },
//     backgroundImage: {
//         flex: 1,
//         width: null,
//         height: null,
//     },
//     button: {
//         backgroundColor: '#4d94ff',
//         borderRadius: 10,
//         width: 90,
//         height: 30,
//         top:0,
//         left:0,
//         position: 'absolute',
//     },
// });
//
// GameThree.propTypes = {
//   route: React.PropTypes.object,
//   navigator: React.PropTypes.object,
//   scale: React.PropTypes.object,
// };
//
// export default GameThree;
//
// // <Tile top={300 * this.props.scale.height}
// //   left={350 * this.props.scale.width}
// //   width={110 * this.props.scale.width}
// //   height={25 * this.props.scale.height}
// // />
//
// // <Tile top={400 * this.props.scale.height}
// //   left={775 * this.props.scale.width}
// //   width={110 * this.props.scale.width}
// //   height={25 * this.props.scale.height}
// // />
