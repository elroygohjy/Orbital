import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from 'firebase'

export default ({navigation}) => {

    var value = ''

    var countDecimals = function(value) {
        if (!value.includes(".")) {
            return 0
        }
        else if (Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    }

    const setPrice = () => {
        if (isNaN(targetPrice)) {
            setError('Target price must be a number')
            setFieldError('Error')
        }
        else if (targetPrice <= 0) {
            setError('Target price must be positive')
            setFieldError('Error')
        }
        else if (countDecimals(targetPrice) > 2) {
            setError('Target price must be a valid price (in dollars and cents)')
            setFieldError('Error')
        }
        else if (targetPrice === '') {
            setError('Target price cannot be empty')
            setFieldError('Error')
        }
        else {
            var sliced = 0
            if (targetPrice.substr(-1) == '.') {
                sliced = targetPrice.substring(0, targetPrice.length - 1)
            }

            setDisabled(true)
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .add({
                URL: value,
                Targetprice: sliced == 0 ? targetPrice : sliced
            })
            .then(doc => {
                setTimeout(() => check(doc.id), 10000)
            })
        }
    }

    const check = (id) => {
        firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.email + '/items')
        .doc(id)
        .get().then((doc) => {
            setDisabled(false)
            if (doc.exists) {
                if (doc.data().price == "Broken URL is given, did you copied correctly?") {
                    setError('Invalid URL entered')
                    setFieldError('Error')
                    doc.ref.delete()
                }
                else if (targetPrice >= parseFloat(doc.data().price.substring(1))) {
                    setError('Target price must be less than current price')
                    setFieldError('Error')
                    doc.ref.delete()
                }
                else {
                    navigation.reset({routes: [{ name: 'Homepage' }]});
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    }

    const addItem = () => {
        let checkURL = URL.includes('shopee.sg/') || URL.includes('qoo') || URL.includes('amazon') || URL.includes('ebay')
        if (checkURL) {
            value = URL
            // setURL('')
            setPrice()
        } else {
            setError('Invalid URL entered')
            setFieldError('Error')
            setDisabled(false)
        }
    }

    const [URL, setURL] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)

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
            <View style={styles.row}>
                <Text style={styles.header}>Add New Item</Text>
            </View>
            <View style={styles.error}>
                {fieldError && <Text style={styles.errorText}>
                    {error.toString()}</Text>}
            </View>
            <Input
                style={styles.textBox}
                leftIcon={
                    <Icon
                        name="internet-explorer"
                        color="#133480"
                        size={15}
                    />
                }
                value={URL}
                onChangeText={(URL) => setURL(URL)}
                inputContainerStyle={[styles.textField,
                    fieldError
                        ? styles.invalid
                        : null]}
                underlineColorAndroid="transparent"
                placeholder="Enter URL"
                autoCapitalize="none"
            />
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
                buttonStyle={styles.button} fs
                onPress={addItem}
                title="Confirm"
                titleStyle={styles.buttonText}
                disabled={disabled}
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
            fontSize: 30,
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
        }
    })

