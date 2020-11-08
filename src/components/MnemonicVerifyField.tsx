/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Text} from 'react-native-elements';

export interface MnemonicFieldProps {
  label: string;
  correctValue: string;
  onUpdate: (correct: boolean) => void;
}

export function MnemonicVerifyField({
  label,
  correctValue,
  onUpdate,
}: MnemonicFieldProps): React.ReactElement {
  const [value, setValue] = useState('');

  const onChange = (text: string) => {
    onUpdate(text.toLowerCase() === correctValue.toLowerCase());
    setValue(text);
  };

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 5}}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={{
          borderColor: 'black',
          borderWidth: 1,
          width: '80%',
          height: 40,
          marginBottom: 15,
        }}
      />
    </View>
  );
}
