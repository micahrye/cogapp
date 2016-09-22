import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

// imports
import AnimatedSprite from "../animatedSprite";
import Tweener from "../Tweener";


// import different characters to feed to animated sprite
import mammalCharacter from "../../sprites/mammal/mammalCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugfoodCharacter from "../../sprites/bugfood/bugfoodCharacter";
import signCharacter from "../../sprites/sign/signCharacter";
import leverCharacter from "../../sprites/lever/leverCharacter";
import frogCharacter from "../../sprites/frog/frogCharacter";
import goatCharacter from "../../sprites/goat/goatCharacter";

const Window = Dimensions.get('window');
// destination for falling food items (should be close to where creature sits)
const endCoordinates = [Window.width*0.65,Window.height*0.5];
const endCoordinates2 = [Window.width*0.6,Window.height*0.4]; // slightly different end coordinates for when the frog is onscreen
// these constants specify the initial locations and spacing of the food items
const startLeft = Window.width*0.4;
const startTop = -250;
const endTopSign = -15;
const endTopCan = Window.height*0.2;
// these coordinates give two points - one onscreen, one off - that the creatures travel between
const creatureStart = [Window.width+500,Window.height*0.5];
const creatureEnd = [Window.width*0.65,Window.height*0.5];

class GameTwo extends React.Component {

  constructor(props) {
    super(props);
    // customizable function for dropping food/signs into the frame
    tweenDown = function(startTop,endTop) {
      return (
        {
          tweenType: "bounce-drop",
          startY: startTop,
          endY: endTop,
          duration: 800,
          repeatable: false,
          loop: false,
        }
      );
    }
    // customizable function for moving food/signs offscreen at end of a trial or timeout
    tweenTimeout = function(startTop,endTop) {
      return (
        {
          tweenType: "basic-back",
          startY: startTop,
          endY: endTop,
          duration: 750,
          repeatable: false,
          loop: false,
        }
      );
    }
   // placeholder tween to food into moving components on mounting
   tweenInitial = {
                  tweenType: "hop",
                  startY: startTop,
                  loop: false,
                  };
    // used when food items are pressed
    tweenFall = function(dest){
      return (
        {
         tweenType: "curve-spin",
         startXY: [startLeft+32,endTopCan],
         endXY: dest,
         duration: 750,
         repeatable: false,
         loop: false,
        }
      )
    };
    // used to move creatures on/off screen in a straight line
    tweenMove = function(start,end) {
      return(
        {
          tweenType: "move",
          startXY: start,
          endXY: end,
          duration: 1500, // (may need to be longer to match length of walk animation)
          repeatable: false,
          loop: false,
        }
      );
    }
    // keeps creature onscreen during trials when character animations are playing
    tweenStatic = function(pos) {
      return(
        {
         tweenType: "move",
         startXY: pos,
         endXY: pos,
         duration: 0,
         repeatable: false,
         loop: false,
        }
      );
    }
    // state initial declarations
    this.state = {
      foodKey: Math.random(), // keys for food/sign items
      signKey: Math.random(),
      foodTween: tweenInitial, // holds tweens for food/signs
      signTween: tweenInitial,
      onboarding: 1, // keeps track of how the onboarding level is progressing - 1: mammal, 2: goat, 3: frog
      foodCharacter: grassCharacter,  // holds current food character - either grass, can, or bug
      creatureTween1: tweenMove(creatureStart,creatureEnd),  // tweens for the three different creatures
      creatureTween2: tweenMove(creatureStart,creatureStart),
      creatureTween3: tweenMove(creatureStart,creatureStart),
      creatureKey1: Math.random(), // keys for the three different creatures
      creatureKey2: Math.random(),
      creatureKey3: Math.random(),
      leverPressed: false, // booleans that prevent the trial being reset halfway through by an inappropriate lever press
      foodPressed: false,
      animation: "default", // dictates what animation the creature character should be displaying
    }
    readyToEat = false;
  }


  componentDidMount() {
    // mammal character is the first to walk out - does so automatically on mounting
    this.setState({creatureKey1: Math.random(),
                   animation: "walk"});
  }

  // called when player touches the lever component
  onLeverTouch = () => {
    if(!this.state.leverPressed) {
      switch(this.state.onboarding) {
        case 1:
          // grass/mammal character first
          this.setState({foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
        case 2:
          // can/goat character second
          this.setState({foodCharacter: canCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
        case 3:
          // bug/frog character last
          this.setState({foodCharacter: bugfoodCharacter,
                         foodTween: tweenDown(startTop,endTopCan),
                         signTween: tweenDown(startTop,endTopSign),
                         foodKey: Math.random(),
                         signKey: Math.random(),
                         leverPressed: true,
                         foodPressed: false});
          break;
      }
    }
  }

  //called in onAnimationFinish to move to the next stage of the onboarding level
  toggleCreatureCharacter() {
    this.setState({leverPressed: false});
    switch(this.state.onboarding) {
      case 2:
        this.setState({
          creatureKey1: Math.random(),
          creatureKey2: Math.random(),
          creatureTween1: tweenMove(creatureEnd,creatureStart),
          creatureTween2: tweenMove(creatureStart,creatureEnd),
         })
        break;
      case 3:
        this.setState({
          creatureKey2: Math.random(),
          creatureKey3: Math.random(),
          creatureTween2: tweenMove(creatureEnd,creatureStart),
          creatureTween3: tweenMove([Window.width+500,Window.height*0.4],
                                    [Window.width*0.65,Window.height*0.4]),
        })
        break;
    }
  }

  // wrapper function that moves the game on to part 1 after onboarding level 3 is completed
  toggleLevel = () => {
    this.props.navigator.replace({id: 'GameTwo1',});
  }

  nextLevel = () => {
    // move the frog offscreen before going on to game 2, part 1
    this.setState({
      creatureKey3: Math.random(),
      creatureTween3: tweenMove([Window.width*0.65,Window.height*0.4],[Window.width+500,Window.height*0.4]),
    });
    setTimeout(this.toggleLevel,1500);
  }

  // called when a food item is pressed by the player - triggers the falling
  // tween animation for the food item, calls the "openMouth" animation
  // for the current creature (unless the current creature is the frog), and
  // sends the sign character back off screen
  onFoodPress = () => {
    readyToEat = true;
    if (!this.state.foodPressed) {
      this.setState({foodTween: tweenFall(endCoordinates),
                     foodKey: Math.random(),
                     signTween: tweenTimeout(endTopSign,startTop),
                     signKey: Math.random(),
                     foodPressed: true});
    }
    switch(this.state.onboarding) {
      case 1:
        this.setState({creatureKey1: Math.random(),animation: "openMouth",
                       foodTween: tweenFall(endCoordinates)})
        break;
      case 2:
        this.setState({creatureKey2: Math.random(),animation: "openMouth",
                       foodTween: tweenFall(endCoordinates)})
        break;
      case 3:
        this.setState({creatureKey3: Math.random(), foodTween: tweenFall(endCoordinates2)})
        break;
    }
  }

  // onTweenEndFood only does anything when the food has finished its descent toward the creature's
  // mouth (thanks to the readyToEat boolean).  Starts the chew/eat animation in the
  // current creature character
  onTweenEndFood = () => {
    switch(this.state.onboarding) {
      case 1:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey1: Math.random()})
        }
        break;
      case 2:
        if (readyToEat) {
          this.setState({animation: "chew", creatureKey2: Math.random()})
        }
        break;
      case 3:
        if (readyToEat) {
          this.setState({animation: "eat", creatureKey3: Math.random()})
        }
        break;
    }
    readyToEat = false;
  }

  // called after the creature character finishes any tween.  Ensures that
  // the creature stays put during trials
  onTweenEndCreature = () => {
    //readyToEat = true;
    switch(this.state.onboarding) {
      case 1:
        this.setState({creatureTween1: tweenStatic(creatureEnd)})
        break;
      case 2:
        this.setState({creatureTween2: tweenStatic(creatureEnd)})
        break;
      case 3:
        this.setState({creatureTween3: tweenStatic([Window.width*0.65,Window.height*0.4])})
        break;
    }
  }

  // dictates what needs to happen after each different creature animation
  onAnimationFinish(animationKey, creatureKey) {
    switch(animationKey) {
      case "walk":
        this.setState({animation: "default"})
        break;
      case "celebrate":
        // if the creature is celebrating it means that the subtrial has been
        // completed successfully and the game can move on to the next creature
        this.setState({onboarding: this.state.onboarding+1})
        this.setState({animation: "walk"})
        //this.flip(100);
        if (this.state.onboarding === 4) {
          setTimeout(this.nextLevel,1000) // go on to game 2, part 1 if frog trials has just been completed
        } else {
          setTimeout(this.toggleCreatureCharacter.bind(this),500);
        }
        break;
      case "chew":
        // after creaure finishes eating food, it celebrates
        this.setState({animation: "celebrate"})
        switch(this.state.onboarding) {
          case 1:
            this.setState({creatureKey1: Math.random()})
            break;
          case 2:
            this.setState({creatureKey2: Math.random()})
            break;
          case 3:
            this.setState({creatureKey3: Math.random()})
            break;
        }
        break;
      case "openMouth":
        // once creature opens its mouth, it should hold it open until the food
        // has fallen in
        this.setState({animation: "readyToEat"})
        switch(this.state.onboarding) {
          case 1:
            this.setState({creatureKey1: Math.random()})
            break;
          case 2:
            this.setState({creatureKey2: Math.random()})
            break;
          case 3:
            this.setState({creatureKey3: Math.random()})
            break;
        }
        break;
        case "eat":
          // used only for frog- after it eats, it should celebrate
          this.setState({animation: "celebrate",creatureKey3: Math.random()})
          break;
    }

  }

  homeBtn = () => {
    this.props.navigator.replace({
      id: 'Main',
    });
  }

  render () {
    // simple bounce tween to let player know when they have pressed the lever
    const tweenOptsLever = {
      tweenType: "bounce",
      startY: 80,
      repeatable: true,
      loop: false,
    };

    return (
      <View style={styles.container}>
        <Image source={require('../../backgrounds/Game_2_Background_1280.png')}
          style={styles.backgroundImage}>
        <AnimatedSprite
          character={mammalCharacter}
          coordinates={{top: Window.height -190, left: Window.width - 120}}
          size={{width: Window.width/4, height: Window.width/4}}
          draggable={false}
          tweenStart={"auto"}
          tween={this.state.creatureTween1}
          key={this.state.creatureKey1}
          spriteAnimationKey={this.state.animation}
          rotate={[{rotateY: "0deg"}]}
          loopAnimation={false}
          onTweenFinish={this.onTweenEndCreature}
          onAnimationFinish={(spriteAnimationKey, key) => {
            this.onAnimationFinish(spriteAnimationKey, key);
          }}
        />
        <AnimatedSprite
          character={goatCharacter}
          coordinates={{top: Window.height -190, left: Window.width - 120}}
          size={{width: Window.width/4, height: Window.width/4}}
          draggable={false}
          tweenStart={"auto"}
          tween={this.state.creatureTween2}
          key={this.state.creatureKey2}
          rotate={[{rotateY:"180deg"}]}
          spriteAnimationKey={this.state.animation}
          loopAnimation={false}
          onTweenFinish={this.onTweenEndCreature}
          onAnimationFinish={(spriteAnimationKey, key) => {
            this.onAnimationFinish(spriteAnimationKey, key);
          }}
        />
        <AnimatedSprite
          character={frogCharacter}
          coordinates={{top: Window.height -50, left: Window.width - 120}}
          size={{width: Window.height/2, height: Window.height/2}}
          draggable={false}
          tweenStart={"auto"}
          tween={this.state.creatureTween3}
          key={this.state.creatureKey3}
          spriteAnimationKey={this.state.animation}
          rotate={[{rotateY:"0deg"}]}
          loopAnimation={false}
          onTweenFinish={this.onTweenEndCreature}
          onAnimationFinish={(spriteAnimationKey, key) => {
            this.onAnimationFinish(spriteAnimationKey, key);
          }}
        />
        <AnimatedSprite
          character={leverCharacter}
          coordinates={{top:100,left:-5}}
          size={{width:Window.width/6,height:(Window.width/6)*0.878}}
          draggable={false}
          tweenStart='auto'
          tween={tweenOptsLever}
          onPress={this.onLeverTouch}
        />
        <AnimatedSprite
          character={signCharacter}
          coordinates={{top: startTop, left: startLeft}}
          key={this.state.signKey}
          size={{width: Window.width/7, height: (Window.width/7)*1.596}}
          draggable={false}
          tweenStart='auto'
          tween={this.state.signTween}
        />
        <AnimatedSprite
          character={this.state.foodCharacter}
          coordinates={{top: startTop, left: startLeft+32}}
          key={this.state.foodKey}
          size={{width: Window.width/11, height: Window.width/11}}
          draggable={false}
          tweenStart='auto'
          tween={this.state.foodTween}
          onPress={this.onFoodPress}
          onTweenFinish={this.onTweenEndFood}
        />
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={this.homeBtn}>
              <Text>{'Home'}</Text>
          </TouchableOpacity>
        </View>
        </Image>
      </View>
    );
  }
}

GameTwo.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

const styles = StyleSheet.create({
  // styles for background png image/basic black backgroundColor
  // to go behind it
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
    borderStyle: 'solid',
    borderColor: '#ff00ff',
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 100,
    height: 50,
    justifyContent: 'center',
  },
})

export default GameTwo
