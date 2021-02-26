import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//utilities
import { colors } from './src/utility/utilities';

//Stacks
const mainStack = createStackNavigator();

//Screens
import BarcodeScanner from './src/screens/BarcodeScanner';
import BarcodeItemList from './src/screens/BarcodeItemList';

class App extends Component {

  createMainStack = () =>
    <mainStack.Navigator initialRouteName="BarcodeScanner">
      <mainStack.Screen name={"BarcodeScanner"} component={BarcodeScanner} options={{ headerShown: false }} />
      <mainStack.Screen name={"BarcodeItemList"} component={BarcodeItemList} options={{ headerShown: false }} />
    </mainStack.Navigator>

  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor={colors.veryDarkDesaturatedBlue} barStyle={"light-content"} />
        {this.createMainStack()}
      </NavigationContainer>
    )
  }
}

export default App;
