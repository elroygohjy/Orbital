import { StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, View } from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState, useEffect} from "react"
import {signIn, signInGoogle} from '../../api/auth'
import Icon from "react-native-vector-icons/FontAwesome"
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { set } from "react-native-reanimated"

export default ({navigation}) => {
    
    const handleLogin = () => {
        signIn({email, password}, () => navigation.replace('Homepage'), 
        (error) => {
            setError(error)
            setFieldError('Error')
        })
    }

    const loginGoogle = () => {
        signInGoogle(() => navigation.replace('Homepage'), 
        (error) => {
            setError(error)
            setFieldError('Error')
        })
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                <Text style={styles.logoText}>VALUE</Text>
                <Text style={styles.logoDollar}>$</Text>
            </View>
            <View style={styles.error}>
                {fieldError && <Text style={styles.errorText}>
                    {error.toString()}</Text>}
            </View>
            <Input
                style={styles.textBox}
                leftIcon={ 
                    <Icon
                        name="envelope"
                        color="#133480"
                        size={15}
                    />
                }
                value={email}
                onChangeText={(email) => setEmail(email)}
                inputContainerStyle={[styles.textField, 
                    fieldError 
                        ? styles.invalid 
                        : null]}
                underlineColorAndroid="transparent"
                placeholder="Email"
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <Input
                style={styles.textBox}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#133480"
                        size={20}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                inputContainerStyle={[styles.textField, 
                    fieldError 
                        ? styles.invalid 
                        : null]}
            />
            <Button
                buttonStyle={styles.button} 
                onPress={handleLogin}
                title="Login"
                titleStyle={styles.buttonText}
            />
            <Button
                iconRight
                buttonStyle={styles.buttonGoogle} 
                onPress={loginGoogle}
                title="Login with Google  "
                titleStyle={styles.buttonText}
                icon={
                    <Icon
                      name="google"
                      size={15}
                      color="white"
                    />
                }
            />              
            <View style={styles.row}>
                <Text style={styles.regularText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                    <Text style={styles.signUpText}>Sign up.</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
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
            fontSize: 45,
            letterSpacing: 2,
            paddingRight: 3
        },
        logoDollar: {
            fontFamily: 'ProximaNova',
            fontWeight: 'normal',
            fontSize: 55,
            marginTop: -7,
            color: '#133480'
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
        buttonGoogle: {
            backgroundColor: "black",
            borderRadius: 20,
            width: 295
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

