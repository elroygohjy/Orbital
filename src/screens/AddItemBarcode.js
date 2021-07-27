import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView,
ActivityIndicator, TouchableOpacity, ScrollView,
BackHandler} from 'react-native';
import {Input, Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import Icon1 from "react-native-vector-icons/FontAwesome"
import firebase from 'firebase'
import { getDevicePushTokenAsync, getExpoPushTokenAsync } from 'expo-notifications';
import { getInstallReferrerAsync } from 'expo-application';

export default ({route, navigation}) => {

    var value = ''
    var {test} = route.params
    // console.log(test)
    
    const [URL, setURL] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [editable, setEditable] = useState(true)
    const [loading, setLoading] = useState(false)

    var countDecimals = function(value) {
        if (!value.includes(".")) {
            return 0
        }
        else if (Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    }
    
    const getItemKey = async () => {
       var count = 0;
       await firebase
       .firestore()
       .doc('users/' + firebase.auth().currentUser.email)
       .get()
       .then(doc => {
           count = doc.data().itemKeyCounter
           firebase
           .firestore()
           .doc('users/' + firebase.auth().currentUser.email)
           .update({itemKeyCounter: count + 1})
       })
       .catch(err => {
           console.log('Error getting documents', err)
       });
       return count
    }

    const getItemSite = () => {
        if (URL.includes("shopee")) {
            return "shopee"
        } else if (URL.includes("qoo10")) {
            return "qoo10"
        } else if (URL.includes("ebay")) {
            return "ebay"
        }
    }

    const setPrice = async () => {
        if (isNaN(targetPrice)) {
            setError('Target price must be a number')
            setFieldError('Error')
            setLoading(false)
        }
        else if (targetPrice <= 0) {
            setError('Target price must be positive')
            setFieldError('Error')
            setLoading(false)
        }
        else if (countDecimals(targetPrice) > 2) {
            setError('Target price must be a valid price (in dollars and cents)')
            setFieldError('Error')
            setLoading(false)
        }
        else if (targetPrice === '') {
            setError('Target price cannot be empty')
            setFieldError('Error')
            setLoading(false)
        }
        else {
            var sliced = 0
            if (targetPrice.substr(-1) == '.') {
                sliced = targetPrice.substring(0, targetPrice.length - 1)
            }

            setDisabled(true)
            setFieldError(null)
            setEditable(false)
            await firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .add({
                URL: value,
                TargetPrice: sliced == 0 ? parseFloat(targetPrice) : sliced,
                itemKey: "2",
                edited: false,
                itemKey: await getItemKey(),
                site: getItemSite()
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
            setEditable(true)
            if (doc.exists) {
                if (doc.data().name == "Broken URL is given, did you copied correctly?") {
                    setLoading(false)
                    setError('Invalid URL entered')
                    setFieldError('Error')
                    doc.ref.delete()
                }/*
                else if (targetPrice >= parseFloat(doc.data().price.replace(/[^\d.-]/g, ""))) {
                    setError('Target price must be less than current price')
                    setFieldError('Error')
                    doc.ref.delete()
                }*/
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
        let checkURL = URL.includes('shopee.sg/') || URL.includes('qoo') || URL.includes('ebay')
        if (checkURL) {
            value = URL
            // setURL('')
            setLoading(true)
            setPrice()
        } else {
            console.log(URL)
            setError('Invalid URL entered')
            setFieldError('Error')
            setDisabled(false)
            setEditable(true)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setFieldError(null)
            console.log(route)
            if (route.params !== undefined) {
                console.log(route.params['test'])
            }
            setURL(test)
        });
        return unsubscribe
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.headerIcon}
                onPress={() => navigation.reset({routes: [{ name: 'Homepage' }]})}>
                    <Icon1
                        name="arrow-left"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            )
        });
    }, []);

    useEffect(() => {
        const backAction = () => {
            navigation.reset({routes: [{ name: 'Homepage' }]})
            return true;
        };

        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );

        return () => backHandler.remove();
    }, []);
      

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });

    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" style={{paddingTop: 12}} animating={loading}/>
            <View style={styles.row}>
                <Text style={styles.header}>Add New Item</Text>
                <Text style={styles.message}>Item URL was obtained successfully. Set a target price now.</Text>
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
                        onPress={() => editable ? setTargetPrice('') : {}}
                        style={styles.icon}
                    />
                }
                editable={editable}
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
        </ScrollView>
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
            flexDirection: 'column',
            marginTop: 100,
            marginBottom: 20,
            fontFamily: 'ProximaNova'
        },
        message: {
            fontFamily: 'ProximaNova',
            fontSize: 15,
            textAlign: 'center',
            padding: 13
        },
        header: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 30,
            textAlign: 'center'
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
        },
        headerIcon: {
            padding: 20
        },
    })

/* <Input
                style={styles.textBox}
                multiline={false}
                leftIcon={
                    <Icon
                        name="internet-explorer"
                        color="#133480"
                        size={15}
                    />
                }
                rightIcon={
                    <Icon
                        name="remove"
                        color="#133480"
                        size={15}
                        onPress={() => editable ? setURL('') : {}}
                        style={styles.icon}
                    />
                }
                defaultValue={URL}
                value={URL}
                onChangeText={(URL) => setURL(URL)}
                inputContainerStyle={[styles.textField,
                    fieldError
                        ? styles.invalid
                        : null]}
                underlineColorAndroid="transparent"
                placeholder="Enter URL"
                autoCapitalize="none"
            />*/