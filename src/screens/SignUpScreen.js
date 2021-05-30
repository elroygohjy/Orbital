import {Alert, StyleSheet, Text, KeyboardAvoidingView} from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import { createAccount } from '../../api/auth'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const SignUp = ({navigation}) => {
    const handlePress = () => {
        if (password != password1) {
            Alert.alert("Passwords do not match.")
        }
        createAccount({name, email, password},
            () => navigation.navigate('Login'), (error) => {console.error(error)})

    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [name, setName] = useState('');

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}>
                {/*
            <Input style={styles.textForLogin}
                   leftIcon={
                       <Icon
                           name="user"
                           color="#ccd9ff"
                           size={15}
                       />
                   }
                   placeholder="Username"
                   value={name}
                   onChangeText={(name) => setName(name)}
                   inputContainerStyle={styles.textField}
            />
                */}
            <Input
                style={styles.textForLogin}
                leftIcon={
                    <Icon
                        name="envelope"
                        color="#ccd9ff"
                        size={15}
                    />
                }
                placeholder="Email Address"
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                inputContainerStyle={styles.textField}
                inputContainerStyle={styles.textField}
            />

            <Input
                style={[styles.textForLogin, {justifyContent: 'flex-start'}]}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#ccd9ff"
                        size={20}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                inputContainerStyle={styles.textField}
            />
            <Input
                style={[styles.textForLogin, {justifyContent: 'flex-end'}]}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#ccd9ff"
                        size={20}
                    />
                }
                placeholder="Confirm password"
                value={password1}
                onChangeText={(password1) => setPassword1(password1)}
                secureTextEntry={true}
                inputContainerStyle={styles.textField}
            />

            <Button
                buttonStyle={styles.button} onPress={handlePress}
                titleStyle={styles.buttonText}
                title="Sign up"
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
            justifyContent: 'center'
        },
        button: {
            backgroundColor: "black",
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        },
        text: {
            fontFamily: 'ProximaNova'
        },
        textForLogin: {
            fontFamily: 'ProximaNova'
        },
        registerAcc: {
            fontFamily: 'ProximaNova'
        },
        names: {
            fontSize: 20,
            flexDirection: "row",
            color: "black",
        },
        textField: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 5,
            borderWidth: 5,
            borderColor: '#ffffff',
            borderRadius: 20,
            paddingLeft: 5
        }

    })
export default SignUp

