import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from "react-native-elements"
import {signOut} from '../../api/auth'
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from 'firebase'

export default ({route, navigation}) => {

    // arbitary current price for testing
    const currentPrice = 5
    const {URL} = route.params

    const setPrice = () => {
        if (targetPrice < 0) {
            setError('Target price must be positive')
            setFieldError('Error')
        } else if (targetPrice >= currentPrice) {
            setError('Target price must be less than current price')
            setFieldError('Error')       
        } else if (targetPrice === '') {
            setError('Target price cannot be empty')
            setFieldError('Error')
        } else {
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .add({
                // test URL
                URL: URL,
                TargetPrice: targetPrice
            })
            setTimeout(() => {
                navigation.replace('Homepage');
                }, 15000);
        }
    }

    const [targetPrice, setTargetPrice] = useState('');
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

    return (
        <KeyboardAvoidingView
            style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.logoText}>Add New Item</Text>
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
                value={targetPrice}
                onChangeText={(targetPrice) => setTargetPrice(targetPrice)}
                inputContainerStyle={[styles.textField, 
                    fieldError
                        ? styles.invalid 
                        : null]}
                underlineColorAndroid="transparent"
                placeholder="Set Target Price"
                autoCapitalize="none"
                keyboardType="number-pad"
            />
            <Button
                buttonStyle={styles.button} 
                onPress={setPrice}
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
        logoText: {
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
        regularText: {
            fontFamily: 'ProximaNova',
            fontSize: 18,
            color: 'black'
        },
        signUpText: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 18,
            color: '#133480',
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
        }
    })

