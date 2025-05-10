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
import {AppbarProvider} from './src/context/AppbarContext.tsx';
import AppbarContainer from './src/components/AppbarContainer.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

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

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView testID={'app-container'}>
        <PaperProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <NavigationContainer>
                    <BottomSheetModalProvider>
                        <AppbarProvider>
                            <AppbarContainer>
                                <AppNavigator />
                            </AppbarContainer>
                        </AppbarProvider>
                    </BottomSheetModalProvider>
                </NavigationContainer>
            </QueryClientProvider>
        </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
