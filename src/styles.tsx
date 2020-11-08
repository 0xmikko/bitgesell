/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import React from 'react';
import {Theme} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const theme: Theme = {
  Avatar: {
    rounded: true,
  },
  SearchBar: {
    containerStyle: {
      backgroundColor: '#f4f5f5',
      borderColor: 'red',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
    inputStyle: {
      color: '#7d7e82',
    },
    searchIcon: <Icon name={'search'} size={18} color={'#7d7e82'} />,
    inputContainerStyle: {
      backgroundColor: '#e4e5e7',
      height: 42,
      borderWidth: 0,
      marginLeft: 5,
      marginRight: 5,
    },
  },
  Text: {
    h1Style: {
      fontSize: 34,
      fontWeight: 'bold',
      color: 'white',
      paddingTop: 70,
      paddingLeft: 14,
    },
    h2Style: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
      // color: 'rgba(38,50,60,1)',
    },
    h3Style: {fontSize: 14, color: '#757677'},
    h4Style: {fontSize: 16, fontWeight: '500'},
  },
  colors: {
    platform: {
      //@ts-ignore
      default: {
        grey: '#FFF',
      },
    },
  },
};

export const largeTitleStyles = {
  headerLargeTitle: true,
  headerBackTitleStyle: {fontFamily: 'Helvetica Neue'},
  headerLargeTitleHideShadow: true,
  headerStyle: {backgroundColor: '#F6F7F8'},
};

export const commonStyles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: '#f4f5f5',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  safeAreaContainerCentered: {
    flex: 1,
    backgroundColor: '#f4f5f5',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
