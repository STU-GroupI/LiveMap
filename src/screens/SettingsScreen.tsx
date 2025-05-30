import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { List, Searchbar, Divider, Text } from 'react-native-paper';
import { useAppbar } from '../context/AppbarContext';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import useSnackbar from '../hooks/useSnackbar';
import CustomSnackbar from '../components/CustomSnackbar';
import { useQuery } from '@tanstack/react-query';
import { fetchMaps } from '../services/mapService';
import { useMapConfig } from '../context/MapConfigContext';
import { Map } from '../models/Map/Map';
import Loader from '../components/Loader';

type RootStackParamList = {
  map: undefined;
  settings: undefined;
};

type ScreenNavigationProp = NavigationProp<RootStackParamList>;

const SettingsScreen = () => {
    const { expandAppbar, collapseAppbar } = useAppbar();
    const navigation = useNavigation<ScreenNavigationProp>();
    const { visibleSnackbar, toggleSnackBar, dismissSnackBar } = useSnackbar();
    const { config, setMapId } = useMapConfig();
    
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        
    });
    
    const maps: Map[] = Array.isArray(data) ? data : [];
    
    const filteredMaps = searchQuery && maps.length > 0
        ? maps.filter(map => 
            map.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : maps;
    
    useFocusEffect(
        React.useCallback(() => {
            expandAppbar({
                title: 'Maps',
                actions: [],
                centerTitle: false,
                overlapContent: false,
            });

            return () => {
                collapseAppbar();
            };
        }, [expandAppbar, collapseAppbar])
    );

    const handleMapSelection = (mapId: string) => {
        const selectedMap = maps.find(map => map.guid === mapId);
        if (selectedMap) {
            console.log(`Setting mapId to: ${mapId}`);
            setMapId(mapId);
            setSnackbarMessage(`Switched to ${selectedMap.name}`);
            toggleSnackBar();
            
            const navigationTimer = setTimeout(() => {
                const state = navigation.getState();
                if (state) {
                    console.log(`Navigating to map screen with mapId: ${mapId}`);
                    navigation.navigate('map');
                }
            }, 300);

            return () => clearTimeout(navigationTimer);
        }
    };

    const onChangeSearch = (query: string) => setSearchQuery(query);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        console.error('Error rendering maps:', error);
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error loading maps. Please try again later.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomSnackbar
                visible={visibleSnackbar}
                dismissSnackBar={dismissSnackBar}
                message={snackbarMessage}
            />
            
            <Searchbar
                placeholder="Search park..."
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#666"
            />
            
            <ScrollView style={styles.scrollView}>
                {filteredMaps.length > 0 ? (
                    filteredMaps.map((map, index) => (
                        <React.Fragment key={map.guid}>
                            <TouchableOpacity onPress={() => handleMapSelection(map.guid)}>
                                <List.Item
                                    title={map.name}
                                    titleStyle={styles.itemTitle}
                                    left={props => 
                                        map.guid === config.mapId ? 
                                            <List.Icon {...props} icon="check" color="#0017EE" /> : 
                                            null
                                    }
                                />
                            </TouchableOpacity>
                            {index < filteredMaps.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No maps available</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
    },
    searchBar: {
        margin: 16,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        elevation: 0,
    },
    scrollView: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
    },
    errorText: {
        padding: 16,
        color: 'red',
        textAlign: 'center',
    },
    emptyText: {
        padding: 16,
        textAlign: 'center',
        color: '#666',
    }
});

export default SettingsScreen;