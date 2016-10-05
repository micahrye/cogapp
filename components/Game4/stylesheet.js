
import { StyleSheet } from 'react-native';

function getStyle (height, width, scale) {
  return (
    StyleSheet.create({
      container: {
        flex: 1,
        height: height,
        width: width,
        flexDirection: 'row',
      },
      backgroundImage: {
        height: height,
        width: width,
      },
      boxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: 280,
        height: 520,
        borderWidth: 3,
        borderColor: 'black',
        left: 450,
        marginTop: 60,
      },
      emptyBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        width: 60,
        height: 60,
        top: 195,
        left: 195,
        position: 'absolute',
      },
      separatingLine: {
        height: 0,
        width: 230,
        top: 400,
        left: 20,
        borderWidth: 1,
        position: 'absolute',
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
  );
}

export default getStyle;
