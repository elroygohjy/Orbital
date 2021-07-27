import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from 'firebase'
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

export default ({route, navigation}) => {

    var {id, item} = route.params

    const [itemName, setItemName] = useState(item);
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState('')

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setFieldError(null)
        });
        return unsubscribe
    }, [navigation]);

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    const setName = () => {
        firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .doc(id)
            .update({name: itemName, edited: true})
        
            navigation.goBack()
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>Edit Item Name</Text>
            </View>
            <View style={styles.error}>
                {fieldError && <Text style={styles.errorText}>
                    {error.toString()}</Text>}
            </View>
            <Input
                style={styles.textBox}
                leftIcon={ 
                    <Icon
                        name="dollar"
                        color="#133480"
                        size={15}
                    />
                }
                rightIcon={
                    <Icon
                        name="remove"
                        color="#133480"
                        size={15}
                        onPress={() => setItemName('')}
                        style={styles.icon}
                    />
                }
                defaultValue={itemName}
                value={itemName}
                multiline={true}
                onChangeText={(itemName) => setItemName(itemName)}
                inputContainerStyle={[styles.textField, 
                    fieldError
                        ? styles.invalid 
                        : null]}
                underlineColorAndroid="transparent"
                placeholder="Set Item Name"
                autoCapitalize="none"
            />
            <Button
                buttonStyle={styles.button} 
                onPress={setName}
                title="Confirm"
                titleStyle={styles.buttonText}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '10%',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            fontFamily: 'ProximaNova'
        },
        row: {
            flexDirection: 'row',
            marginTop: 100,
            marginBottom: 20,
            fontFamily: 'ProximaNova',
        },
        header: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 30
        },
        textBox: {
            fontFamily: 'ProximaNova',
            paddingLeft: 15
        },
        textField: {
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
            borderWidth: 5,
            borderBottomWidth: 2,
            borderRadius: 20,
            paddingLeft: 10,
        },
        button: {
            backgroundColor: "#133480",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        buttonText: {
            fontFamily: 'ProximaNova',
        },
        invalid: {
            borderColor: 'red',
            borderWidth: 2
        },
        error: {
            padding: 15
        },
        errorText: {
            fontFamily: 'ProximaNova',
            fontSize: 20,
            textAlign: 'center'
        },
        icon: {
            marginRight: 5
        }
    })

