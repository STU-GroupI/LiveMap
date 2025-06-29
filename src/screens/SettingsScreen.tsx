import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { List, Searchbar, Divider, Text } from 'react-native-paper';
import {useAppbar} from '../context/AppbarContext';
import {useFocusEffect} from '@react-navigation/native';
import useSnackbar from '../hooks/useSnackbar';
import CustomSnackbar from '../components/CustomSnackbar';
import {useQuery} from '@tanstack/react-query';
import {fetchMaps} from '../services/mapService';
import {useMapConfig} from '../context/MapConfigContext';
import {Map} from '../models/Map/Map';
import Loader from '../components/Loader';

const CheckIcon = () => <List.Icon icon="check" color="#0017EE" />;

const SettingsScreen = () => {
    const { expandAppbar, collapseAppbar } = useAppbar();
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
        const selectedMap = maps.find(map => map.id === mapId);
        if (selectedMap) {
            setMapId(mapId);
            setSnackbarMessage(`Switched to ${selectedMap.name}`);
            toggleSnackBar();
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
                        <React.Fragment key={map.id}>
                            <TouchableOpacity onPress={() => handleMapSelection(map.id)}>
                                <List.Item
                                    title={map.name}
                                    titleStyle={styles.itemTitle}
                                    left={map.id === config.mapId ? CheckIcon : undefined}
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
    },
});

export default SettingsScreen;
