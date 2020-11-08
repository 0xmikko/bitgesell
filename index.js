/*
 * Copyright (c) 2020. Mikael Lazarev
 */

/**
 * @format
 */
import 'reflect-metadata';
import './shim';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
