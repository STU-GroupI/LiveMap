import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View, LayoutChangeEvent} from 'react-native';
import {Appbar} from 'react-native-paper';

import {useAppbar} from '../context/AppbarContext';

const AppbarContainer = ({children}: {children: React.ReactNode}) => {
    const {appbarTitle, appbarActions, showAppbar, centerTitle, overlapContent} = useAppbar();
    const [appbarHeight, setAppbarHeight] = useState(0);

    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: showAppbar ? 0 : -appbarHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showAppbar, translateY, appbarHeight]);

    const handleLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        setAppbarHeight(height);
    };

    return (
        <View style={[styles.wrapper]}>
            <Animated.View
                style={[
                    styles.container,
                    {transform: [{translateY}]},
                    overlapContent && styles.absoluteContainer,
                ]}
                onLayout={handleLayout}
            >
                <Appbar.Header>
                    <Appbar.Content
                        title={
                            <Text
                                style={[
                                    styles.title,
                                    centerTitle && styles.centeredTitle,
                                ]}
                            >
                                {appbarTitle}
                            </Text>
                        }
                    />
                    {appbarActions.map((action, index) => (
                        <React.Fragment key={index}>{action}</React.Fragment>
                    ))}
                </Appbar.Header>
            </Animated.View>

            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        overflow: 'hidden',
        zIndex: 1,
    },
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    centeredTitle: {
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
});

export default AppbarContainer;
