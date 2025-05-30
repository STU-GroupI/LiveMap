import React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MapConfigProvider } from '../context/MapConfigContext';

function AppNavigator() {
    const theme = useTheme();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
        { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },

    ]);

    const renderScene = BottomNavigation.SceneMap({
        map: MapScreen,
        settings: SettingsScreen,
    });

    return (
        <MapConfigProvider>
            <BottomNavigation
                barStyle={{backgroundColor: theme.colors.background}}
                activeColor={theme.colors.primary}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                keyboardHidesNavigationBar={false}
            />
        </MapConfigProvider>
    );
}

export default AppNavigator;
