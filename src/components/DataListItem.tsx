/*
 * Copyright (c) 2020, Mikael Lazarev
 */

import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';

interface DataListItemProps {
  name: string;
  value: string;
  onSelect?: () => void;
}

export function DataListItem({
  name, value,
  onSelect,
}: DataListItemProps): React.ReactElement {

  return (
    <TouchableOpacity onPress={onSelect} style={{marginTop: -1}}>
      <View style={styles.container}>

        <View >
          <View>
            <Text>"{name}"</Text>
            <Text h4>{value}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    flex: 1,
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
    marginTop: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
  },
  textContainer: {
    paddingLeft: 15,
    paddingRight: 20,
    flex: 1,
    alignContent: 'flex-start',
    color: 'red',
  },
  tagContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
});
