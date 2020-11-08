/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {Text, View} from 'react-native';

export interface MnemonicWordBlockProps {
  numLeft: number;
  numRight: number;
  wordLeft: string;
  wordRight: string;
}

export interface MnemonicWordProps {
  num: number;
  word: string;
}

function MnemonicWord({num, word}: MnemonicWordProps): React.ReactElement {
  return (
    <View
      style={{
        justifyContent: 'center',
          alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 4,
        width: '50%',
        flexDirection: 'row',
      }}>
      <Text style={{fontSize: 18, color: 'grey', marginRight: 5}}>{num} </Text>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>{word}</Text>
    </View>
  );
}

export function MnemonicWordBlock({
  numLeft,
  numRight,
  wordLeft,
  wordRight,
}: MnemonicWordBlockProps): React.ReactElement {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
      }}>
      <MnemonicWord num={numLeft} word={wordLeft} />
      <MnemonicWord num={numRight} word={wordRight} />
    </View>
  );
}
