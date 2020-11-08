/*
 * Copyright (c) 2020. Mikael Lazarev
 */

/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

/* eslint-disable camelcase */
import Ionicons_ttf from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import MaterialIcons_ttf from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const IconsCSS = `
@font-face {
  src: url(${Ionicons_ttf});
  font-family: Ionicons;
}
@font-face {
  src: url(${MaterialIcons_ttf});
  font-family: MaterialIcons;
}
`;

const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) style.styleSheet.cssText = IconsCSS;
else style.appendChild(document.createTextNode(IconsCSS));

document.head.appendChild(style);

AppRegistry.registerComponent(appName, () => App);
//@ts-ignore
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
