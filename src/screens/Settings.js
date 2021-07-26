import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, 
    KeyboardAvoidingView, TouchableOpacity, Switch} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from '../../api/authkey'
import "firebase/functions";

export default ({navigation}) => {

    const [isDark, setDark] = useState(false); //get from firebase
    const toggleSwitch = async () => 
    {
        setDark(previousState => !previousState)
        // console.log(isDark)
        await firebase.firestore().doc('users/' + firebase.auth().currentUser.email).update({
            darkMode: isDark})
    } //update firebase

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await firebase
            .firestore()
            .doc('users/' + firebase.auth().currentUser.email)
            .get()
            .then(doc => {
                 setDark(doc.data().darkMode)
                 console.log(isDark)
            })
            .catch(err => {
                console.log('Error getting documents', err)
            });
        });
        return unsubscribe
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: '#AAAAAA'},
            headerLeft: () => (
                <TouchableOpacity style={styles[isDark.toString()].icon} 
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
        <KeyboardAvoidingView style={styles[isDark.toString()].container}>
            <View style={styles[isDark.toString()].row}>
                <Text style={styles[isDark.toString()].setting}>Dark Mode</Text>
                <Switch
                    style={styles[isDark.toString()].switch}
                    trackColor={{false: "#767577", true: "#81b0ff"}}
                    thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
                    onChange={() => 
                        {
                            firebase.firestore().doc('users/' + firebase.auth().currentUser.email).update({
                                darkMode: !isDark})
                            setDark(previousState => !previousState)
                        }}
                    value={isDark}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = {"true": StyleSheet.create( // dark mode
    {
        container: {
            paddingHorizontal: '5%',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            fontFamily: 'ProximaNova',
            backgroundColor: '#464646'
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
            marginBottom: 5,
            color: "white"
        },
        icon: {
            padding: 20
        },
        switch: {
            marginLeft: '53%',
            marginTop: -5
        }
    }), "false": StyleSheet.create( // light mode
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
                marginBottom: 5,
                color: "black"
            },
            icon: {
                padding: 20
            },
            switch: {
                marginLeft: '53%',
                marginTop: -5
            }
        })}

