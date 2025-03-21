/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MD3LightTheme, PaperProvider} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#0017EE',
        secondary: '#ffffff',
        active: '#0017EE',
        background: '#ffffff',
        surface: '#ffffff',
    },
};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <BottomSheetModalProvider>
                    <AppNavigator />
                </BottomSheetModalProvider>
            </NavigationContainer>
        </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
