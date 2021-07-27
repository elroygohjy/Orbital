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

    var {id, target, currentPrice} = route.params
    currentPrice = parseFloat(currentPrice.substring(1))

    const [targetPrice, setTargetPrice] = useState(target.toString());
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState('')

    var countDecimals = function(value) {
        if (!value.includes(".")) {
            return 0
        }
        else if (Math.floor(value) !== value) {
            return value.toString().split(".")[1].length || 0;
        }
        return 0;
    }

    const setPrice = () => {
        if (isNaN(targetPrice)) {
            setError('Target price must be a number')
            setFieldError('Error')
        }
        else if (target == targetPrice) {
            setError('New target price cannot be the same as the old target price')
            setFieldError('Error')
        }
        else if (targetPrice <= 0) {
            setError('Target price must be positive')
            setFieldError('Error')
        } 
        else if (countDecimals(targetPrice) > 2) {
            setError('Target price must be a valid price (in dollars and cents)')
            setFieldError('Error')
        } /*
        else if (targetPrice >= currentPrice) {
            setError('Target price must be less than current price')
            setFieldError('Error')       
        } */
        else if (targetPrice == '') {
            setError('Target price cannot be empty')
            setFieldError('Error')
        } 
        else {
            var sliced = 0
            if (targetPrice.substr(-1) == '.') {
                sliced = targetPrice.substring(0, targetPrice.length - 1)
            }
            
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .doc(id)
            .update({TargetPrice: sliced == 0 ? parseFloat(targetPrice) : sliced})
        
            navigation.goBack()
        }
    }

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
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.header}>Edit Target Price</Text>
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
                        onPress={() => setTargetPrice('')}
                        style={styles.icon}
                    />
                }
                defaultValue={targetPrice}
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
        title: {
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

