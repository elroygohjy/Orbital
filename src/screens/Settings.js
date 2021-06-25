import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, 
    KeyboardAvoidingView, TouchableOpacity, Switch} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"

export default ({navigation}) => {

    const [isDark, setDark] = useState(false);
    const toggleSwitch = () => setDark(previousState => !previousState);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.icon} 
                    onPress={() => navigation.toggleDrawer()}>
                    <Icon
                        name="bars"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            )
        });
    }, []);

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.setting}>Dark Mode</Text>
                <Switch
                    style={styles.switch}
                    trackColor={{false: "#767577", true: "#81b0ff"}}
                    thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isDark}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '5%',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            fontFamily: 'ProximaNova'
        },
        row: {
            flexDirection: 'row',
            marginTop: 15,
            fontFamily: 'ProximaNova',
        },
        setting: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            marginLeft: 5,
            marginBottom: 5
        },
        icon: {
            padding: 20
        },
        switch: {
            marginLeft: '53%',
            marginTop: -5
        }
    })

