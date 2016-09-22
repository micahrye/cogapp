**Building a Signed Android App**

[Review React Native documentation for signed app](https://facebook.github.io/react-native/docs/signed-apk-android.html)
[Review Android documentation for signed app](https://developer.android.com/studio/publish/app-signing.html)


***Steps***
1. Review above documentation.

2. Follow React Native documentation and all should work.

3. Test on emulator by running the following cmd:
```
$ react-native run-android --variant=release
```


**How to Do**
If you want to count the number of lines of code you can run the following
command from the cloned repo.
```
$ git ls-files | grep -e ".*js" | xargs wc -l
```
This will list all javascript files and count the number of lines of code.
