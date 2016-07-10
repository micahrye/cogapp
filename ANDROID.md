When debugging or runing on device that is 
plugged into usb you need to run the following 
from the command line. 

$ react-native start
$ adb reverse tcp:8081 tcp:8081
$ react-native run-android 


