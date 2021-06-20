import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"

export default ({navigation}) => {

    const addItem = () => {
        if (URL.includes('shopee.sg/')) {
            const value = URL
            setURL('')
            navigation.navigate("Set Price", {"URL": value})
        } else {
            setError('Invalid URL entered')
            setFieldError('Error')
        }
    }

    const [URL, setURL] = useState('');
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
        <KeyboardAvoidingView style={styles.container}>
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
            <Button
                buttonStyle={styles.button} 
                onPress={addItem}
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

