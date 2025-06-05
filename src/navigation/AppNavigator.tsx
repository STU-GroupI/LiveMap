import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, Icon } from 'react-native-paper';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MapConfigProvider } from '../context/MapConfigContext';
import { useAppbar } from '../context/AppbarContext';

const Tab = createBottomTabNavigator();

function AppNavigator() {
    const theme = useTheme();
    const { collapseAppbar } = useAppbar();

    return (
        <MapConfigProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: string;

                        if (route.name === 'Map') {
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'cog' : 'cog-outline';
                        } else {
                            iconName = 'help';
                        }

                        return <Icon source={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                        borderTopColor: theme.colors.outline || '#e0e0e0',
                        borderTopWidth: 1,
                    },
                })}
                screenListeners={{
                    tabPress: () => {
                        collapseAppbar();
                    },
                }}
            >
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </MapConfigProvider>
    );
}

export default AppNavigator;
