import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, 
    KeyboardAvoidingView, TouchableOpacity, Switch,
    Modal, Pressable} from 'react-native';
import {Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from '../../api/authkey'
import "firebase/functions";
import { Dimensions } from 'react-native';

export default ({navigation}) => {

    const [isDark, setDark] = useState(false); //get from firebase
    const [modeLoaded, setModeLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)

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
                 //console.log(isDark)
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

    const deleteItems = () => {
        firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.email + '/items')
        .get()
        .then(querySnapshot => {
            querySnapshot.docs.forEach(snapshot => {
                snapshot.ref.delete();
        })})
        .catch((error) => {
            console.error("Error deleting items: ", error);
        })

        setModal2Visible(true)
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
            <View style={styles[isDark.toString()].row}>
                <Text style={styles[isDark.toString()].clear}>Delete All Items</Text>
                <Button
                    buttonStyle={styles[isDark.toString()].buy}
                    title="Clear"
                    titleStyle={styles[isDark.toString()].buttonText}
                    onPress={() => {setModalVisible(true)}}
                />
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
            <View style={styles[isDark.toString()].centeredView}>
                <View style={styles[isDark.toString()].modalView}>
                    <Text style={styles[isDark.toString()].notifs}>Are you sure you want to clear all added items?</Text>
                    <Pressable
                        style={[styles[isDark.toString()].button, styles[isDark.toString()].buttonClose]}
                        onPress={() => {
                            setModalVisible(!modalVisible)
                            deleteItems()
                        }}>
                        <Text style={styles[isDark.toString()].textStyle}>Confirm</Text>
                    </Pressable>
                    <Pressable
                        style={[styles[isDark.toString()].button, styles[isDark.toString()].buttonCancel]}
                        onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                        <Text style={styles[isDark.toString()].textStyle}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={() => {
                    setModalVisible(!modal2Visible);
                }}
            >
            <View style={styles[isDark.toString()].centeredView}>
                <View style={styles[isDark.toString()].modalView}>
                    <Text style={styles[isDark.toString()].notifs}>Items cleared successfully.</Text>
                    <Pressable
                        style={[styles[isDark.toString()].button, styles[isDark.toString()].buttonOkay]}
                        onPress={() => {
                            setModal2Visible(!modal2Visible)
                        }}>
                        <Text style={styles[isDark.toString()].textStyle}>Ok</Text>
                    </Pressable>
                </View>
            </View>
            </Modal>
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
            padding: 5
        },
        setting: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            marginLeft: 5,
            marginBottom: 5,
            color: "white"
        },
        clear: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            marginTop: 5,
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
        },
        switch2: {
            marginLeft: '11%',
            marginTop: -5
        },
        buy: {
            backgroundColor: "red",
            borderRadius: 20,
            width: 60,
            marginLeft: '52%'
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        },
        centeredView: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderColor: 'black',
            borderWidth: 2,
            width: 300
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        buttonOpen: {
            backgroundColor: "#F194FF",
        },
        buttonClose: {
            backgroundColor: "red",
            marginTop: 15,
            marginBottom: -5
        },
        buttonOkay: {
            backgroundColor: "#133480",
            marginTop: 15,
            marginBottom: -5
        },
        buttonCancel: {
            backgroundColor: "grey",
            marginTop: 15,
            marginBottom: -5
        },
        textStyle: {
            color: "white",
            fontFamily: 'ProximaNova',
            fontSize: 15,
            textAlign: "center"
        },
        notifs: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            textAlign: 'center',
            paddingBottom: 10
        },
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
                padding: 5
            },
            setting: {
                fontFamily: 'ProximaNovaBold',
                fontSize: 20,
                marginLeft: 5,
                marginBottom: 5,
                color: "black"
            },
            clear: {
                fontFamily: 'ProximaNovaBold',
                fontSize: 20,
                marginTop: 5,
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
            },
            switch2: {
                marginLeft: '11%',
                marginTop: -5
            },
            buy: {
                backgroundColor: "red",
                borderRadius: 20,
                width: 60,
                marginLeft: '52%'
            },
            buttonText: {
                fontFamily: 'ProximaNova'
            },
            centeredView: {
                flex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(100,100,100, 0.5)',
                alignItems: 'center',
                justifyContent: 'center'
            },
            modalView: {
                margin: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                borderColor: 'black',
                borderWidth: 2,
                width: 300
            },
            button: {
                borderRadius: 20,
                padding: 10,
                elevation: 2
            },
            buttonOpen: {
                backgroundColor: "#F194FF",
            },
            buttonClose: {
                backgroundColor: "#133480",
                marginTop: 15,
                marginBottom: -5
            },
            buttonCancel: {
                backgroundColor: "grey",
                marginTop: 15,
                marginBottom: -5
            },
            buttonOkay: {
                backgroundColor: "#133480",
                marginTop: 15,
                marginBottom: -5
            },
            textStyle: {
                color: "white",
                fontFamily: 'ProximaNova',
                fontSize: 15,
                textAlign: "center"
            },
            notifs: {
                fontFamily: 'ProximaNovaBold',
                fontSize: 20,
                textAlign: 'center',
                paddingBottom: 10
            },
        })}

