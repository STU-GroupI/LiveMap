import React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import MapScreen from '../screens/MapScreen';
import { MapConfigProvider } from '../config/MapConfigContext';

function AppNavigator() {
    const theme = useTheme();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        map: MapScreen,
    });

    return (
        <MapConfigProvider>
            <BottomNavigation
                barStyle={{backgroundColor: theme.colors.background}}
                activeColor={theme.colors.primary}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </MapConfigProvider>
    );
}

export default AppNavigator;
