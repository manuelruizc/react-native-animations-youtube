import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CocaColaApp from './cocacola-app/CocaColaApp';

export default function App() {
  return (
    <CocaColaApp />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
